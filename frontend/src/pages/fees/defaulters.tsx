import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";

export const Defaulters = () => {
  const [loading, setLoading] = useState(false);
  const [defaulters, setDefaulters] = useState([]);

  useEffect(() => {
    handleFetch(
      "/fees/defaulters",
      setLoading,
      (data) => setDefaulters(data.defaulters),
      console.error
    );
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Defaulters</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Fees</th>
            <th>Paid Amount</th>
            <th>Remaining Amount</th>
          </tr>
        </thead>
        <tbody>
          {defaulters.map((defaulter) => (
            <tr key={defaulter._id}>
              <td>{defaulter.name}</td>
              <td>{defaulter.totalFees}</td>
              <td>{defaulter.paidAmount}</td>
              <td>{defaulter.remainingAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

