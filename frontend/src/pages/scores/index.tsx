import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";

export function ViewAllScores() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = () => {
    handleFetch("/scores", setLoading, setScores, console.log);
  };

  if (loading) return <div>Loading...</div>;
console.log(scores)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">All Scores</h1>
      <Link
        to="/scores/new"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Add New Score
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Subject</th>
              <th className="py-2 px-4 text-left">Total Marks</th>
              <th className="py-2 px-4 text-left">Batch</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr key={score._id} className="border-b">
                <td className="py-2 px-4">
                  {new Date(score.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">{score.title}</td>
                <td className="py-2 px-4">{score.subject}</td>
                <td className="py-2 px-4">{score.total}</td>
                <td className="py-2 px-4">{score.batchIds?.map((batch: any) => batch.name).join(', ')}</td>
                <td className="py-2 px-4">
                  <Link
                    to={`/scores/${score._id}`}
                    className="text-blue-500 mr-2"
                  >
                    View
                  </Link>
                  <Link
                    to={`/scores/${score._id}/edit`}
                    className="text-green-500 mr-2"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/scores/${score._id}/delete`}
                    className="text-red-500"
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
