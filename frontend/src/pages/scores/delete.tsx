import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import { handleSubmit } from "../../utils/handleSubmit";

export function DeleteScore() {
  const [score, setScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    handleFetch(`/scores/${id}`, setLoading, setScore, console.error);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!score) return <div>Score not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Delete Score</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="mb-4">
          Are you sure you want to delete the following score?
        </p>
        <div className="mb-4">
          <strong>Title:</strong> {score.title}
        </div>
        <div className="mb-4">
          <strong>Date:</strong> {new Date(score.date).toLocaleDateString()}
        </div>
        <div className="mb-4">
          <strong>Subject:</strong> {score.subject}
        </div>
        <div className="mb-4">
          <strong>Total Marks:</strong> {score.total}
        </div>
        <form
          onSubmit={(e) =>
            handleSubmit(
              e,
              `/scores/${id as string}/delete`,
              setLoading,
              console.log,
              console.error
            )
          }
        >
          <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
            Confirm Delete
          </button>
        </form>
        <button
          onClick={() => navigate("/scores")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
