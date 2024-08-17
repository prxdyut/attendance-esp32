import { useState } from "react";
import { useParams } from "react-router-dom";
import { handleSubmit } from "../../utils/handleSubmit";

export default function Scheduledelete() {
  const [loading, setLoading] = useState(false);
  const userId = useParams().id;

  return (
    <div className=" flex flex-col gap-6">
      <div className=" text-center">
        <p className=" text-lg font-semibold">Edit Lecture</p>
      </div>
      <div className="">
        Are you sure? you want to delete this lecture.
        <div className=" text-xs">
        </div>
      </div>
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            `/schedules/${userId}/delete`,
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
