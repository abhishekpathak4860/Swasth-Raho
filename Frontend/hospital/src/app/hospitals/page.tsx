export const dynamic = "force-dynamic";

import { getHospitalDataFromServer } from "../../../lib/get-hospitalData";
import HospitalsPage from "./hospitals";

export default async function HospitalDetailsPage() {
  try {
    // Fetch all hospital data from the server
    const hospitals = await getHospitalDataFromServer();

    // If no hospital found
    if (!hospitals) {
      return (
        <div className="text-center text-red-500 mt-10">Hospital not found</div>
      );
    }

    // Pass the filtered hospital to your detail component
    return <HospitalsPage hospitals={hospitals} />;
  } catch (error) {
    console.error("Error fetching hospital data:", error);
    return (
      <div className="text-center text-red-500 mt-10">
        Something went wrong while loading hospital details
      </div>
    );
  }
}
