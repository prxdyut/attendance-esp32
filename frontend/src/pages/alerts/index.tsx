// components/AlertList.tsx

import React, { useState, useEffect } from "react";
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
  ControlPointDuplicate,
  Preview,
  RemoveRedEyeOutlined,
  Search,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { DateRangeSelector } from "../../components/DateRangeSelector";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import ModalButton from "../../components/ModalForm";
import DynamicForm, { defaultDate } from "../../components/DynamicForm";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { AlertDetails } from "./view";

export const AlertList: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dateRangeState = useState<[string, string]>([
    format(startOfMonth(new Date()), "yyyy-MM-dd"),
    format(endOfMonth(new Date()), "yyyy-MM-dd"),
  ]);
  const [dateRange] = dateRangeState;

  const fetchAlerts = () => {
    const queryParams = new URLSearchParams({
      startDate: dateRange[0],
      endDate: dateRange[1],
    });
    handleFetch(`/alerts?${queryParams}`, setLoading, setAlerts, console.error);
  };

  useEffect(() => {
    fetchAlerts();
  }, [...dateRange]);

  const filteredAlerts = alerts.filter((alert: any) =>
    (
      format(parseISO(alert.date), "dd MMM yyyy") +
      " " +
      alert.title +
      " " +
      alert.message +
      " " +
      alert.batchIds.map((batch: any) => batch.name).join(" ") +
      " " +
      alert.userIds.map((user: any) => user.name).join(" ") +
      " " +
      (alert.all ? "all" : "")
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
          Alerts
        </Typography>
        <Box flex={1} />
        <ModalButton
          modal={
            <DynamicForm
              fields={[
                { type: "date", label: "Date", name: "date" },
                { type: "text", name: "title", label: "Title" },
                { type: "text", name: "message", label: "Message" },
                {
                  type: "targetSelector",
                  label: "Select Target",
                  name: "target",
                },
              ]}
            />
          }
          path={`/new`}
          url={`/alerts`}
          title="New Alert"
          button="Create"
          onSuccess={fetchAlerts}
          success="Created new Alert successfully!"
        >
          <Button variant="contained" size="small">
            <Add /> New Alert
          </Button>
        </ModalButton>
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
            ) : filteredAlerts.length > 0 ? (
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
                      <TableCell>Title</TableCell>
                      <TableCell>Messages</TableCell>
                      <TableCell>Target</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAlerts.map((alert: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {format(parseISO(alert.date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>{alert.title}</TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>
                          {alert.all && (
                            <Typography variant="caption" fontWeight={600}>
                              All
                            </Typography>
                          )}
                          {alert.batchIds.length != 0 && (
                            <>
                              <Typography variant="caption" fontWeight={600}>
                                Batches
                              </Typography>
                              {alert.batchIds.map(
                                (batch: any, index: number) => (
                                  <>
                                    <br />
                                    {batch.name}
                                  </>
                                )
                              )}
                            </>
                          )}
                          {alert.userIds.length != 0 && (
                            <>
                              <Typography variant="caption" fontWeight={600}>
                                Users
                              </Typography>
                              {alert.userIds.map((user: any, index: number) => (
                                <>
                                  <br />
                                  {user.name}
                                </>
                              ))}
                            </>
                          )}
                        </TableCell>
                        <TableCell sx={{display: 'flex'}}>
                          <ModalButton
                            modal={<AlertDetails />}
                            path={`/${alert._id}`}
                            url=""
                            title="Alert Details"
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
                                    defaultValue: defaultDate(alert.date),
                                  },
                                  {
                                    type: "text",
                                    name: "title",
                                    label: "Title",
                                    defaultValue: alert.title,
                                  },
                                  {
                                    type: "text",
                                    name: "message",
                                    label: "Message",
                                    defaultValue: alert.message,
                                  },
                                  {
                                    type: "targetSelector",
                                    label: "Select Target",
                                    name: "target",
                                    defaultValue: {
                                      type: alert?.all
                                        ? "all"
                                        : alert?.batchIds
                                        ? "batchIds"
                                        : "userIds",
                                      ids: alert?.batchIds
                                        ? alert?.batchIds.map((_: any) => _._id)
                                        : alert?.userIds.map((_: any) => _._id),
                                    },
                                  },
                                ]}
                              />
                            }
                            path={`/${alert._id}/duplicate`}
                            url={`/alerts`}
                            title="Duplicate Alert"
                            button="Create"
                            onSuccess={fetchAlerts}
                            success="Created new Alert successfully!"
                          >
                            <IconButton>
                              <ControlPointDuplicate />
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
                No Alerts found.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};
