import { format } from "date-fns";

type EventType = "punchIn" | "punchOut"| "punch" | "absent" | "holiday" | "newUser";

interface StudentEvent {
  studentId: string;
  studentName: string;
  eventType: EventType;
  timestamp?: Date;
}

export function getMessage(event: StudentEvent): string {
  const { studentId, studentName, eventType, timestamp } = event;
  const formattedTime = timestamp ? format(timestamp, "hh:mm a") : "";
  const formattedDate = timestamp ? format(timestamp, "yyyy-MM-dd") : "";

  switch (eventType) {
    case "punch":
      return `Student ${studentName} (${studentId}) punched at ${formattedTime} on ${formattedDate}.`;
    case "punchIn":
      return `Student ${studentName} (${studentId}) punched in at ${formattedTime} on ${formattedDate}.`;
    case "punchOut":
      return `Student ${studentName} (${studentId}) punched out at ${formattedTime} on ${formattedDate}.`;
    case "absent":
      return `Student ${studentName} (${studentId}) is absent on ${formattedDate}.`;
    case "holiday":
      return `Today (${formattedDate}) is a holiday.`;
    case "newUser":
      return `New student ${studentName} (${studentId}) has been added on ${formattedDate}.`;
    default:
      return `Unknown event type for student ${studentName} (${studentId}).`;
  }
}
