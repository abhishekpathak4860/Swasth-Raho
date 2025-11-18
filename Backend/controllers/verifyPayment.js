import axios from "axios";
import querystring from "querystring";
import Payment from "../models/Payment.js";

// ENV
const {
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_VERSION,
  PHONEPE_TOKEN_URL,
  PHONEPE_STATUS_URL,
} = process.env;

// Get OAUTH Access Token

async function getAccessToken() {
  const formData = querystring.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    client_version: CLIENT_VERSION,
    grant_type: "client_credentials",
  });

  const resp = await axios.post(PHONEPE_TOKEN_URL, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return resp.data.access_token;
}

// VERIFY PAYMENT CONTROLLER

export const verifyPayment = async (req, res) => {
  try {
    // 1 cookie se txnId nikalo
    const txnId = req.cookies.txnId;

    if (!txnId) {
      return res
        .status(400)
        .json({ error: "Transaction ID not found in cookie" });
    }

    // 2 OAuth token
    const token = await getAccessToken();

    // 3 Create status URL
    const url = `${PHONEPE_STATUS_URL}/${txnId}/status`;

    // 4 Hit PhonePe status API
    const statusResp = await axios.get(url, {
      headers: { Authorization: `O-Bearer ${token}` },
    });

    const phonepeStatus = statusResp?.data?.state;
    console.log("PhonePe Payment Status:", phonepeStatus);

    // 5 Payment record fetch karo (mongodb se)
    const payment = await Payment.findOne({ txnId });

    if (!payment) {
      return res
        .status(404)
        .json({ error: "No payment record found for this txnId" });
    }

    // 6 Update payment according to status
    if (phonepeStatus === "COMPLETED") {
      payment.status = "paid";
      payment.amount_received = payment.consultationFee; // full received
    } else if (phonepeStatus === "FAILED") {
      payment.status = "failed";
      payment.amount_received = "0";
    } else {
      payment.status = "pending";
      payment.amount_received = "0";
    }

    await payment.save();

    // 7 Return status to frontend
    return res.json({
      success: true,
      txnId,
      status: phonepeStatus,
    });
  } catch (err) {
    console.error(
      "Payment status check error:",
      err?.response?.data || err.message
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
