import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { handleFetch } from "../utils/handleFetch";

export default function Batches() {
  const [loading, setLoading] = useState<boolean>(false);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    handleFetch("/batches", setLoading, setBatches, console.log);
  }, []);
  console.log(batches);
  return (
    <React.Fragment>
      <div className=" flex flex-col gap-4">
        <p className=" font-semibold text-lg">Batches</p>
        <div className=" border p-2 flex gap-2">
          <input className=" border" />
          <button className="border px-2 py-1">Search</button>
          <div className=" flex-grow" />
          <Link className=" border px-2 py-1" to="/batches/new">
            Create Batch
          </Link>
        </div>
        <div className=" border p-2">
          <table className=" w-full border table-auto">
            <thead>
              <tr>
                <th className="text-start w-min p-2">Id</th>
                <th className=" w-[40%] text-start">Name</th>
                <th className="">Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch, index) => (
                <tr key={batch._id}>
                  <td>{index + 1}</td>
                  <td>{batch.name}</td>
                  <td>61</td>
                  <td className=" flex gap-2">
                    <Link to={`/statistics?batch=${batch._id}`} className=" border">
                      view
                    </Link>
                    <Link to={`/batches/${batch._id}/edit`} className=" border">
                      edit
                    </Link>
                    <Link to={`/batches/${batch._id}/delete`} className=" border">
                      delete
                    </Link>
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
