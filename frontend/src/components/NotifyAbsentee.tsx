import { handleFetch } from "../utils/handleFetch";

export function NotifyAbsentee() {
  return (
    <button
      type="submit"
      className=" border p-1"
      onClick={() =>
        handleFetch("/punches/absent", () => {}, console.log, console.log)
      }
    >
      Notify Absentee
    </button>
  );
}
