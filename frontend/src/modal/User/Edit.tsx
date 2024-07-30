import { useEffect, useState } from "react";
import { handleSubmit } from "../../utils/handleSubmit";
import { useParams } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import { TargetSelector } from "../../components/SelectTarget";

export default function UserEdit() {
  const [loading, setLoading] = useState(false);
  const userId = useParams().id;
  const [defaultSelectedOptions, setDefaultSelectedOptions] = useState<string[]>([]);

  const onSuccess = (data: any) => {
    const nameInput = document.querySelector("#name") as HTMLInputElement;
    nameInput.value = data.name;
    const phoneInput = document.querySelector("#phone") as HTMLInputElement;
    phoneInput.value = data.phone;
    const cardUidInput = document.querySelector("#cardUid") as HTMLInputElement;
    cardUidInput.value = data.cardUid;
    
    setDefaultSelectedOptions(data.batchIds);
    setRoleInputValue(data.role);
  };

  useEffect(() => {
    handleFetch(`/users/${userId}`, setLoading, onSuccess, console.log);
  }, [userId]);

  const [roleInputValue, setRoleInputValue] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-lg font-semibold">Edit Student</p>
      </div>
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            `/users/${userId}/edit`,
            setLoading,
            console.log,
            console.log
          )
        }
        className="grid grid-cols-2 gap-4"
      >
        <label>First Name :</label>
        <input className="border" name="name" id="name" />
        <label>Phone :</label>
        <input className="border" name="phone" id="phone" />
        <label>Card UID :</label>
        <input className="border" name="cardUid" id="cardUid" />
        <label>role :</label>
        <select className="border" value={roleInputValue} name="role" id="role" onChange={e => setRoleInputValue(e.target.value)}  >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <label>Batch : </label>
        <TargetSelector label="Select Batch" selectOnly="batchIds" single={roleInputValue == 'student'} defaultSelectedOptions={defaultSelectedOptions} />
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
