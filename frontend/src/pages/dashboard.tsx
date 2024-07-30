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

  return (
    <div className=" grid grid-cols-2 gap-4 h-full">
      <div className=" flex flex-col gap-4">
        <div className=" border p-2 flex">
          <div>
            <p>Whatsapp : Connected</p>
            <p className=" text-xs">Last Updated: 24 July 2024, 9:24 PM</p>
          </div>
          <div className=" flex-grow" />
          <button>retry</button>
        </div>
        <div className=" grid grid-cols-2 gap-4">
          <div className=" border">
            <div className=" p-2">
              <div className=" h-8" />
              <p>Present Champs</p>
            </div>
          </div>
          <div className=" border">
            <div className=" p-2">
              <div className=" h-8" />
              <p>Absent Minds</p>
            </div>
          </div>
          <div className=" border">
            <div className=" p-2">
              <div className=" h-8" />
              <p>Late Arrivals</p>
            </div>
          </div>
          <div className=" border">
            <div className=" p-2">
              <div className=" h-8" />
              <p>Early Exits</p>
            </div>
          </div>
        </div>
        <div className=" flex-grow flex flex-col gap-4">
          <div className=" border">
            <div className=" p-2">
              <div className=" h-20" />
              <p>Holiday for ...</p>
            </div>
          </div>
          <div className=" border flex-grow">
            <div className=" p-2">
              <pre>Weekly Report</pre>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full border p-2 h-full flex gap-2 flex-col overflow-auto">
        <div>
          <pre> Realtime Logs</pre>
        </div>
        <div className=" overflow-auto flex flex-col gap-1">
          {Logs.map((log, i) => (
            <div key={i} className=" flex gap-2 border px-2 py-1 items-end">
              <div>
                <div className=" font-semibold">{log.name}</div>
                <div className=" text-xs">{log.batch_id}</div>
              </div>
              <div className=" flex-grow" />
              <div>
                <div className=" text-xs text-right">{log.status}</div>
                <pre className="">{log.time}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
