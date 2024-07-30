import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { TargetSelector } from "../components/SelectTarget";
import { handleFetch } from "../utils/handleFetch";
import { addDays, subDays } from "date-fns";

export default function Statistics() {
  const [startDate, setStartDate] = useState(
    subDays(new Date(), 1).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [stats, setStats] = useState(null);
  const [selectionType, setSelectionType] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (startDate && endDate && selectionType) {
      fetchStatistics();
    }
  }, [startDate, endDate, selectionType, selectedIds]);

  const fetchStatistics = async () => {
    setError("");
    handleFetch(
      `/statistics?selectionType=${
        selectionType && selectedIds.length ? selectionType : "all"
      }&selectedIds=${selectedIds.join(
        ","
      )}&startDate=${startDate}&endDate=${endDate}`,
      setLoading,
      (data) => {
        setStats(data.stats);
      },
      (errorMessage) => setError(errorMessage)
    );
  };
  console.log(stats);
  const handleSelectionChange = (type, ids) => {
    setSelectionType(type);
    setSelectedIds(ids);
  };

  const StatCard = ({
    title,
    value,
    link,
  }: {
    title?: string;
    value?: string;
    link?: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {link && (
        <Link to={link} className="text-xs text-blue-500 mt-1 hover:underline">
          View details
        </Link>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Statistics</h1>
        <div className="flex flex-wrap items-center gap-2">
          <TargetSelector onSelectionChange={handleSelectionChange} />
          <div className="flex items-center space-x-2">
            <input
              type="date"
              className="border rounded p-1"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>-</span>
            <input
              type="date"
              className="border rounded p-1"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
        ) : stats ? (
          <>
            <StatCard title="Present" value={stats.present} link="./present" />
            <StatCard title="Absent" value={stats.absent} />
            <StatCard title="Late Arrivals" value="Coming soon" />
            <StatCard title="Early Exits" value="Coming soon" />
          </>
        ) : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Holidays"
          value={stats?.holidayStudents || "N/A"}
          link="/holidays"
        />
        <StatCard
          title="Average Attendance"
          value={
            stats
              ? `${(
                  (stats.present / (stats.absent + stats.present)) *
                  100
                ).toFixed(0)}%`
              : "N/A"
          }
        />
        <StatCard
          title="Unexcused Absence"
          value="Coming soon"
          link="./unexcused"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="./batch-based"
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-center h-24">
            <span className="text-lg font-semibold">Batch Based</span>
          </div>
        </Link>
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center h-24">
            <span className="text-lg font-semibold">Busy Hours</span>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
