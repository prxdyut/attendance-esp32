import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { format, parseISO } from "date-fns";
export const HolidayDetails = () => {
  const [loading, setLoading] = useState(false);
  const [holidayDetails, setholidayDetails] = useState<any>(null);
  const { pathname } = useLocation();
  const holidayId = pathname.split("/")[2];

  useEffect(() => {
    if (holidayId) {
      handleFetch(
        `/holidays/${holidayId}`,
        setLoading,
        setholidayDetails,
        console.error
      );
    }
  }, [holidayId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!holidayDetails) return null;
  console.log(holidayDetails);

  return (
    <Paper elevation={0} sx={{ minWidth: 400, maxWidth: 800, mx: "auto" }}>
      <Typography variant="body1" fontWeight={600}>
        {holidayDetails.event}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Typography variant="caption" color="text.secondary" gutterBottom>
        {format(parseISO(holidayDetails.date), "MMMM d, yyyy")}
      </Typography>
      <Typography variant="subtitle1">
        Target{holidayDetails.all && <span>: All</span>}
      </Typography>

      {holidayDetails.batchIds && holidayDetails.batchIds.length > 0 && (
        <>
          <Typography variant="subtitle2">Batches:</Typography>
          <Box display={"flex"} gap={2}>
            {holidayDetails.batchIds.map((batch:any) => (
              <Typography key={batch._id} variant="subtitle2">
                {batch.name}
              </Typography>
            ))}
          </Box>
        </>
      )}
      {holidayDetails.userIds && holidayDetails.userIds.length > 0 && (
        <>
          <Typography variant="subtitle2"> Users:</Typography>
          <Box display={"flex"} gap={2}>
            {holidayDetails.userIds.map((user: any) => (
              <Typography key={user._id} variant="subtitle2">
                {user.name}
              </Typography>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};
