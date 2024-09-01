import DynamicForm from "../DynamicForm";

export default function Schedule(props: {
  value?: {
    [key in string]: string | { type: string; ids: string[] };
  };
}) {
  return (
    <DynamicForm
      fields={[
        {
          type: "date",
          label: "Date",
          name: "date",
          required: true,
          defaultValue: "2024-08-06",
        },
        { type: "text", label: "Subject", name: "subject", required: true },
        {
          type: "time",
          label: "Start Time",
          name: "startTime",
          required: true,
        },
        { type: "time", label: "End Time", name: "endTime", required: true },
        {
          type: "targetSelector",
          label: "Select Batch",
          selectOnly: "batchIds",
          single: true,
        },
      ]}
    />
  );
}
