import React, { useState, useEffect } from 'react';
import { handleFetch } from '../../utils/handleFetch';
import { format, subDays, parseISO } from 'date-fns';
import { TargetSelector } from '../../components/SelectTarget';
import {
  Box,
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

interface Absentee {
  name: string;
  date: string;
}

export function Absentees() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Absentee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectionType, setSelectionType] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const dateRangeState = useState<[string, string]>([
    format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    format(new Date(), 'yyyy-MM-dd'),
  ]);
  const [dateRange] = dateRangeState;

  useEffect(() => {
    const queryParams = new URLSearchParams({
      startDate: dateRange[0],
      endDate: dateRange[1],
      selectionType,
      selectedIds: selectedIds.join(','),
    });

    handleFetch(
      `/attendance/absentees?${queryParams}`,
      setLoading,
      (data: { absentees: Absentee[] }) => setData(data.absentees),
      console.error
    );
  }, [dateRange, selectionType, selectedIds]);

  const handleSelectionChange = (newType: string, newIds: string[]) => {
    setSelectionType(newType);
    setSelectedIds(newIds);
  };

  const filteredData = data.filter((item: Absentee) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Stack
      sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
      gap={2}
    >
      <Box display="flex">
        <Typography variant="h5" fontWeight={600}>
          Absentees
        </Typography>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <Box display="flex" gap={3}>
            <FormControl fullWidth>
              <OutlinedInput
                placeholder="Search students..."
                sx={{ borderRadius: 2.5, bgcolor: "white" }}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </FormControl>
            <DateRangeSelector state={dateRangeState} />
            <TargetSelector
              onSelectionChange={handleSelectionChange}
              label="Select Target..."
            />
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((item: Absentee, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {format(parseISO(item.date), 'dd MMM yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" textAlign="center" py={4}>
                No absentees found.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}