"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CreditCard,
  Users,
  FileText,
  Activity,
  Search,
  Filter,
  X,
  IndianRupee,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";

export default function Revenue() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filteredRows = payments.filter((r) => {
    const matchesName = r.doc_name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    const matchesStatus =
      paymentFilter === "all" ? true : r.status === paymentFilter;
    return matchesName && matchesStatus;
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`/patient/payments`, {
          withCredentials: true,
        });
        setPayments(res.data.payments);
      } catch (err) {
        // ignore error
      }
    };
    fetchPayments();
  }, []);

  const getStatusClasses = (s: string) => {
    switch (s) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const totalBill = payments.reduce(
    (total, item) => total + Number(item.amount_received),
    0,
  );
  const uniqueDoctors = new Set(payments.map((item) => item.doc_id)).size;

  return (
    <div className="space-y-6 font-sans text-black">
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <IndianRupee size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Bill</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{totalBill.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-800">
                {uniqueDoctors}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Treatments</p>
              <p className="text-2xl font-bold text-gray-800">
                {payments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Reports</p>
              <p className="text-2xl font-bold text-gray-800">
                {payments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-black appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Clear Button */}
          <button
            onClick={() => {
              setSearchQuery("");
              setPaymentFilter("all");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <X size={16} /> Clear
          </button>
        </div>
      </div>

      {/* 3. Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <CreditCard size={20} className="text-blue-600" />
            Transaction History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Doctor</th>
                <th className="py-3 px-6">Disease</th>
                <th className="py-3 px-6">Consultation</th>
                <th className="py-3 px-6">Paid Amount</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRows.length > 0 ? (
                filteredRows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {r.date}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {r.doc_name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {r.disease}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      ₹{r.consultationFee}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-800">
                      ₹{r.amount_received}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClasses(
                          r.status,
                        )}`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No transactions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
