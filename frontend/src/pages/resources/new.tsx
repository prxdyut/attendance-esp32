// components/ResourceUpload.tsx

import { useState } from "react";
import FileUploader from "./../../components/fileUpload";
import { handleSubmit } from "../../utils/handleSubmit";
import { TargetSelector } from "../../components/SelectTarget";

export const ResourceUpload = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: any) => {
    handleSubmit(e, "/resources", setLoading, console.log, console.error);
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
      <label>Date:</label>
      <input
        className="border"
        type="date"
        name="date"
        required
      />
      <label>Title:</label>
      <input
        className="border"
        type="text"
        name="title"
        required
      />
      <label>File:</label>
      <FileUploader name="fileUrl" />
      <label>Target:</label>
      <TargetSelector />
      <button
        type="submit"
        className="col-span-2 mt-4 p-2 bg-blue-500 text-white"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Resource"}
      </button>
    </form>
  );
};
