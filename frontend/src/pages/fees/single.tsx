import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { grey } from "@mui/material/colors";

export const StudentFeeDetails = () => {
  const [loading, setLoading] = useState(false);
  const [feeDetails, setFeeDetails] = useState<any>(null);
  const { pathname } = useLocation();
  const userId = pathname.split("/")[2];

  useEffect(() => {
    if (userId) {
      handleFetch(
        `/fees/student/${userId}`,
        setLoading,
        (data) => setFeeDetails(data),
        console.error
      );
    }
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!feeDetails) return null;

  return (
    <Stack gap={2} sx={{ maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h5" fontWeight={600}>
        {feeDetails?.studentName}'s Fee Details
      </Typography>

      <Grid container spacing={1} sx={{ textAlign: "center" }}>
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              bgcolor: grey[100],
              py: 1.5,
              borderRadius: 5,
              display: "flex",
              px: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Total Fees:
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Typography>{feeDetails?.totalFees}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              bgcolor: grey[100],
              py: 1.5,
              borderRadius: 5,
              display: "flex",
              px: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Total Paid:
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Typography>{feeDetails?.totalPaid}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              bgcolor: grey[100],
              py: 1.5,
              px: 2,
              borderRadius: 5,
              display: "flex",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Remaining Amount:
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Typography>{feeDetails?.remainingAmount}</Typography>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h6" fontWeight={600} mt={2}>
        Installment Details
      </Typography>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Ref No.</TableCell>
              <TableCell>Mode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feeDetails?.installments.map((installment:any) => (
              <TableRow key={installment._id}>
                <TableCell>
                  {new Date(installment.date).toLocaleDateString()}
                </TableCell>
                <TableCell>₹{installment.amount}</TableCell>
                <TableCell>{installment.refNo}</TableCell>
                <TableCell>{installment.mode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};