import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import StudentsTable from "../../components/StudentsTable";
import FacultyTable from "../../components/FacultyTable";

export default function useres() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<{users: any[]}>({users: []});
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    handleFetch("/users?role=faculty", setLoading, setData, console.log);
  }, []);

  const filteredUsers = data.users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Faculty</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
            <div className="relative flex-grow mb-4 md:mb-0 md:mr-4">
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search useres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <Link
              to="/useres/new"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              <Plus size={20} className="mr-2" />
              Create user
            </Link>
          </div>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading useres...</p>
          </div>
        ) }
        {filteredUsers && <FacultyTable faculty={filteredUsers} />}
      </div>
      <Outlet />
    </div>
  );
}