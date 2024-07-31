import { Calendar, Clock, UserMinus, Users, UserX } from "lucide-react";

export default function Dashboard() {
  const Logs = [
    {
      name: "Alice Smith",
      batch_id: "B001",
      status: "on time",
      time: "09:00 AM",
    },
    {
      name: "Bob Johnson",
      batch_id: "B002",
      status: "on time",
      time: "10:30 AM",
    },
    {
      name: "Charlie Brown",
      batch_id: "B001",
      status: "on time",
      time: "09:00 AM",
    },
    {
      name: "Diana Lee",
      batch_id: "B003",
      status: "on time",
      time: "02:00 PM",
    },
    {
      name: "Eva Garcia",
      batch_id: "B002",
      status: "on time",
      time: "10:30 AM",
    },
    {
      name: "Alice Smith",
      batch_id: "B001",
      status: "on time",
      time: "09:00 AM",
    },
    {
      name: "Bob Johnson",
      batch_id: "B002",
      status: "on time",
      time: "10:30 AM",
    },
    {
      name: "Charlie Brown",
      batch_id: "B001",
      status: "on time",
      time: "09:00 AM",
    },
    {
      name: "Diana Lee",
      batch_id: "B003",
      status: "on time",
      time: "02:00 PM",
    },
    {
      name: "Eva Garcia",
      batch_id: "B002",
      status: "on time",
      time: "10:30 AM",
    },
    {
      name: "Alice Smith",
      batch_id: "B001",
      status: "on time",
      time: "09:00 AM",
    },
    {
      name: "Bob Johnson",
      batch_id: "B002",
      status: "on time",
      time: "10:30 AM",
    },
    {
      name: "Charlie Brown",
      batch_id: "B001",
      status: "on time",
      time: "09:00 AM",
    },
    {
      name: "Diana Lee",
      batch_id: "B003",
      status: "on time",
      time: "02:00 PM",
    },
    {
      name: "Eva Garcia",
      batch_id: "B002",
      status: "on time",
      time: "10:30 AM",
    },
  ];
  const stats = [
    { title: "Present Champs", icon: Users, color: "bg-green-100 text-green-800" },
    { title: "Absent Minds", icon: UserMinus, color: "bg-red-100 text-red-800" },
    { title: "Late Arrivals", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
    { title: "Early Exits", icon: UserX, color: "bg-purple-100 text-purple-800" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">WhatsApp Status</h2>
            <p className="text-green-600 font-medium">Connected</p>
            <p className="text-sm text-gray-500">Last Updated: 24 July 2024, 9:24 PM</p>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
            Retry
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`bg-white rounded-lg shadow p-6 ${stat.color}`}>
              <stat.icon className="w-8 h-8 mb-4" />
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex-grow">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Holiday for ...</h2>
          </div>
          <p className="text-gray-600">No upcoming holidays</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex-grow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Report</h2>
          <p className="text-gray-600">Report data will be displayed here</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Realtime Logs</h2>
        <div className="overflow-auto flex-grow">
          {Logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div>
                <p className="font-semibold text-gray-800">{log.name}</p>
                <p className="text-sm text-gray-500">{log.batch_id}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${log.status === 'on time' ? 'text-green-600' : 'text-red-600'}`}>
                  {log.status}
                </p>
                <p className="text-sm font-medium">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}