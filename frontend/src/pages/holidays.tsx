import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { handleFetch } from '../utils/handleFetch';

function Holidays() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    handleFetch(
      '/holidays',
      setLoading,
      (data: any[]) => setHolidays(data),
      console.log
    );
  }, []);

  return (
    <React.Fragment>
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-lg">Holidays</p>
        <div className="border p-2 flex gap-2">
          <input className="border" />
          <button className="border px-2 py-1">Search</button>
          <div className="flex-grow" />
          <Link className="border px-2 py-1" to="/holidays/new">
            Create Holiday
          </Link>
        </div>
        <div className="border p-2">
            <table className="w-full border table-auto">
              <thead>
                <tr>
                  <th className="text-start w-min p-2">Sr.</th>
                  <th className="w-[40%] text-start">Event</th>
                  <th>Target</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday, index) => (
                  <tr key={holiday._id}>
                    <td>{index + 1}</td>
                    <td>{holiday.event}</td>
                    <td>{holiday.all ? 'All' : holiday.batchIds.length > 0 ? 'Batch' : 'User'}</td>
                    <td>{new Date(holiday.date).toLocaleDateString()}</td>
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

export default Holidays;