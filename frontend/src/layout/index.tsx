import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className=" grid grid-cols-5 gap-4 p-4 max-h-[100vh] h-[100vh] overflow-auto">
      <div className=" h-full overflow-auto">
        <SideBar />
      </div>
      <div className=" col-span-4 flex flex-col gap-4 overflow-auto">
        <div>
          <Topbar />
        </div>
        <div className=" flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
