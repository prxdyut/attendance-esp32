import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const ResourceList = () => {
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    handleFetch(
      "/resources",
      setLoading,
      (data) => setResources(data),
      console.error
    );
  }, []);

  if (loading) return <div>Loading...</div>;
  console.log(resources);
  return (
    <div>
      <Link
        to="/resources/new"
        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
      >
        <Plus size={20} className="mr-2" />
        New Resources
      </Link>
      <ul className="list-disc pl-5">
        {resources.map((resource) => (
          <li key={resource._id} className="mb-2">
            {resource.title}{" "}
            <a href={resource.fileUrl} target="_blank">
              {resource.fileUrl}
            </a>
            <Link
              to={`/resources/${resource._id}/delete`}
              className="ml-2 text-red-500"
            >
              Delete
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
