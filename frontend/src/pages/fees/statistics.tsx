import { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  AccountBalanceWalletOutlined,
  Add,
  CheckCircleOutlined,
  Edit,
  MoneyOffCsredOutlined,
  Preview,
  PreviewOutlined,
  RemoveRedEyeOutlined,
  Search,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ModalButton from "../../components/ModalForm";
import { StudentFeeDetails } from "./single";
import DynamicForm from "../../components/DynamicForm";

export const FeeStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>();
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchFees = () => {
    handleFetch("/fees/statistics", setLoading, setStats, console.error);
    handleFetch("/fees/", setLoading, setStudents, console.error);
  };
  useEffect(() => {
    fetchFees();
  }, []);

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  const handleStudentSelect = (_: string, ids: string[]) => {
    if (ids.length > 0) {
      setSelectedStudentId(ids[0]);
    } else {
      setSelectedStudentId(null);
    }
  };
  console.log(students);
  const filteredStudents = students.filter((student: any) =>
    (
      student.name +
      " " +
      student.totalFees +
      " " +
      student.totalPaid +
      " " +
      student.remainingAmount +
      " " +
      student.batches.map((batch: any) => batch.name).join(" ")
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Stack
      sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
      gap={2}
    >
      <Box display={"flex"}>
        <Typography variant="h5" fontWeight={600}>
          Fees
        </Typography>
      </Box>

      <Grid2 container gap={3}>
        <Grid2 xs>
          <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
            <CardContent>
              <Box display={"flex"} alignItems={"center"}>
                <AccountBalanceWalletOutlined fontSize="large" sx={{ mr: 2 }} />
                <Typography fontWeight={600} flex={"1"}>
                  Total Fees
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {stats?.totalFees}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 xs>
          <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
            <CardContent>
              <Box display={"flex"} alignItems={"center"}>
                <CheckCircleOutlined fontSize="large" sx={{ mr: 2 }} />
                <Typography fontWeight={600} flex={"1"}>
                  Paid Fees
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {stats?.paidFees}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 xs>
          <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
            <CardContent>
              <Box display={"flex"} alignItems={"center"}>
                <MoneyOffCsredOutlined fontSize="large" sx={{ mr: 2 }} />
                <Typography fontWeight={600} flex={"1"}>
                  Remaining Fees
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {stats?.remainingFees}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <Box display={"flex"} gap={3}>
            <FormControl fullWidth>
              <OutlinedInput
                placeholder="Search Fees"
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
            ) : filteredStudents?.length > 0 ? (
              <TableContainer
                elevation={0}
                component={Paper}
                sx={{ borderRadius: 2 }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>UID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>Remaining</TableCell>
                      <TableCell>Batch</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.map((student: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{student?.name}</TableCell>
                        <TableCell>{student?.totalFees}</TableCell>
                        <TableCell>{student?.totalPaid}</TableCell>
                        <TableCell>{student?.remainingAmount}</TableCell>
                        <TableCell>
                          {student.batches
                            .map((batch: any) => batch.name)
                            .join(" ")}
                        </TableCell>
                        <TableCell sx={{ display: "flex" }}>
                          <ModalButton
                            modal={<StudentFeeDetails />}
                            path={`/${student._id}`}
                            url=""
                            title="Score Details"
                            button=""
                            onSuccess={() => {}}
                            success=""
                          >
                            <IconButton>
                              <RemoveRedEyeOutlined />
                            </IconButton>
                          </ModalButton>
                          <ModalButton
                            modal={
                              <DynamicForm
                                key={String(students.length)}
                                fields={[
                                  {
                                    type: "date",
                                    label: "Date",
                                    name: "date",
                                    required: true,
                                  },
                                  {
                                    type: "number",
                                    label: "Amount",
                                    name: "amount",
                                    required: true,
                                  },
                                  {
                                    type: "text",
                                    label: "Payment Mode",
                                    name: "mode",
                                    required: true,
                                  },
                                  {
                                    type: "text",
                                    label: "Reference No.",
                                    name: "refNo",
                                    required: true,
                                  },
                                ]}
                              />
                            }
                            path={`/${student._id}/installment`}
                            url={`/fees/${student._id}/installment`}
                            title="Create Installment"
                            button="Create"
                            onSuccess={fetchFees}
                            success="Created a new Installment Successfully!"
                          >
                            <IconButton>
                              <Add />
                            </IconButton>
                          </ModalButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" textAlign="center" py={4}>
                No holidays found.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};
