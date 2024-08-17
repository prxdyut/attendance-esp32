// components/AlertList.tsx

import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { Link } from "react-router-dom";

export const AlertList: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleFetch(
      "/alerts",
      setLoading,
      setAlerts,
      console.error
    );
  }, []);

  return (
    <div>
      <h2>Alerts</h2>
      <Link
        to={"/alerts/new"}
        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
      >
        New Alert
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {alerts.map((alert) => (
            <li key={alert._id} className="border p-4 mb-4">
              <h3>{alert.title}</h3>
              <p>{alert.message}</p>
              <p>
                Target: {alert.all && "All"}
                {alert.batchIds.length != 0 &&
                  `Batches (${alert.batchIds
                    .map((batch: any) => batch.name)
                    .join(", ")})`}
                {alert.userIds.length != 0 &&
                  `Users (${alert.userIds
                    .map((user: any) => user.name)
                    .join(", ")})`}
              </p>
              <p>Created: {new Date(alert.createdAt).toLocaleString()}</p>
              <Link
                to={`/alerts/${alert._id}/delete`}
                className="bg-red-500 text-white p-2 mt-2"
              >
                Delete
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
