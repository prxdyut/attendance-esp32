import { useState } from "react";
import { useParams } from "react-router-dom";
import { handleSubmit } from "../../utils/handleSubmit";

export default function UserDelete() {
  const [loading, setLoading] = useState(false);
  const userId = useParams().id;

  return (
    <div className=" flex flex-col gap-6">
      <div className=" text-center">
        <p className=" text-lg font-semibold">Edit Student</p>
      </div>
      <div className="">
        Are you sure? you want to delete this student.
        <div className=" text-xs">
          All the data associated with this student will be erased.
        </div>
      </div>
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            `/users/${userId}/delete`,
            setLoading,
            console.log,
            console.log
          )
        }
        className=" text-center "
      >
        <button className="border px-2 py-1">
          {loading ? "Removing Student ..." : "Remove Student"}
        </button>
      </form>
    </div>
  );
}
