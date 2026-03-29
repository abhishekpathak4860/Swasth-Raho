// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import HospitalCards from "../../components/HospitalCards";

// export default function HospitalsPage({ hospitals }: { hospitals: any[] }) {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />

//       <main className="flex-1 container mx-auto px-1 py-4">
//         <h1 className="text-3xl font-bold text-slate-800 mb-10 text-center">
//           Explore Registered Hospitals
//         </h1>

//         <div className="max-w-7xl mx-auto px-6">
//           {Array.isArray(hospitals) && hospitals.length > 0 ? (
//             <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {hospitals.map((hospital) => (
//                 <div key={hospital._id} className="flex">
//                   <div className="w-full max-w-md mx-auto">
//                     <HospitalCards hospital={hospital} />
//                   </div>
//                 </div>
//               ))}
//             </section>
//           ) : (
//             <div className="text-center py-12 text-gray-600">
//               No hospitals found.
//             </div>
//           )}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HospitalCards from "../../components/HospitalCards";

interface Hospital {
  _id: string;
  [key: string]: any;
}

export default function HospitalsPage({
  hospitals,
}: {
  hospitals: Hospital[];
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* pt-20 fixes heading hidden under header */}

        {/* Heading */}
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-800 mb-8 sm:mb-10 text-center leading-snug">
          Explore Registered Hospitals
        </h1>

        {/* Content Wrapper */}
        <div className="max-w-7xl mx-auto">
          {Array.isArray(hospitals) && hospitals.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {hospitals.map((hospital) => (
                <div key={hospital._id} className="w-full">
                  <HospitalCards hospital={hospital} />
                </div>
              ))}
            </section>
          ) : (
            <div className="text-center py-12 text-gray-600 text-base sm:text-lg">
              No hospitals found.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
