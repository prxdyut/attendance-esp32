// components/SetTotalFeesForm.tsx

import React, { useState } from "react";
import { handleSubmit } from "../../utils/handleSubmit";
import { TargetSelector } from "../../components/SelectTarget";

export const SetTotalFeesForm = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (event) => {
    handleSubmit(
      event,
      "/fees/set-total-fees",
      setLoading,
      () => alert("Total fees updated successfully"),
      alert
    );
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
      <label>Student ID:</label>
      <TargetSelector
        label="Select Student"
        selectOnly="userIds"
        single={true}
      />
      <label>Total Fees:</label>
      <input className="border" name="totalFees" type="number" required />
      <button
        type="submit"
        className="col-span-2 mt-4 p-2 bg-blue-500 text-white"
        disabled={loading}
      >
        {loading ? "Updating..." : "Set Total Fees"}
      </button>
    </form>
  );
};
