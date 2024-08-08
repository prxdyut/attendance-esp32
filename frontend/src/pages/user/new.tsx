import { useEffect, useState } from "react";
import { handleSubmit } from "../../utils/handleSubmit";
import { TargetSelector } from "../../components/SelectTarget";

export default function UserNew() {
  const [loading, setLoading] = useState(false);
  const [roleInputValue, setRoleInputValue] = useState("");

  useEffect(() => {
    if (location.pathname.includes("student")) {
      setRoleInputValue("student");
    } else if (location.pathname.includes("faculty")) {
      setRoleInputValue("faculty");
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-lg font-semibold">Edit Student</p>
      </div>
      <form
        onSubmit={(e) =>
          handleSubmit(e, "/users/", setLoading, console.log, console.log)
        }
        className="grid grid-cols-2 gap-4"
      >
        <label>First Name :</label>
        <input className="border" name="name" />
        <label>Phone :</label>
        <input className="border" name="phone" />
        <label>Card UID :</label>
        <input className="border" name="cardUid" />
        <label>Role :</label>
        <select
          className="border"
          name="role"
          id="role"
          value={roleInputValue}
          // disabled={Boolean(roleInputValue)}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <label>Batch :</label>
        <TargetSelector label="Select Batch" selectOnly="batchIds" single={roleInputValue == 'student'} />
        
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
