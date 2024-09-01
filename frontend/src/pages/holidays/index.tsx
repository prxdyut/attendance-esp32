import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
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
  Add,
  Delete,
  Download,
  Preview,
  RemoveRedEyeOutlined,
  Search,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { DateRangeSelector } from "../../components/DateRangeSelector";
import { format, parseISO } from "date-fns";
import ModalButton from "../../components/ModalForm";
import DynamicForm from "../../components/DynamicForm";
import { HolidayDetails } from "./view";

function Holidays() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const dateRangeState = useState<[string, string]>([
    format(new Date(), "yyyy-MM-dd"),
    format(new Date(), "yyyy-MM-dd"),
  ]);
  const [dateRange] = dateRangeState;

  useEffect(() => {
    fetchHolidays();
  }, [...dateRange]);

  const fetchHolidays = () => {
    const searchParams = new URLSearchParams({
      startDate: dateRange[0],
      endDate: dateRange[1],
    });
    handleFetch(
      "/holidays?" + searchParams.toString(),
      setLoading,
      (data: any[]) => setHolidays(data),
      console.log
    );
  };

  const filteredHolidays = holidays.filter((holiday: any) =>
    (
      format(parseISO(holiday.date), "dd MMM yyyy") +
      " " +
      holiday.event +
      " " +
      holiday.batchIds.map((batch: any) => batch.name).join(" ") +
      " " +
      holiday.userIds.map((user: any) => user.name).join(" ") +
      " " +
      (holiday.all ? "all" : "")
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
          Holidays
        </Typography>
        <Box flex={1} />
        <ModalButton
          modal={
            <DynamicForm
              key={String(holidays.length)}
              fields={[
                {
                  type: "text",
                  label: "Event",
                  name: "event",
                  required: true,
                },
                {
                  type: "date",
                  label: "Date",
                  name: "date",
                  required: true,
                },
                {
                  type: "targetSelector",
                  label: "Select Target",
                  name: "target",
                  required: true,
                },
              ]}
            />
          }
          path="/new"
          url="/holidays"
          title="New Holiday"
          button="Create"
          onSuccess={fetchHolidays}
          success="Created a new Holiday Successfully!"
        >
          <Button variant="contained" size="small">
            <Add /> Create Holiday
          </Button>
        </ModalButton>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <Box display={"flex"} gap={3}>
            <FormControl fullWidth>
              <OutlinedInput
                placeholder="Search Holiday"
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
            ) : filteredHolidays.length > 0 ? (
              <TableContainer
                elevation={0}
                component={Paper}
                sx={{ borderRadius: 2 }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>UID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Event</TableCell>
                      <TableCell>Target</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredHolidays.map((holiday: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {format(parseISO(holiday.date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>{holiday.event}</TableCell>
                        <TableCell>
                          {holiday.all && (
                            <Typography variant="caption" fontWeight={600}>
                              All
                            </Typography>
                          )}
                          {holiday.batchIds.length != 0 && (
                            <>
                              <Typography variant="caption" fontWeight={600}>
                                Batches
                              </Typography>
                              {holiday.batchIds.map(
                                (batch: any, index: number) => (
                                  <>
                                    <br />
                                    {batch.name}
                                  </>
                                )
                              )}
                            </>
                          )}
                          {holiday.userIds.length != 0 && (
                            <>
                              <Typography variant="caption" fontWeight={600}>
                                Users
                              </Typography>
                              {holiday.userIds.map(
                                (user: any, index: number) => (
                                  <>
                                    <br />
                                    {user.name}
                                  </>
                                )
                              )}
                            </>
                          )}
                        </TableCell>
                        <TableCell sx={{ display: "flex" }}>
                          <ModalButton
                            modal={<HolidayDetails />}
                            path={`/${holiday._id}`}
                            url=""
                            title="Holiday Details"
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
                              <Typography>
                                Are you sure you want to delete this?
                              </Typography>
                            }
                            path={`/${holiday._id}/delete`}
                            url={`/holidays/${holiday._id}/delete`}
                            title="Delete Holidays"
                            button="Delete"
                            onSuccess={fetchHolidays}
                            success="Deleted the Holiday Successfully!"
                          >
                            <IconButton>
                              <Delete />
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
}

export default Holidays;
