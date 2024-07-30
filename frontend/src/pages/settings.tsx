import React from "react";

export default function Settings() {
  return (
    <div className=" flex flex-col gap-4">
      <p className=" text-lg font-semibold">Settings</p>
      <div className=" grid grid-cols-2">
        <div className=" border p-2 space-y-4">
          <p className=" text-lg font-semibold">Edit Password</p>
          <div className=" grid grid-cols-2 gap-2">
            <label>Old Password</label>
            <input type="text" className=" border" />
            <label>New Password</label>
            <input type="text" className=" border" />
          </div>
        </div>
      </div>
    </div>
  );
}
