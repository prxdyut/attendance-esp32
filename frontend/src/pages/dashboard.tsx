import { Calendar, Clock, UserMinus, Users, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { handleFetch } from "../utils/handleFetch";
import { format } from "date-fns";
function getLocalISOString() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}
export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    totalDays: 0,
    workingDays: 0,
    holidayStudents: 0,
  });
  const [holidayFor, setHolidayFor] = useState<any[]>()
  console.log(getLocalISOString());
  const fetchStatistics = async () => {
    handleFetch(
      `/statistics?selectionType=all&startDate=${getLocalISOString()}&endDate=${getLocalISOString()}`,
      setLoading,
      (data) => {
        setStats(data.stats);
        console.log(data.stats);
      },
      console.error
    );
    handleFetch(
      `/statistics/holidayFor?selectionType=all&startDate=${getLocalISOString()}&endDate=${getLocalISOString()}`,
      setLoading,
      (data) => {
        setHolidayFor(data.holidayFor)
        console.log(data, data.holidayFor);
      },
      console.error
    );
  };
  useEffect(() => {
    const socket = io("http://localhost:1000/punches"); // Replace with your WebSocket server URL

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("cardPunch", (data) => {
      updateDashboard(data);
      // console.log(data)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateDashboard = (punchData) => {
    // Update logs
    setLogs((prevLogs: any[]) => [punchData, ...prevLogs].slice(0, 15)); // Keep only the latest 15 logs

    // Update stats
    setStats((prevStats) => {
      const newStats = { ...prevStats };
      if (punchData.status === "on time") {
        newStats.presentChamps++;
      } else if (punchData.status === "late") {
        newStats.lateArrivals++;
      }
      // Add logic for absent and early exits as needed
      return newStats;
    });
  };

  const statsData = [
    {
      title: "Present Champs",
      icon: Users,
      color: "bg-green-100 text-green-800",
      value: stats.present,
    },
    {
      title: "Absent Minds",
      icon: UserMinus,
      color: "bg-red-100 text-red-800",
      value: stats.absent,
    },
  ];

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              WhatsApp Status
            </h2>
            <p className="text-green-600 font-medium">Connected</p>
            <p className="text-sm text-gray-500">
              Last Updated: 24 July 2024, 9:24 PM
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
            Retry
          </button>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow p-6 ${stat.color}`}
            >
              <stat.icon className="w-8 h-8 mb-4" />
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex-grow">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Holiday for
              <span className="text-gray-600 font-bold">
                {" "}
                : {stats.holidayStudents}
              </span>
            </h2>
          </div>
          {holidayFor?.length ? <div>
            {holidayFor.map(user => <p>{user.name}</p>)}
          </div> : <div className=" font-bold">
            <p className="text-gray-600">No upcoming holidays</p>
          </div>}
          <div></div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex-grow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Weekly Report
          </h2>
          <p className="text-gray-600">Report data will be displayed here</p>
        </div>
      </div>

      {/* Realtime Logs section */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Realtime Logs
        </h2>
        <div className="overflow-auto flex-grow">
          {logs.map((log, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
            >
              <div>
                <p className="font-semibold text-gray-800">{log.name}</p>
                <p className="text-sm text-gray-500">{log.uid}</p>
              </div>
              <div className="text-right">
                {/* <p className={`text-sm ${log.status === 'on time' ? 'text-green-600' : 'text-red-600'}`}>
                  {log.status}
                </p> */}
                <p className="text-sm font-medium">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
