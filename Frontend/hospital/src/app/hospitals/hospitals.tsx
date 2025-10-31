import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HospitalCards from "../../components/HospitalCards";

export default function HospitalsPage({ hospitals }: { hospitals: any[] }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-1 py-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-10 text-center">
          Explore Registered Hospitals
        </h1>

        <div className="max-w-7xl mx-auto px-6">
          {Array.isArray(hospitals) && hospitals.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {hospitals.map((hospital) => (
                <div key={hospital._id} className="flex">
                  <div className="w-full max-w-md mx-auto">
                    <HospitalCards hospital={hospital} />
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <div className="text-center py-12 text-gray-600">
              No hospitals found.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
