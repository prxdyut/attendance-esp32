import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PopupButton } from "../../components/PopupButton";
import { NotifyAbsentee } from "../../components/NotifyAbsentee";

export default function Topbar() {
  return (
    <div className="relative flex gap-2 border p-2">
      <Link to="/holidays" className="border px-2 py-1">
         Holidays
      </Link>
      <NotifyAbsentee />
      <div className="flex-1" />
      <button className="border px-2 py-1">En</button>
      <PopupButton label="Notif">
        <div className=" max-h-[60vh]">
            <table>
                <tbody>
                    <tr>
                        <td className=" w-[20rem]">
                            The summary og the notification
                        </td>
                        <td className=" px-2">
                            23-07-2024
                        </td>
                        <td className=" px-2"> 
                            11:30 PM
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </PopupButton>
      <PopupButton label="User">accountdddd popup</PopupButton>
    </div>
  );
}
