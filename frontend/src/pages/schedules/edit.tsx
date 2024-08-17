// components/LectureScheduler.js
import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { format, parseISO } from "date-fns";
import { TargetSelector } from "../../components/SelectTarget";
import { handleSubmit } from "../../utils/handleSubmit";
import { useParams } from "react-router-dom";

export function EditSchedule() {
  const [loading, setLoading] = useState(false);
  const params = useParams()

  const [data, setData] = useState<{ batchId: string }>({ batchId: '' })


  useEffect(() => {
    handleFetch('/schedules/' + params.id, setLoading, (data: any) => {

      const dateInput = document.querySelector("[name='date']") as HTMLInputElement;
      dateInput.value = format(data.schedule.date, 'yyyy-MM-dd');

      const subjectInput = document.querySelector("[name='subject']") as HTMLInputElement;
      subjectInput.value = data.schedule.subject;

      const startTimeInput = document.querySelector("[name='startTime']") as HTMLInputElement;
      startTimeInput.value = data.schedule.startTime;

      const endTimeInput = document.querySelector("[name='endTime']") as HTMLInputElement;
      endTimeInput.value = data.schedule.endTime;
      console.log(data)
      setData(olddata => ({ ...olddata, batchId: data.schedule.batchIds }))
    }, console.error)
  }, [])

  console.log(data)
  const handleSubmitform = async (e) => {
    handleSubmit(e, "/schedules/" + params.id + '/edit', setLoading, console.log, console.log);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Lecture Scheduler
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Schedule</h2>
          <form
            onSubmit={handleSubmitform}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="date"
              name="date"
              className="border rounded px-3 py-2"
              required
            />
            <TargetSelector
              label="Select Batch"
              selectOnly="batchIds"
              single={true}
              defaultSelectedOptions={[data.batchId]}
            />
            <input type="hidden" name="scheduledBy" value={"66ba4bf0542da53d38238647"} />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="border rounded px-3 py-2"
              required
            />

            <input
              type="time"
              name="startTime"
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="time"
              name="endTime"
              className="border rounded px-3 py-2"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Schedule
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
