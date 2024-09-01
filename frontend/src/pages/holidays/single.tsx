import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Add, Delete, Download, Preview } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { format, parseISO } from "date-fns";

function HolidayDetails() {
  const [holiday, setHoliday] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    handleFetch(
      `/holidays/${id}`,
      setLoading,
      (data: any) => setHoliday(data),
      console.log
    );
  }, [id]);

  useEffect(() => {
    if (holiday?.batchIds.length) {
      handleFetch(
        "/batches/" +
          holiday.batchIds.map((b) => b._id).join(",") +
          "/students?role=student",
        setLoading,
        setStudents,
        console.error
      );
      handleFetch(
        "/batches/" +
          holiday.batchIds.map((b) => b._id).join(",") +
          "/students?role=faculty",
        setLoading,
        setFaculty,
        console.error
      );
    }
  }, [holiday]);

  console.log(holiday);

  if (!holiday) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        py={8}
        sx={{ height: "100%" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100%" }}
    >
      <Card
        elevation={0}
        sx={{ borderRadius: 5, bgcolor: grey[100], width: "80%" }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            {holiday.event}
          </Typography>
          <Typography variant="body1">
            Date: {format(parseISO(holiday.date), "dd MMM yyyy")}
          </Typography>
          <Typography variant="body1">
            Target:{" "}
            {holiday.all && (
              <span>
                <Typography variant="caption" fontWeight={600}>
                  All
                </Typography>
              </span>
            )}
            {holiday.batchIds.length != 0 && (
              <>
                <Typography variant="caption" fontWeight={600}>
                  Batches
                </Typography>
                {holiday.batchIds.map((batch: any, index: number) => (
                  <>
                    <br />
                    {batch.name}
                  </>
                ))}
              </>
            )}
            {holiday.userIds.length != 0 && (
              <>
                <Typography variant="caption" fontWeight={600}>
                  Users
                </Typography>
              </>
            )}
          </Typography>
          <Typography variant="body1">
            Users:
            {(holiday.userIds.length
              ? holiday.userIds
              : [...students, ...faculty]
            ).map((user: any, index: number) => (
              <>
                <br />
                {user.name} {`(${user.role})`}
              </>
            ))}
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" size="small">
              <Delete /> Delete
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default HolidayDetails;
