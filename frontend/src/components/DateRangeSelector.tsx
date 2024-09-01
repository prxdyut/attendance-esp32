import { Box, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";

export function DateRangeSelector(props: {
  state: [
    [string, string],
    React.Dispatch<React.SetStateAction<[string, string]>>
  ];
}) {
  const [dateRange, setDateRange] = props.state;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box display={"flex"} gap={1} alignItems={"center"}>
        <DatePicker
          format="dd/MM/yy"
          label="Start"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
            bgcolor: "white",
          }}
          value={new Date(dateRange[0] as string)}
          onChange={(value) =>
            setDateRange((data) => [
              format(value as Date, "yyyy-MM-dd"),
              data[1],
            ])
          }
        />
        <Typography>-</Typography>
        <DatePicker
          format="dd/MM/yy"
          label="End"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
            bgcolor: "white",
          }}
          value={new Date(dateRange[1] as string)}
          onChange={(value) =>
            setDateRange((data) => [
              data[0],
              format(value as Date, "yyyy-MM-dd"),
            ])
          }
        />
      </Box>
    </LocalizationProvider>
  );
}
