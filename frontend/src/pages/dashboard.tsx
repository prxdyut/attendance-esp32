import { Calendar, Clock, UserMinus, Users, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { handleFetch } from "../utils/handleFetch";
import { format } from "date-fns";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import whatsappLogo from "../assets/logos/whatsapp.png";
import {
  CoPresent,
  People,
  PeopleAltOutlined,
  PersonOffOutlined,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";

const isTesting = false;

function getLocalISOString() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    totalDays: 0,
    workingDays: 0,
    holidayStudents: 0,
  });
  const [holidayFor, setHolidayFor] = useState<any[]>([]);

  const fetchStatistics = async () => {
    handleFetch(
      `/statistics?selectionType=all&startDate=${getLocalISOString()}&endDate=${getLocalISOString()}`,
      setLoading,
      (data: any) => {
        setStats(data.stats);
      },
      console.error
    );
    handleFetch(
      `/statistics/holidayFor?selectionType=all&startDate=${getLocalISOString()}&endDate=${getLocalISOString()}`,
      setLoading,
      (data: any) => {
        setHolidayFor(data.holidayFor);
      },
      console.error
    );
  };

  useEffect(() => {
    const socket = io("http://localhost:1000/punches");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("cardPunch", (data) => {
      updateDashboard(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateDashboard = (punchData: any) => {
    setLogs((prevLogs) => [punchData, ...prevLogs].slice(0, 15));
    setStats((prevStats) => {
      const newStats = { ...prevStats };
      if (punchData.status === "on time") {
        newStats.present++;
      } else if (punchData.status === "late") {
        newStats.present++;
      } else {
        newStats.absent++;
      }
      return newStats;
    });
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <Grid2 container spacing={3} sx={{ overflow: "hidden", height: "100%" }}>
      <Grid2 xs={6} sx={{ height: "100%" }}>
        <Stack gap={3} sx={{ height: "100%" }}>
          {/* WhatsApp Integration Card */}
          <Box>
            <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
              <CardContent sx={{ p: 2 }}>
                <Box display={"flex"} sx={{ gap: 3 }}>
                  <Box>
                    <Box
                      component={"img"}
                      src={whatsappLogo}
                      sx={{ aspectRatio: "1/1", width: "3rem" }}
                    />
                  </Box>
                  <Box flex={"1"}>
                    <Typography
                      fontWeight={500}
                      variant="subtitle2"
                      gutterBottom
                    >
                      Whatsapp Integration
                    </Typography>
                    <Typography fontWeight={700}>
                      {isTesting ? "Connected (Test Mode)" : "Connected"}
                    </Typography>
                    <Typography variant="caption">
                      Last Updated :{" "}
                      {format(new Date(), "d MMMM yyyy 'at' h:mm a")}
                    </Typography>
                    <Box sx={{ height: "1rem", width: "100%" }} />
                    <Box display={"flex"} justifyContent={"flex-end"} gap={2}>
                      <Button variant="outlined">More</Button>
                      <Button variant="contained">Retry</Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Present and Absent Cards */}
          <Grid2 container gap={3}>
            <Grid2 xs>
              <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
                <CardContent>
                  <Box display={"flex"} alignItems={"center"}>
                    <PeopleAltOutlined fontSize="large" sx={{ mr: 2 }} />
                    <Typography fontWeight={600} flex={"1"}>
                      Present
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {stats.present}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 xs>
              <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
                <CardContent>
                  <Box display={"flex"} alignItems={"center"}>
                    <PersonOffOutlined fontSize="large" sx={{ mr: 2 }} />
                    <Typography fontWeight={600} flex={"1"}>
                      Absent
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {stats.absent}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>

          {/* Holiday For Card */}
          <Card
            elevation={0}
            sx={{ borderRadius: 5, bgcolor: grey[100], height: "100%" }}
          >
            <CardContent sx={{ p: 2, height: "100%", display: "flex", gap: 3 }}>
              <Box>
                <Calendar />
              </Box>
              <Box flex={"1"} display={"flex"} sx={{ flexFlow: "column" }}>
                <Box display={"flex"} sx={{ mb: 1 }}>
                  <Typography fontWeight={700} flex={1}>
                    Holiday For :
                  </Typography>
                  <Typography fontWeight={700} variant="h6">
                    {stats.holidayStudents}
                  </Typography>
                </Box>
                <Stack
                  gap={1}
                  sx={{ overflowY: "auto", height: "100%" }}
                  flex={1}
                >
                  {holidayFor.length > 0 ? (
                    holidayFor.map((user) => (
                      <Box
                        key={user.uid}
                        display={"flex"}
                        alignItems={"center"}
                      >
                        <Typography fontWeight={600}>
                          {user.name}&nbsp;
                        </Typography>
                        <Typography variant="caption">{`(${user.uid})`}</Typography>
                        <Box flex={1} />
                        <Typography>
                          by {Math.random() >= 0.5 ? "User ID" : "Batch ID"}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2">
                      No holidays scheduled
                    </Typography>
                  )}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Grid2>

      {/* Realtime Attendance Logs */}
      <Grid2 xs={6} sx={{ height: "100%" }}>
        <Box
          display={"flex"}
          sx={{
            height: "100%",
            borderRadius: 5,
            bgcolor: grey[100],
            p: 2,
            flexFlow: "column",
          }}
        >
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <CoPresent fontSize="small" />
            <Typography fontWeight={600}>Realtime Attendance Logs</Typography>
            <Box flex={1} />
            <Typography variant="caption" fontWeight={600}>
              {isTesting ? "Test Mode" : "connected"}
            </Typography>
          </Box>
          <Stack flex={1} gap={2} sx={{ py: 1, overflowY: "auto" }}>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <Box key={index} display={"flex"} alignItems={"center"}>
                  <Box>
                    <Typography fontWeight={600}>{log.name}</Typography>
                    <Typography variant="caption">{log.uid}</Typography>
                  </Box>
                  <Box flex={1} />
                  <Typography fontWeight={500} variant="h6">
                    {log.time}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">
                No attendance logs available
              </Typography>
            )}
          </Stack>
        </Box>
      </Grid2>
    </Grid2>
  );
}
