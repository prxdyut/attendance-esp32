import { useEffect, useState } from "react";
import { handleSubmit } from "../../utils/handleSubmit";
import { useParams } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import { TargetSelector } from "../../components/SelectTarget";

export default function BatchEdit() {
  const [loading, setLoading] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [userIds, setUserIds] = useState<string[]>([])
  const userId = useParams().id;

  const onSuccess = (data: any) => {
    const studentIds = data.students.map((student: any) => student._id as string) as string[]
    const facultyIds = data.faculty.map((fac: any) => fac._id as string) as string[]
    setBatchName(data.batch.name)
    setUserIds([...studentIds, ...facultyIds])
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
        <input className="border" name="name" id="name" value={batchName} onChange={e => setBatchName(e.target.value)} />
        <label>Name :</label>
        <TargetSelector label="Select Students" selectOnly="userIds" defaultSelectedOptions={userIds} />
        <button
          type="submit"
          className="col-span-2 mt-4 p-2 bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? "loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
