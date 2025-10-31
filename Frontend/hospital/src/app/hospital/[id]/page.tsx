export const dynamic = "force-dynamic";

import HospitalDetailData from "./HospitalDetailData";
import { getHospitalDataFromServer } from "../../../../lib/get-hospitalData";

export default async function HospitalDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    console.log("params.id:", params.id);
    // Fetch all hospital data from the server
    const hospitals = await getHospitalDataFromServer();

    // Filter the hospital matching the current ID from params
    const hospital = hospitals.find((item: any) => item._id === params.id);

    // If no hospital found
    if (!hospital) {
      return (
        <div className="text-center text-red-500 mt-10">Hospital not found</div>
      );
    }

    // Pass the filtered hospital to your detail component
    return <HospitalDetailData hospital={hospital} />;
  } catch (error) {
    console.error("Error fetching hospital data:", error);
    return (
      <div className="text-center text-red-500 mt-10">
        Something went wrong while loading hospital details
      </div>
    );
  }
}
