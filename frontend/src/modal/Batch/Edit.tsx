import { useEffect, useState } from "react";
import { handleSubmit } from "../../utils/handleSubmit";
import { useParams } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";

export default function UserEdit() {
  const [loading, setLoading] = useState(false);
  const userId = useParams().id;

  const onSuccess = (data: any) => {
    const nameInput = document.querySelector("#name") as HTMLSelectElement;
    nameInput.value = data.name;
  };

  useEffect(() => {
    handleFetch(`/batches/${userId}`, setLoading, onSuccess, console.log);
  }, [userId]);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-lg font-semibold">Edit Student</p>
      </div>
      <form
        onSubmit={(e) => handleSubmit(e, `/batches/${userId}/edit`, setLoading, console.log, console.log)}
        className="grid grid-cols-2 gap-4"
      >
        <label>Name :</label>
        <input className="border" name="name" id="name" />
        <button
          type="submit"
          className="col-span-2 mt-4 p-2 bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
