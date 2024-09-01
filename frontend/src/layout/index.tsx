import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import { Box, Container } from "@mui/material";

export default function Layout() {
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          flexFlow: "column",
        }}
      >
        <Topbar />
        <Box sx={{ py: 3, px: 3, flex: 1, }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
