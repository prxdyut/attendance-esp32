import React, { useState } from "react";
import { handleSubmit } from "../../utils/handleSubmit";
import { TargetSelector } from "../../components/SelectTarget";
import { Link } from "react-router-dom";

export const FeeInstallment = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (event) => {
    handleSubmit(
      event,
      "/fees/installment",
      setLoading,
      () => alert("Installment added successfully"),
      console.error
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
      <label>Mode:</label>
      <input className="border" name="mode" type="text" required />
      <label>Reference:</label>
      <input className="border" name="refNo" type="text" required />
      <label>Amount:</label>
      <input className="border" name="amount" type="number" required />
      <label>Date:</label>
      <input className="border" name="date" type="date" required />
      <Link
        to="/fees/total"
        type="submit"
        className="col-span-2 mt-4 p-2 bg-blue-500 text-white"
      >
        Update Total fee
      </Link>

      <button
        type="submit"
        className="col-span-2 mt-4 p-2 bg-blue-500 text-white"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Add Installment"}
      </button>
    </form>
  );
};
