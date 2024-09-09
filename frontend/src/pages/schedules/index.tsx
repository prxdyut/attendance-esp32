// components/LectureScheduler.js
import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import { Edit, Search } from "lucide-react";
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
import { grey } from "@mui/material/colors";
import { DateRangeSelector } from "../../components/DateRangeSelector";
import {
  Add,
  ControlPointDuplicate,
  Delete,
  Person,
  School,
} from "@mui/icons-material";
import ModalButton from "../../components/ModalForm";
import DynamicForm, {
  defaultDate,
  defaultTime,
} from "../../components/DynamicForm";
import { Link, useLocation } from "react-router-dom";
import PaginationTable from "../../components/PaginationTable";

export default function Schedule() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  return (
    <React.Fragment>
      <Stack
        sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
        gap={2}
      >
        <Box display={"flex"}>
          <Typography variant="h5" fontWeight={600}>
            Schedules
          </Typography>
          <Box flex={1} />
          <ModalButton
            modal={
              <DynamicForm
                key={"1"}
                fields={[
                  {
                    type: "date",
                    label: "Date",
                    name: "date",
                    required: true,
                  },
                  {
                    type: "text",
                    label: "Subject",
                    name: "subject",
                    required: true,
                  },
                  {
                    type: "time",
                    label: "Start Time",
                    name: "startTime",
                    required: true,
                  },
                  {
                    type: "time",
                    label: "End Time",
                    name: "endTime",
                    required: true,
                  },
                  {
                    type: "targetSelector",
                    label: "Select Batch",
                    selectOnly: "batchIds",
                    name: "target",
                    single: true,
                  },
                ]}
              />
            }
            path="/new"
            url="/schedules"
            title="New Schedule"
            button="Create"
            onSuccess={() => {}}
            success="Created a new Schedule Successfully!"
          >
            <Button variant="contained" size="small">
              <Add /> Create Schedule
            </Button>
          </ModalButton>
        </Box>
        <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
          <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
            <PaginationTable
              name={"schedules"}
              url={`/schedules`}
              placeholder="Search for Schedules"
              notFound="No Schedules found"
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
                          <TableCell>Batch</TableCell>
                          <TableCell>Subject</TableCell>
                          <TableCell>Start</TableCell>
                          <TableCell>End</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((schedule: any, index: number) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                {format(parseISO(schedule.date), "dd MMM yyyy")}
                              </TableCell>
                              <TableCell>{schedule.batchIds.name}</TableCell>
                              <TableCell>{schedule.subject}</TableCell>
                              <TableCell>{schedule.startTime}</TableCell>
                              <TableCell>{schedule.endTime}</TableCell>
                              <TableCell sx={{ display: "flex", gap: 1 }}>
                                <ModalButton
                                  modal={
                                    <DynamicForm
                                      fields={[
                                        {
                                          type: "date",
                                          label: "Date",
                                          name: "date",
                                          required: true,
                                          defaultValue: defaultDate(
                                            schedule.date
                                          ),
                                        },
                                        {
                                          type: "text",
                                          label: "Subject",
                                          name: "subject",
                                          required: true,
                                          defaultValue: schedule.subject,
                                        },
                                        {
                                          type: "time",
                                          label: "Start Time",
                                          name: "startTime",
                                          required: true,
                                          defaultValue: defaultDate(
                                            schedule.startTime
                                          ),
                                        },
                                        {
                                          type: "time",
                                          label: "End Time",
                                          name: "endTime",
                                          required: true,
                                          defaultValue: defaultDate(
                                            schedule.endTime
                                          ),
                                        },
                                        {
                                          type: "targetSelector",
                                          label: "Select Batch",
                                          selectOnly: "batchIds",
                                          single: true,
                                          name: "target",
                                          defaultValue: {
                                            type: "batchIds",
                                            ids: [schedule.batchIds._id],
                                          },
                                        },
                                      ]}
                                    />
                                  }
                                  path={`/${schedule._id}/edit`}
                                  url={`/schedules/${schedule._id}/edit`}
                                  title="Edit Schedule"
                                  button="Save"
                                  onSuccess={() => {}}
                                  success="Updated the Schedule Successfully!"
                                >
                                  <IconButton>
                                    <Edit />
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
                                          defaultValue: defaultDate(
                                            schedule.date
                                          ),
                                        },
                                        {
                                          type: "text",
                                          label: "Subject",
                                          name: "subject",
                                          required: true,
                                          defaultValue: schedule.subject,
                                        },
                                        {
                                          type: "time",
                                          label: "Start Time",
                                          name: "startTime",
                                          required: true,
                                          defaultValue: defaultTime(
                                            schedule.startTime
                                          ),
                                        },
                                        {
                                          type: "time",
                                          label: "End Time",
                                          name: "endTime",
                                          required: true,
                                          defaultValue: defaultTime(
                                            schedule.endTime
                                          ),
                                        },
                                        {
                                          type: "targetSelector",
                                          label: "Select Batch",
                                          selectOnly: "batchIds",
                                          single: true,
                                          name: "target",
                                          defaultValue: {
                                            type: "batchIds",
                                            ids: [schedule.batchIds._id],
                                          },
                                        },
                                      ]}
                                    />
                                  }
                                  path={`/${schedule._id}/duplicate`}
                                  url={`/schedules`}
                                  title="Duplicate Schedule"
                                  button="Save"
                                  onSuccess={() => {}}
                                  success="Duplicated the Schedule Successfully!"
                                >
                                  <IconButton>
                                    <ControlPointDuplicate />
                                  </IconButton>
                                </ModalButton>
                                <ModalButton
                                  modal={
                                    <Typography>
                                      Are you sure you want to delete this?
                                    </Typography>
                                  }
                                  path={`/${schedule._id}/delete`}
                                  url={`/schedules/${schedule._id}/delete`}
                                  title="Delete Schedule"
                                  button="Delete"
                                  onSuccess={() => {}}
                                  success="Deleted the Schedule Successfully!"
                                >
                                  <IconButton>
                                    <Delete />
                                  </IconButton>
                                </ModalButton>
                              </TableCell>
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
      </Stack>
    </React.Fragment>
  );
}
