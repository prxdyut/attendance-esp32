import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { handleFetch } from "../utils/handleFetch";

export default function faculty() {
  const [loading, setLoading] = useState<boolean>(false);
  const [faculty, setfaculty] = useState<any[]>([]);

  useEffect(() => {
    handleFetch("/users?role=faculty", setLoading, setfaculty, console.log);
  }, []);
  
  return (
    <React.Fragment>
      <div className=" flex flex-col gap-4">
        <p className=" font-semibold text-lg">faculty</p>
        <div className=" border p-2 flex gap-2">
          <input className=" border" />
          <button className="border px-2 py-1">Search</button>
          <div className=" flex-grow" />
          <Link className=" border px-2 py-1" to="/faculty/new">
            Create faculty
          </Link>
        </div>
        <div className=" border p-2">
          <table className=" w-full border table-auto">
            <thead>
              <tr>
                <th className="text-start w-min p-2">Sr.</th>
                <th className=" w-[40%] text-start">Name</th>
                <th>Batch</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((faculty, index) => (
                <tr key={faculty?._id}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{faculty?.name}</td>
                  <td className="p-2">{faculty?.batch?.name}</td>
                  <td className="p-2">{faculty?.phone}</td>
                  <td className="p-2">
                    <Link className=" border p-1"  to={`/faculty/${faculty?._id}`}>View</Link>
                    <Link className=" border p-1" to={`/faculty/${faculty?._id}/edit`}>Edit</Link>
                    <Link className=" border p-1" to={`/faculty/${faculty?._id}/delete`}>Del</Link>
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
