import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { format, subDays } from "date-fns";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
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
import { grey } from "@mui/material/colors";
import { Add, Search } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateRangeSelector } from "../../components/DateRangeSelector";

export default function NewCards() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ newCards: [] });
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");

  const dateRangeState = useState<[String, String]>([
    format(new Date(), "yyyy-MM-dd"),
    format(new Date(), "yyyy-MM-dd"),
  ]);
  const [dateRange] = dateRangeState;

  useEffect(() => {
    handleFetch(
      `/punches/new?startDate=${startDate}&endDate=${endDate}`,
      setLoading,
      setData,
      console.error
    );
  }, [startDate, endDate]);

  const filteredCards = data.newCards.filter(
    (card: any) =>
      card.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      format(new Date(card.timestamp), "do MMMM yyyy 'at' hh:mm a")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleNewUser = (uid: any) => {
    // Navigate to /users/new with the UID
    console.log(`Navigating to /users/new with UID: ${uid}`);
    // Implement your navigation logic here
  };

  return (
    <Stack
      sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
      gap={2}
    >
      <Typography variant="h5" fontWeight={600}>
        New Cards
      </Typography>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{display: 'flex', flexFlow:'column', gap:3}}>
          <Box display={"flex"} gap={3}>
            <FormControl fullWidth>
              <OutlinedInput
                placeholder="Search New Cards"
                sx={{ borderRadius: 2.5 , bgcolor: 'white'}}
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
            ) : filteredCards.length > 0 ? (
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
                      <TableCell>Time</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCards.map((card: any, index: number) => {
                      const cardDate = new Date(card.timestamp);
                      return (
                        <TableRow key={index}>
                          <TableCell>{card.uid}</TableCell>
                          <TableCell>
                            {format(cardDate, "do MMMM yyyy")}
                          </TableCell>
                          <TableCell>{format(cardDate, "hh:mm a")}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              startIcon={<Add />}
                              onClick={() => handleNewUser(card.uid)}
                              size="small"
                            >
                              New User
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" textAlign="center" py={4}>
                No new cards found.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
