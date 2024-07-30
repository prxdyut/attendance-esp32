import { useState } from "react";
import { useParams } from "react-router-dom";
import { handleSubmit } from "../../utils/handleSubmit";

export default function BatchesDelete() {
const [loading, setLoading] = useState<boolean>(false);
const batchId = useParams().id;

  return (
    <div className=" flex flex-col gap-6">
      <div className=" text-center">
        <p className=" text-lg font-semibold">Delete Holiday</p>
      </div>
      <div className="">
        Are you sure? you want to delete this batch.
        <div className=" text-xs">
          All the previous data related to this batch will be deleted.
        </div>
      </div>
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            `/batches/${batchId}/delete`,
            setLoading,
            console.log,
            console.log
          )
        }
        className=" text-center "
      >
        <button className="border px-2 py-1">
          {loading ? "Removing Batch ..." : "Remove Batch"}
        </button>
      </form>
    </div>
  );
}
