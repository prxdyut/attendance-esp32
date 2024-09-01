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

export const AlertDetails = () => {
  const [loading, setLoading] = useState(false);
  const [alertDetails, setAlertDetails] = useState(null);
  const { pathname } = useLocation();
  const alertId = pathname.split("/")[2];

  useEffect(() => {
    if (alertId) {
      handleFetch(
        `/alerts/${alertId}`,
        setLoading,
        setAlertDetails,
        console.error
      );
    }
  }, [alertId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!alertDetails) return null;
  
  return (
    <Paper elevation={0} sx={{ minWidth: 400, maxWidth: 800, mx: "auto" }}>
      <Typography variant="body1" fontWeight={600}>
        {alertDetails.title}
      </Typography>
      <Typography variant="body2">{alertDetails.message}</Typography>
      <Divider sx={{ my: 1 }} />
      <Typography variant="caption" color="text.secondary" gutterBottom>
        {format(parseISO(alertDetails.date), "MMMM d, yyyy")}
      </Typography>
      <Typography variant="subtitle1">
        Target{alertDetails.all && <span>: All</span>}
      </Typography>

      {alertDetails.batchIds && alertDetails.batchIds.length > 0 && (
        <>
          <Typography variant="subtitle2">Batches:</Typography>
          <Box display={"flex"} gap={2}>
            {alertDetails.batchIds.map((batch) => (
              <Typography key={batch._id} variant="subtitle2">
                {batch.name}
              </Typography>
            ))}
          </Box>
        </>
      )}
      {alertDetails.userIds && alertDetails.userIds.length > 0 && (
        <>
          <Typography variant="subtitle2"> Users:</Typography>
          <Box display={"flex"} gap={2}>
            {alertDetails.userIds.map((user) => (
              <Typography key={user._id} variant="subtitle2">{user.name}</Typography>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};
