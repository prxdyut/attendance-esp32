import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { handleFetch } from "../utils/handleFetch";

export default function Batches() {
  const [loading, setLoading] = useState<boolean>(false);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    handleFetch("/batches", setLoading, setBatches, console.log);
  }, []);

  return (
    <React.Fragment>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Batches</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <input
              className="flex-grow border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search batches..."
            />
            <button className="bg-blue-500 text-white py-2 px-4 rounded-r-md hover:bg-blue-600 transition duration-300">
              Search
            </button>
          </div>
          <Link
            to="/batches/new"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
          >
            Create Batch
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map((batch, index) => (
                <tr key={batch._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{batch.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">61</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        to={`/statistics?batch=${batch._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <Link
                        to={`/batches/${batch._id}/edit`}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/batches/${batch._id}/delete`}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Outlet />
    </React.Fragment>
  );
}