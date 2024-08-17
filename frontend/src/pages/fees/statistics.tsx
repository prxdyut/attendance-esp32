import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { Link } from "react-router-dom";
import { TargetSelector } from "../../components/SelectTarget";
import { StudentFeeDetails } from "../../components/studentFee";

export const FeeStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    handleFetch(
      "/fees/statistics",
      setLoading,
      (data) => setStats(data),
      console.error
    );
  }, []);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  const handleStudentSelect = (_: string, ids: string[]) => {
    if (ids.length > 0) {
      setSelectedStudentId(ids[0]);
    } else {
      setSelectedStudentId(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Link
          to={"/fees/installment"}
          className="col-span-2 mt-4 p-2 bg-blue-500 text-white"
        >
          <button>New Installment</button>
        </Link>
        <Link
          to={"/fees/total"}
          className="col-span-2 mt-4 p-2 bg-blue-500 text-white"
        >
          <button>Set Fees</button>
        </Link>
        <div className="border p-4">
          <h3 className="font-bold">Total Fees</h3>
          <p>{stats.totalFees}</p>
        </div>
        <div className="border p-4">
          <h3 className="font-bold">Paid Fees</h3>
          <p>{stats.paidFees}</p>
        </div>
        <div className="border p-4">
          <h3 className="font-bold">Remaining Fees</h3>
          <p>{stats.remainingFees}</p>
        </div>
      </div>
      <div>
        <div>
          <div className="mb-4">
            <TargetSelector
              label="Select Student"
              selectOnly="userIds"
              single={true}
              onSelectionChange={handleStudentSelect}
            />
          </div>
          {selectedStudentId && (
            <StudentFeeDetails userId={selectedStudentId} />
          )}
        </div>
      </div>
    </div>
  );
};
