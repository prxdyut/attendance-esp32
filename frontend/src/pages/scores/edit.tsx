import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import { handleSubmit } from "../../utils/handleSubmit";
import { format } from "date-fns";
import { TargetSelector } from "../../components/SelectTarget";

export function EditScore() {
  const [score, setScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [students, setStudents] = useState([]);
  const [obtainedMarks, setObtainedMarks] = useState([]);

  useEffect(() => {
    handleFetch(
      `/scores/${id}`,
      setLoading,
      (score: any) => {
        setScore(score);
      },
      console.error
    );
  }, [id]);

  const isNotChanged =
    students
      .map((student: any) => student._id)
      .sort()
      .join(",") ==
    score?.obtained
      .map((student: any) => student.studentId)
      .sort()
      .join(",");

  if (loading) return <div>Loading...</div>;
  if (!score) return <div>Score not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Score</h1>
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            `/scores/${id as string}/edit`,
            setLoading,
            console.log,
            console.error
          )
        }
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            name="title"
            required
            defaultValue={score.title}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="date"
          >
            Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            type="date"
            name="date"
            required
            defaultValue={format(score.date, "yyyy-MM-dd")}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="subject"
          >
            Subject
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="subject"
            type="text"
            name="subject"
            required
            defaultValue={score.subject}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="total"
          >
            Total Marks
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="total"
            type="number"
            name="total"
            required
            defaultValue={score.total}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="total"
          >
            Batches
          </label>
          <TargetSelector
            onSelectionChange={(type: string, ids: string[]) => {
              if (ids.length) {
                handleFetch(
                  "/scores/" + ids.join(",") + "/batch",
                  setLoadingStudents,
                  setStudents,
                  console.error
                );
              }
            }}
            defaultSelectedOptions={score.batchIds.map(
              (batch: any) => batch._id
            )}
            label="Select Batch"
            selectOnly="batchIds"
            // single={true}
          />
        </div>
        {loadingStudents ? (
          "Loading Students"
        ) : (
          <div className=" grid grid-cols-2">
            {students.map((student: any, index: number) => (
              <>
                <label>{student.name}</label>
                <input
                  type="text"
                  name={`obtained`}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={
                    score.obtained.find((o: any) => o.studentId == student._id)
                      ?.marks ?? ""
                  }
                />
              </>
            ))}
          </div>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Update Score
        </button>
      </form>
    </div>
  );
}
