import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import { Box, Container } from "@mui/material";
import { useState } from "react";

export default function Layout() {
  const openState = useState<boolean>(false);

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar openState={openState} />
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          flexFlow: "column",
        }}
      >
        <Topbar openState={openState}  />
        <Box sx={{ py: 3, px: 3, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
