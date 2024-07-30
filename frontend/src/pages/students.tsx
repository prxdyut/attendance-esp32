import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { handleFetch } from "../utils/handleFetch";

export default function Students() {
  const [loading, setLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    handleFetch("/users?role=student", setLoading, setStudents, console.log);
  }, []);
  
  return (
    <React.Fragment>
      <div className=" flex flex-col gap-4">
        <p className=" font-semibold text-lg">Students</p>
        <div className=" border p-2 flex gap-2">
          <input className=" border" />
          <button className="border px-2 py-1">Search</button>
          <div className=" flex-grow" />
          <Link className=" border px-2 py-1" to="/students/new">
            Create Student
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
              {students.map((student, index) => (
                <tr key={student?._id}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{student?.name}</td>
                  <td className="p-2">{student?.batch?.name}</td>
                  <td className="p-2">{student?.phone}</td>
                  <td className="p-2">
                    <Link className=" border p-1"  to={`/students/${student?._id}`}>View</Link>
                    <Link className=" border p-1" to={`/students/${student?._id}/edit`}>Edit</Link>
                    <Link className=" border p-1" to={`/students/${student?._id}/delete`}>Del</Link>
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
