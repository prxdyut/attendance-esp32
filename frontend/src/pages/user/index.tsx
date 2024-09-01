import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { Search } from "lucide-react";
import { useParams } from "react-router-dom";
import { endOfMonth, format, parseISO, startOfMonth, subDays } from "date-fns";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { DateRangeSelector } from "../../components/DateRangeSelector";
import { getSubject } from "../../utils/subjectsActions";

export default function UserData() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    userData: null,
    punches: [],
    scores: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const id = useParams().id;
  const dateRangeState = useState<[string, string]>([
    format(startOfMonth(new Date()), "yyyy-MM-dd"),
    format(endOfMonth(new Date()), "yyyy-MM-dd"),
  ]);
  const [dateRange] = dateRangeState;

  console.log(data);
  useEffect(() => {
    handleFetch(
      `/users/data/?userId=${id}&startDate=${dateRange[0]}&endDate=${dateRange[1]}`,
      setLoading,
      setData,
      console.error
    );
  }, [id, ...dateRange]);

  const filteredPunches = data?.punches?.filter((punch: any) =>
    format(punch.timestamp, "do MMMM yyyy hh:mm a").includes(
      searchTerm.toLowerCase()
    )
  );

  const filteredScores = data?.scores?.filter((score: any) =>
    (
      format(parseISO(score.date), "dd MMM yyyy") +
      " " +
      score.title +
      " " +
      score.subject +
      " " +
      score.total +
      " " +
      score.batchIds.map((batch: any) => batch.name).join(" ")
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  return (
    <Stack sx={{ height: "100%", flexFlow: "column" }} gap={2}>
      <Box display={"flex"} justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>
          User
        </Typography>
      </Box>
      <Box sx={{ mb: -1 }}>
        <Typography fontWeight={600}>Details</Typography>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{data?.userData?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Phone</TableCell>
                  <TableCell>{data?.userData?.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>{data?.userData?.role}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Card ID</TableCell>
                  <TableCell>{data?.userData?.cardUid}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Batches</TableCell>
                  <TableCell>
                    {data?.userData?.batchIds
                      ?.map((batch: any) => batch?.name)
                      .join(", ")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Box sx={{ mb: -1 }}>
        <Typography fontWeight={600}>Punches</Typography>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <Box display={"flex"} gap={3}>
            <FormControl fullWidth>
              <OutlinedInput
                placeholder="Search Score"
                sx={{ borderRadius: 2.5, bgcolor: "white" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </FormControl>
            <DateRangeSelector state={dateRangeState} />
          </Box>
          <Box>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                py={8}
              >
                <CircularProgress />
              </Box>
            ) : filteredPunches.length > 0 ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Facultys table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPunches.map((punch: any) => (
                      <TableRow
                        key={punch._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {format(punch.timestamp, "do MMMM yyyy")}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {format(punch.timestamp, "hh:mm a")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" textAlign="center" py={4}>
                No Punches found.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
      {data?.userData?.role == "student" && (
        <>
          <Box sx={{ mb: -1 }}>
            <Typography fontWeight={600}>Scores</Typography>
          </Box>
          <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
            <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
              <Box display={"flex"} gap={3}>
                <FormControl fullWidth>
                  <OutlinedInput
                    placeholder="Search Score"
                    sx={{ borderRadius: 2.5, bgcolor: "white" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <DateRangeSelector state={dateRangeState} />
              </Box>
              <Box>
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    py={8}
                  >
                    <CircularProgress />
                  </Box>
                ) : filteredScores.length > 0 ? (
                  <TableContainer
                    elevation={0}
                    component={Paper}
                    sx={{ borderRadius: 2 }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>UID</TableCell>
                          <TableCell>Batch</TableCell>
                          <TableCell>Subject</TableCell>
                          <TableCell>Start</TableCell>
                          <TableCell>End</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredScores.map((score: any, index: number) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                {format(parseISO(score.date), "dd MMM yyyy")}
                              </TableCell>
                              <TableCell>{score.title}</TableCell>
                              <TableCell>{getSubject(score.subject)}</TableCell>
                              <TableCell>{score.total}</TableCell>
                              <TableCell>{score.marks}</TableCell>
                              <TableCell>
                                {score.batchIds.map(
                                  (batch: any, index: number) => (
                                    <>
                                      {batch.name} {<br />}
                                    </>
                                  )
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body1" textAlign="center" py={4}>
                    No Scores found.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Stack>
  );
}
