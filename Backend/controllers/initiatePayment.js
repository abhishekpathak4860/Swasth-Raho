import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";
import Payment from "../models/Payment.js";

dotenv.config();

const {
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_VERSION,
  PHONEPE_TOKEN_URL,
  PHONEPE_PAY_URL,
  PHONEPE_REDIRECT_URL,
} = process.env;

//  STEP 1: Get PhonePe Access Token
async function getAccessToken() {
  const body = querystring.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    client_version: CLIENT_VERSION,
    grant_type: "client_credentials",
  });

  const resp = await axios.post(PHONEPE_TOKEN_URL, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return resp.data.access_token;
}

//  MAIN FUNCTION: Initiate Payment
export const initiatePayment = async (req, res) => {
  try {
    const {
      appointmentId,
      p_id,
      doc_id,
      p_name,
      doc_name,
      disease,
      consultationFee,
      date,
    } = req.body;

    // 1️ CREATE TRANSACTION ID
    const txnId = "txn_" + Date.now();

    // 2️ CREATE PAYMENT ENTRY IN MONGODB
    const newPayment = await Payment.create({
      appointmentId,
      p_id,
      doc_id,
      p_name,
      doc_name,
      disease,
      consultationFee: consultationFee,
      amount_received: "0",
      txnId,
      status: "pending",
      date,
    });

    // 3️ GET ACCESS TOKEN FROM PHONEPE
    const token = await getAccessToken();

    // 4️ BUILD PAYLOAD FOR PHONEPE
    const payload = {
      merchantOrderId: txnId,
      amount: Math.round(Number(consultationFee) * 100), // convert to paise
      expireAfter: 1200,
      metaInfo: {
        udf1: appointmentId,
        udf2: p_name,
        udf3: doc_name,
        udf4: disease,
        udf5: "Appointment Payment",
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Complete your consultation payment",
        merchantUrls: {
          redirectUrl: `${PHONEPE_REDIRECT_URL}/admin/patient/appointments?source=phonepe`,
        },
      },
    };

    // 5️ CALL PHONEPE CHECKOUT API
    const phonepeResp = await axios.post(PHONEPE_PAY_URL, payload, {
      headers: {
        Authorization: `O-Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const redirectUrl = phonepeResp.data.redirectUrl;

    if (!redirectUrl) {
      return res.status(400).json({
        success: false,
        message: "PhonePe did not return redirect URL",
        data: phonepeResp.data,
      });
    }

    // 6️ Save txnId cookie
    res.cookie("txnId", txnId, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    // 7️ Send redirect URL back to frontend
    return res.json({
      success: true,
      redirectUrl,
    });
  } catch (error) {
    console.error("Error initiating payment:", error.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: error.response?.data || error.message,
    });
  }
};
