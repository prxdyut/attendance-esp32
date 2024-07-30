import React from "react";
import { Outlet } from "react-router-dom";


export default function Modal() {
  return (
    <React.Fragment>
      <div className=" glass fixed h-[100vh] w-[100vw] top-0 right-0 flex justify-center items-center">
        <div className=" bg-white border p-4 "><Outlet /></div>
      </div>
    </React.Fragment>
  );
}
