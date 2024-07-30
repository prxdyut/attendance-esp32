import { useEffect, useState } from "react";
import { handleFetch } from "../utils/handleFetch";

export default function User() {
  return (
    <div className=" flex flex-col gap-4 h-full">
      <p className=" text-lg font-semibold col-span-2 h-min">Statistics</p>
      <div className=" grid grid-cols-2 gap-4 h-full">
        <div className=" flex flex-col gap-4">
          <div className=" grid grid-cols-2 gap-4">
            <div className=" border pt-14 p-2">
              <p>Present :</p>
            </div>
            <div className=" border pt-14 p-2">
              <p>Absent :</p>
            </div>
            <div className=" border pt-14 p-2">
              <p>Late Arrivals :</p>
            </div>
            <div className=" border pt-14 p-2">
              <p>Early Exits :</p>
            </div>
            <div className=" border pt-14 p-2">
              <p>Total Holidays :</p>
            </div>
            <div className=" border pt-14 p-2">
              <p>Average :</p>
            </div>
          </div>
          <div className=" border h-full p-2">
            <pre>Bar Chart</pre>
          </div>
        </div>
        <div className=" border p-2">
            <table>
                <thead>
                    <tr>
                        <th className=" w-full text-left">Date</th>
                        <th className=" pr-8">Time</th>
                        <th className=" pr-8">Remark</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>24 January</td>
                        <td>18:35</td>
                        <td>On Time</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
