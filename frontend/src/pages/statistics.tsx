import { useState, useEffect } from "react";
import { TargetSelector } from "../components/SelectTarget";
import { handleFetch } from "../utils/handleFetch";
import { endOfDay, startOfDay, subDays } from "date-fns";
import {
  Box,
  Card,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { grey } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { getSubject } from "../utils/subjectsActions";

export default function Statistics() {
  const [fees, setFees] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [selectionType, setSelectionType] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    startOfDay(new Date()),
    endOfDay(new Date()),
  ]);

  useEffect(() => {
    if (selectionType) {
      fetchStatistics();
    }
  }, [...dateRange, selectionType, selectedIds]);

  const fetchStatistics = async () => {
    setError("");
    handleFetch(
      `/statistics?selectionType=${
        selectionType && selectedIds.length ? selectionType : "all"
      }&selectedIds=${selectedIds.join(",")}&startDate=${
        dateRange[0]
      }&endDate=${dateRange[1]}`,
      setLoading,
      (data: any) => setStats(data.stats),
      (errorMessage: any) => setError(errorMessage)
    );
    handleFetch(
      `/scores/statistics?selectionType=${
        selectionType && selectedIds.length ? selectionType : "all"
      }&selectedIds=${selectedIds.join(",")}&startDate=${
        dateRange[0]
      }&endDate=${dateRange[1]}`,
      setLoading,
      setScores,
      (errorMessage: any) => setError(errorMessage)
    );
    handleFetch(
      `/fees/statistics?selectionType=${
        selectionType && selectedIds.length ? selectionType : "all"
      }&selectedIds=${selectedIds.join(",")}`,
      setLoading,
      setFees,
      console.error
    );
  };

  const handleSelectionChange = (type: string, ids: string[]) => {
    setSelectionType(type);
    setSelectedIds(ids);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  const StatCard = ({
    title,
    value,
    link,
  }: {
    title?: string;
    value?: string;
    link?: string;
  }) => (
    <Card
      elevation={0}
      sx={{
        textAlign: "center",
        bgcolor: grey[100],
        py: 3,
        borderRadius: 5,
        flex: 1,
      }}
    >
      <Typography fontWeight={500}>{title}</Typography>
      <Typography
        fontWeight={700}
        variant={value == "Coming soon" ? "body2" : "h5"}
      >{`${value}`}</Typography>
    </Card>
  );

  return (
    <Stack sx={{ height: "100%", flexFlow: "column" }} gap={2}>
      <Box
        display={"flex"}
        sx={{
          flexFlow: isMobile ? "column" : "row",
          justifyContent: "space-between",
        }}
        gap={1}
      >
        <Typography variant="h5" fontWeight={600}>
          Statistics
        </Typography>
        <TargetSelector onSelectionChange={handleSelectionChange} />
      </Box>
      <Divider />
      <Box
        display={"flex"}
        sx={{
          flexFlow: isMobile ? "column" : "row",
          justifyContent: "space-between",
        }}
        gap={1}
      >
        <Typography variant="h6" fontWeight={600}>
          Attendance
        </Typography>
        <Box flex={1} />
        <Stack direction={"row"} gap={1}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              format="dd/MM/yy"
              label="Start Date"
              sx={{
                width: 150,
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
              }}
              value={dateRange[0] as Date}
              onChange={(newValue: Date | null) => {
                setDateRange((data: Date[]) => [newValue as Date, data[1]]);
              }}
            />
            <DatePicker
              format="dd/MM/yy"
              label="End Date"
              sx={{
                width: 150,
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
              }}
              value={dateRange[1] as Date}
              onChange={(newValue: Date | null) => {
                setDateRange((data: Date[]) => [data[0], newValue as Date]);
              }}
            />
          </LocalizationProvider>
        </Stack>
      </Box>
      <Grid2 container direction={"row"} spacing={2}>
        {stats ? (
          <>
            <Grid2 xs={6} sm={3}>
              <StatCard
                title="Present"
                value={stats.present}
                link="./present"
              />
            </Grid2>
            <Grid2 xs={6} sm={3}>
              <StatCard title="Absent" value={stats.absent} />
            </Grid2>
            <Grid2 xs={6} sm={3}>
              <StatCard title="Late Arrivals" value="Coming soon" />
            </Grid2>
            <Grid2 xs={6} sm={3}>
              <StatCard title="Early Exits" value="Coming soon" />
            </Grid2>
          </>
        ) : null}
      </Grid2>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} sm={4}>
          <StatCard
            title="Total Holidays"
            value={stats?.holidayStudents || "N/A"}
            link="/holidays"
          />
        </Grid2>
        <Grid2 xs={12} sm={4}>
          <StatCard
            title="Average Attendance"
            value={
              stats
                ? `${(
                    (stats.present / (stats.absent + stats.present)) *
                    100
                  ).toFixed(0)}%`
                : "N/A"
            }
          />
        </Grid2>
        <Grid2 xs={12} sm={4}>
          <StatCard
            title="Defaulters"
            value="Coming soon"
            link="./unexcused"
          />
        </Grid2>
      </Grid2>
      <Divider />
      <Box display={"flex"}>
        <Typography variant="h6" fontWeight={600}>
          Fees
        </Typography>
        <Box flex={1} />
      </Box>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} sm={4}>
          <StatCard title="Total Fees" value={fees?.totalFees} />
        </Grid2>
        <Grid2 xs={6} sm={4}>
          <StatCard title="Paid" value={fees?.paidFees} />
        </Grid2>
        <Grid2 xs={6} sm={4}>
          <StatCard title="Remaining" value={fees?.remainingFees} />
        </Grid2>
      </Grid2>
      <Divider />
      <Box
        display={"flex"}
        sx={{
          flexFlow: isMobile ? "column" : "row",
          justifyContent: "space-between",
        }}
        gap={1}
      >
        <Typography variant="h6" fontWeight={600}>
          Scores
        </Typography>
        <Box flex={1} />
        <Stack direction={"row"} gap={1}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              format="dd/MM/yy"
              label="Start Date"
              sx={{
                width: 150,
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
              }}
              value={dateRange[0] as Date}
              onChange={(newValue: Date | null) => {
                setDateRange((data: Date[]) => [newValue as Date, data[1]]);
              }}
            />
            <DatePicker
              format="dd/MM/yy"
              label="End Date"
              sx={{
                width: 150,
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
              }}
              value={dateRange[1] as Date}
              onChange={(newValue: Date | null) => {
                setDateRange((data: Date[]) => [data[0], newValue as Date]);
              }}
            />
          </LocalizationProvider>
        </Stack>
      </Box>
      <Stack gap={2} direction={"row"}>
        {!isMobile && <StatCard title="Total" value={scores?.totalExams} />}
        <StatCard title="Average" value={scores?.averagePerformance + "%"} />
        <StatCard title="Unattended" value={scores?.averageAttendance + "%"} />
      </Stack>
      <Grid2 container spacing={2}>
        {scores?.subjectWiseScores?.map((score: any) => (
          <Grid2 xs={12} sm={6}>
            <Box
              display={"flex"}
              sx={{ bgcolor: grey[100], px: 2, py: 1, borderRadius: 2.5 }}
            >
              <Typography fontWeight={500}>
                {getSubject(score.subject)}{" "}
                {`(AB ${score.totalAttempts - score.examsTaken})`}
              </Typography>
              <Box flex={1} />
              <Typography fontWeight={700}>
                {score.averageScore.toFixed(2)}
              </Typography>
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
}
