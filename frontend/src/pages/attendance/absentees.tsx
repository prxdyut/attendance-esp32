import { format, parseISO } from "date-fns";
import {
  Box,
  Card,
  CardContent, Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { grey } from "@mui/material/colors";
import PaginationTable from "../../components/PaginationTable";

interface Absentee {
  name: string;
  date: string;
}

export function Absentees() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });
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
          <PaginationTable
            name={"absentees"}
            url={`/attendance/absentees`}
            placeholder="Search for Person"
            notFound="No Absentees found"
            hasTargetSelector
            
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
                    {data.map((item: Absentee, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {format(parseISO(item.date), "dd MMM yyyy")}
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
