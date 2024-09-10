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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { DateRangeSelector } from "../../components/DateRangeSelector";
import PaginationTable from "../../components/PaginationTable";

interface HolidayItem {
  name: string;
  date: string;
}

export function HolidayFor() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  return (
    <Stack
      sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
      gap={2}
    >
      <Box display={"flex"}>
        <Typography variant="h5" fontWeight={600}>
          Holiday Data
        </Typography>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <PaginationTable
            name={"holidayFor"}
            url={`/statistics/holidayFor`}
            placeholder="Search for Scores"
            notFound="No Holidays found"
            hasPersonFilter
            hasDateFilter
          >
            {(data) => (
              <TableContainer
                elevation={0}
                component={Paper}
                sx={{ borderRadius: 2 }}
              >
                <Table sx={{ width: isMobile ? "max-content" : "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {format(parseISO(item.date), "do MMMM yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </PaginationTable>
        </CardContent>
      </Card>
    </Stack>
  );
}
