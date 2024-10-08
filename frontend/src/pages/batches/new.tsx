import { useState } from "react";
import { handleSubmit } from "../../utils/handleSubmit";
import { TargetSelector } from "../../components/SelectTarget";

export default function BatchesNew() {
  const [loading, setLoading] = useState(false);

  return (
    <div className=" flex flex-col gap-6">
      <div className=" text-center">
        <p className=" text-lg font-semibold">New Batch</p>
      </div>
      <form
        onSubmit={(e) =>
          handleSubmit(e, "/batches", setLoading, console.log, console.log)
        }
        className=" grid grid-cols-2 gap-4"
      >
        <label>Name :</label>
        <input className=" border" name="name" />
        <label>Students :</label>
        <TargetSelector label="Select Students" selectOnly="userIds" />
        <div className=" text-center col-span-2">
          <button type="submit" className="border px-2 py-1">
            {loading ? "Creating batch ..." : "Create Batch"}
          </button>
        </div>
      </form>
    </div>
  );
}
