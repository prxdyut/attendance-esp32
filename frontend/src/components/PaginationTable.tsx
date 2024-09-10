import React, { ReactNode, useEffect, useState, useCallback } from "react";
import { format, subMonths } from "date-fns";
import { handleFetch } from "../utils/handleFetch";
import {
  Box,
  CircularProgress,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Stack,
  TablePagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { DateRangeSelector } from "./DateRangeSelector";
import { TargetSelector } from "./SelectTarget";

type Props = {
  name: string;
  url: string;
  placeholder: string;
  notFound: string;
  query?: string;
  hasSearchFilter?: boolean;
  hasDateFilter?: boolean;
  hasBatchFilter?: boolean;
  hasPersonFilter?: boolean;
  hasDateRange?: boolean;
  hasTargetSelector?: boolean;
  children: (data: any[]) => ReactNode;
};

const isNotFalse = (bool?: boolean) => {
  if (typeof bool == "undefined") return true;
  else return bool;
};

export default function PaginationTable(props: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const dateRangeState = useState<[string, string]>([
    format(subMonths(new Date(), 1), "yyyy-MM-dd"),
    format(new Date(), "yyyy-MM-dd"),
  ]);
  const [pagination, setPagination] = useState<{
    current: number;
    total: number;
    rows: number;
    count: number;
  }>({
    current: 1,
    total: 0,
    rows: 10,
    count: 0,
  });
  const [dateRange] = dateRangeState;
  const [selectionType, setSelectionType] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPagination((_) => ({ ..._, current: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPagination((_) => ({
      ..._,
      rows: parseInt(event.target.value, 10),
      current: 1,
    }));
  };

  const fetchData = useCallback(() => {
    handleFetch(
      `${props.url}?startDate=${dateRange[0]}&endDate=${dateRange[1]}${
        searchTerm ? "&search=" + searchTerm : ""
      }${selectionType ? "&selectionType=" + selectionType : ""}${
        selectedIds ? "&selectedIds=" + selectedIds.join(",") : ""
      }&${props?.query ? props.query : ""}`,
      setLoading,
      setData,
      console.error,
      {
        pagination: {
          current: pagination.current,
          rows: pagination.rows,
          set: setPagination,
        },
      }
    );
  }, [
    props.url,
    dateRange,
    searchTerm,
    pagination.current,
    pagination.rows,
    selectionType,
    selectedIds,
  ]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 1000); // 300ms delay

    return () => clearTimeout(debounceTimer);
  }, [fetchData]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPagination((_) => ({ ..._, current: 1 })); // Reset to first page on new search
  };

  // @ts-ignore
  const filteredData = data?.[props.name];
  console.log(data);
  const handleSelectionChange = (newType: any, newIds: any) => {
    newIds.length ? setSelectionType(newType) : setSelectionType("");
    setSelectedIds(newIds);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  return (
    <Box
      display={"flex"}
      gap={2}
      flexDirection={"column"}
      sx={{ width: "100%" }}
    >
      <Box display={"flex"} gap={2} flexDirection={"column"} alignItems={"end"}>
        {props.hasSearchFilter && (
          <FormControl fullWidth>
            <OutlinedInput
              placeholder={props.placeholder}
              sx={{ borderRadius: 2.5, bgcolor: "white" }}
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </FormControl>
        )}
        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
          {props.hasDateFilter && <DateRangeSelector state={dateRangeState} />}
          {(props.hasTargetSelector ||
            props.hasBatchFilter ||
            props.hasPersonFilter) && (
            <TargetSelector
              selectOnly={
                props.hasBatchFilter
                  ? "batchIds"
                  : props.hasPersonFilter
                  ? "userIds"
                  : undefined
              }
              label={
                props.hasBatchFilter
                  ? "Select Batches"
                  : props.hasPersonFilter
                  ? "Select Person"
                  : undefined
              }
              onSelectionChange={handleSelectionChange}
            />
          )}
        </Stack>
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
        ) : filteredData?.length > 0 ? (
          props.children(filteredData)
        ) : (
          <Typography variant="body1" textAlign="center" py={4}>
            {props.notFound}
          </Typography>
        )}
      </Box>
      {filteredData?.length > 0 && (
        <Box>
          <TablePagination
            sx={{ px: 0 }}
            component="div"
            labelRowsPerPage={"Rows"}
            count={pagination.count}
            page={pagination.current - 1}
            onPageChange={handleChangePage}
            rowsPerPage={pagination.rows}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </Box>
  );
}
