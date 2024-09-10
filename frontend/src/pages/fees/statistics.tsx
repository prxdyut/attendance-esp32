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
  useMediaQuery,
  useTheme,
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
import PaginationTable from "../../components/PaginationTable";

export const FeeStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>();

  const fetchFees = () => {
    handleFetch("/fees/statistics", setLoading, setStats, console.error);
  };
  useEffect(() => {
    fetchFees();
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });
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

      <Grid2 container spacing={3}>
        <Grid2 xs={12} sm={4}>
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
        <Grid2 xs={12} sm={4}>
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
        <Grid2 xs={12} sm={4}>
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
          <PaginationTable
            name={"fees"}
            url={`/fees`}
            placeholder="Search for Users"
            notFound="No Users found"
            hasSearchFilter
            hasBatchFilter
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
                      {data.map((student: any, index: number) => (
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
                              onSuccess={() => {}}
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
              );
            }}
          </PaginationTable>
        </CardContent>
      </Card>
    </Stack>
  );
};
