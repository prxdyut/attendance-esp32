import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";

export default function Batches() {
  const [loading, setLoading] = useState<boolean>(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    handleFetch("/batches", setLoading, setBatches, console.log);
  }, []);

  const filteredBatches = batches.filter((batch) =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Batches</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
            <div className="relative flex-grow mb-4 md:mb-0 md:mr-4">
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <Link
              to="/batches/new"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              <Plus size={20} className="mr-2" />
              Create Batch
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading batches...</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBatches.map((batch, index) => (
                    <tr key={batch._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">61</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link to={`/batches/${batch._id}`} className="text-blue-600 hover:text-blue-900">
                            <Eye size={18} />
                          </Link>
                          <Link to={`/batches/${batch._id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                            <Edit size={18} />
                          </Link>
                          <Link to={`/batches/${batch._id}/delete`} className="text-red-600 hover:text-red-900">
                            <Trash2 size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
}