// import Link from "next/link";
// import React from "react";

// export default function HospitalCards({ hospital }: { hospital: any }) {
//   const h = hospital || {};

//   return (
//     <article className="bg-white w-full rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
//       {/* Header Section */}
//       <div className="p-6  from-blue-50 to-emerald-50 border-b">
//         <h3 className="text-2xl font-bold text-slate-900">{h.hospital_name}</h3>
//         <p className="text-sm text-blue-600 mt-1 font-medium">
//           {h.hospital_type}
//         </p>
//       </div>

//       {/* Content Section */}
//       <div className="p-6 space-y-6 text-gray-700">
//         {/* Address */}
//         <div className="flex items-start gap-3">
//           <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg">
//             📍
//           </div>
//           <div>
//             <div className="text-xs font-semibold uppercase text-slate-600">
//               Location
//             </div>
//             <div className="text-sm">{h.hospital_address}</div>
//           </div>
//         </div>

//         {/* Working Hours */}
//         <div className="flex items-start gap-3">
//           <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg">
//             ⏰
//           </div>
//           <div>
//             <div className="text-xs font-semibold uppercase text-slate-600">
//               Working Hours
//             </div>
//             <div className="text-sm">{h.hospital_duration}</div>
//           </div>
//         </div>

//         {/* Rooms */}
//         <div className="flex items-start gap-3">
//           <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-lg">
//             🛏️
//           </div>
//           <div>
//             <div className="text-xs font-semibold uppercase text-slate-600">
//               Rooms
//             </div>
//             <div className="mt-2 flex flex-wrap gap-2">
//               <span className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
//                 AC: {h.ac_rooms}
//               </span>
//               <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
//                 Non-AC: {h.non_ac_rooms}
//               </span>
//               <span className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full">
//                 Total: {h.total_rooms}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Pharmacies */}
//         <div className="flex items-start gap-3">
//           <div className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-lg">
//             💊
//           </div>
//           <div>
//             <div className="text-xs font-semibold uppercase text-slate-600">
//               Connected Pharmacies
//             </div>
//             <div className="mt-2 flex flex-wrap gap-2">
//               {Array.isArray(h.connected_pharmacies) &&
//               h.connected_pharmacies.length > 0 ? (
//                 h.connected_pharmacies
//                   .slice(0, 3)
//                   .map((p: string, i: number) => (
//                     <span
//                       key={i}
//                       className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
//                     >
//                       {p}
//                     </span>
//                   ))
//               ) : (
//                 <span className="text-xs text-gray-500">None</span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* View Detail Button */}
//         <div className="pt-4">
//           <Link
//             href={`/hospital/${h._id}`}
//             className="block w-full text-center py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200"
//           >
//             View Details →
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }
import Link from "next/link";
import React from "react";
import { MapPin, Clock, BedDouble, Pill } from "lucide-react"; // Lucide icons

export default function HospitalCards({ hospital }: { hospital: any }) {
  const h = hospital || {};

  return (
    <article className="bg-white w-full rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Header Section */}
      <div className="p-6 from-blue-50 to-emerald-50 border-b">
        <h3 className="text-2xl font-bold text-slate-900">{h.hospital_name}</h3>
        <p className="text-sm text-blue-600 mt-1 font-medium">
          {h.hospital_type}
        </p>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6 text-gray-700">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <MapPin size={18} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-600">
              Location
            </div>
            <div className="text-sm">{h.hospital_address}</div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <Clock size={18} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-600">
              Working Hours
            </div>
            <div className="text-sm">{h.hospital_duration}</div>
          </div>
        </div>

        {/* Rooms */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <BedDouble size={18} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-600">
              Rooms
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                AC: {h.ac_rooms}
              </span>
              <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                Non-AC: {h.non_ac_rooms}
              </span>
              <span className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                Total: {h.total_rooms}
              </span>
            </div>
          </div>
        </div>

        {/* Pharmacies */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
            <Pill size={18} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-600">
              Connected Pharmacies
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.isArray(h.connected_pharmacies) &&
              h.connected_pharmacies.length > 0 ? (
                h.connected_pharmacies
                  .slice(0, 3)
                  .map((p: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      {p}
                    </span>
                  ))
              ) : (
                <span className="text-xs text-gray-500">None</span>
              )}
            </div>
          </div>
        </div>

        {/* View Detail Button */}
        <div className="pt-4">
          <Link
            href={`/hospital/${h._id}`}
            className="block w-full text-center py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200"
          >
            View Details →
          </Link>
        </div>
      </div>
    </article>
  );
}
