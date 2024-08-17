import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TargetSelector } from "../../components/SelectTarget";
import { handleSubmit } from "../../utils/handleSubmit";
import { handleFetch } from "../../utils/handleFetch";
import BatchEdit from "../batches/edit";

export function CreateScore() {
  const [score, setScore] = useState({
    title: "",
    date: "",
    subject: "",
    total: "",
    batchId: "",
    obtained: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [students, setStudents] = useState([]);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Create New Score</h1>
      <form
        onSubmit={(e) =>
          handleSubmit(e, "/scores", setLoading, console.log, console.error)
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
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="batchId"
          >
            Batch
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
            label="Select Batch"
            selectOnly="batchIds"
            // single={true}
          />
          {loadingStudents ? (
            "Loading Students"
          ) : (
            <div className=" grid grid-cols-2">
              {students.map((student: any) => (
                <>
                  <label>{student.name}</label>
                  <input type="text" name={`obtained`} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </>
              ))}
            </div>
          )}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Score"}
        </button>
      </form>
    </div>
  );
}
