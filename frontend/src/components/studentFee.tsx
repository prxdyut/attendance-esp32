// components/StudentFeeDetails.tsx

import React, { useState, useEffect } from "react";
import { handleFetch } from "../utils/handleFetch";
import { TargetSelector } from "./SelectTarget";

export const StudentFeeDetails = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [feeDetails, setFeeDetails] = useState(null);

  useEffect(() => {
    if (userId) {
      handleFetch(
        `/fees/student/${userId}`,
        setLoading,
        (data) => setFeeDetails(data),
        console.error
      );
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!feeDetails) return null;

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold mb-2">{feeDetails.studentName}'s Fee Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Total Fees:</strong> {feeDetails.totalFees}</p>
          <p><strong>Total Paid:</strong> {feeDetails.totalPaid}</p>
          <p><strong>Remaining Amount:</strong> {feeDetails.remainingAmount}</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">Installment Logs:</h4>
          <ul className="list-disc pl-5">
            {feeDetails.installments.map((installment) => (
              <li key={installment._id}>
                {new Date(installment.date).toLocaleDateString()}: {installment.amount}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};