import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { format, subDays, parseISO } from "date-fns";
import { TargetSelector } from "../../components/SelectTarget";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
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
import { Search } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { DateRangeSelector } from "../../components/DateRangeSelector";

export function Presentees() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectionType, setSelectionType] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  const dateRangeState = useState<[string, string]>([
    format(subDays(new Date(), 1), "yyyy-MM-dd"),
    format(new Date(), "yyyy-MM-dd"),
  ]);
  const [dateRange] = dateRangeState;

  useEffect(() => {
    const queryParams = new URLSearchParams({
      startDate: dateRange[0],
      endDate: dateRange[1],
      selectionType,
      selectedIds: selectedIds.join(","),
    });

    handleFetch(
      `/attendance/presentees?${queryParams}`,
      setLoading,
      (data: any) => setData(data.presentees),
      console.error
    );
  }, [dateRange, selectionType, selectedIds]);

  const handleSelectionChange = (newType: any, newIds: any) => {
    setSelectionType(newType);
    setSelectedIds(newIds);
  };

  const filteredData = data.filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(data);

  return (
    <Stack
      sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
      gap={2}
    >
      <Box display={"flex"}>
        <Typography variant="h5" fontWeight={600}>
          Presentees
        </Typography>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <Box display={"flex"} gap={3}>
            <FormControl fullWidth>
              <OutlinedInput
                placeholder="Search students..."
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
            <TargetSelector onSelectionChange={handleSelectionChange} />
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
            ) : filteredData.length > 0 ? (
              <TableContainer
                elevation={0}
                component={Paper}
                sx={{ borderRadius: 2 }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Punch Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {format(parseISO(item.date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          {item.punchTimes.map((time: any) => format(parseISO(time), "hh:mm a")).join(', ') }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" textAlign="center" py={4}>
                No presentees found.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
