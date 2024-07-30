import { useState } from "react";
import { TargetSelector } from "../../components/SelectTarget";
import { handleSubmit } from "../../utils/handleSubmit";

export default function HolidayNew() {
  const [loading, setLoading] = useState(false);

  return (
    <div className=" flex flex-col gap-6">
      <div className=" text-center">
        <p className=" text-lg font-semibold">New Holiday</p>
      </div>
      <form
        className=" grid grid-cols-2 gap-4"
        onSubmit={(e) =>
          handleSubmit(e, "/holidays", setLoading, console.log, console.log)
        }
      >
        <label>Event :</label>
        <input className=" border" name="event" />
        <label>Date :</label>
        <input className=" border" type="date" name="date" />
        <label>Targets :</label>
        <TargetSelector />
        <div className=" text-center col-span-2 ">
          <button className="border px-2 py-1">Create Holiday</button>
        </div>
      </form>
    </div>
  );
}
