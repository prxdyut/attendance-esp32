
// components/ResourceDelete.tsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import { handleSubmit } from "../../utils/handleSubmit";

export default function ResourceDelete() {
  const [loading, setLoading] = useState(false);
  const resourceId = useParams().id;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-lg font-semibold">Delete Resource</p>
      </div>
      <div className="">
        Are you sure you want to delete this resource?
        <div className="text-xs">
          This action cannot be undone. The file will be permanently removed from the server.
        </div>
      </div>
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            `/resources/${resourceId}/delete`,
            setLoading,
            console.log,
            console.log
          )
        }
        className="text-center"
      >
        <button className="border px-2 py-1 bg-red-500 text-white">
          {loading ? "Deleting Resource..." : "Delete Resource"}
        </button>
      </form>
    </div>
  );
}