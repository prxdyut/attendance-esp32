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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { DateRangeSelector } from "../../components/DateRangeSelector";
import { getSubject } from "../../utils/subjectsActions";
import PaginationTable from "../../components/PaginationTable";

export default function UserData() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    userData: null,
    punches: [],
    scores: [],
  });
  const id = useParams().id;
  useEffect(() => {
    handleFetch(
      `/users/data/?userId=${id}`,
      setLoading,
      setData,
      console.error
    );
  }, [id]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

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
              <PaginationTable
                name={"punches"}
                url={`/users/data/`}
                query={`userId=${id}&punches=true`}
                placeholder="Search for Subject or Title"
                notFound="No Scores found"
                hasDateFilter
                
              >
                {(data) => {
                  return (
                    <TableContainer
                      elevation={0}
                      component={Paper}
                      sx={{ borderRadius: 2 }}
                    >
                      <Table sx={{ width: isMobile ? "max-content" : "100%" }}>

                      <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((punch: any) => (
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
                  );
                }}
              </PaginationTable>
        </CardContent>
      </Card>
      {data?.userData?.role == "student" && (
        <>
          <Box sx={{ mb: -1 }}>
            <Typography fontWeight={600}>Scores</Typography>
          </Box>
          <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
            <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
              <PaginationTable
                name={"scores"}
                url={`/users/data/`}
                query={`userId=${id}&scores=true`}
                placeholder="Search for Subject or Title"
                notFound="No Scores found"
                hasDateFilter
                hasSearchFilter
              >
                {(data) => {
                  return (
                    <TableContainer
                      elevation={0}
                      component={Paper}
                      sx={{ borderRadius: 2 }}
                    >
                      <Table sx={{ width: isMobile ? "max-content" : "100%" }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Obtained</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.map((score: any, index: number) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  {format(parseISO(score.date), "dd MMM yyyy")}
                                </TableCell>
                                <TableCell>{score.title}</TableCell>
                                <TableCell>
                                  {getSubject(score.subject)}
                                </TableCell>
                                <TableCell>{score.total}</TableCell>
                                <TableCell>{score.marks}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  );
                }}
              </PaginationTable>
            </CardContent>
          </Card>
        </>
      )}
    </Stack>
  );
}
