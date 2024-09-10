import { format } from "date-fns";
import {
  Button,
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
import { Person, School } from "@mui/icons-material";
import { Link } from "react-router-dom";
import PaginationTable from "../../components/PaginationTable";

export default function NewCards() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  return (
    <Stack
      sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
      gap={2}
    >
      <Typography variant="h5" fontWeight={600}>
        New Cards
      </Typography>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent
          sx={{
            display: "flex",
            flexFlow: isMobile ? "column" : "row",
            gap: 3,
          }}
        >
          <PaginationTable
            name={"newCards"}
            url={"/punches/new"}
            placeholder="Search for new Cards"
            notFound="No cards found"
            hasDateFilter
            hasSearchFilter
          >
            {(data) => {
              return (
                <TableContainer
                  elevation={0}
                  component={Paper}
                  sx={{ borderRadius: 2 }}
                >
                  <Table sx={{ width: isMobile ? "max-content" : "100%" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>UID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((card: any, index: number) => {
                        const cardDate = new Date(card.timestamp);
                        return (
                          <TableRow key={index}>
                            <TableCell>{card.uid}</TableCell>
                            <TableCell>
                              {format(cardDate, "do MMMM yyyy")}
                            </TableCell>
                            <TableCell>{format(cardDate, "hh:mm a")}</TableCell>
                            <TableCell sx={{ display: "flex", gap: 2 }}>
                              <Button
                                variant="contained"
                                startIcon={<Person />}
                                size="small"
                                component={Link}
                                to={
                                  "/students/new?autofill=true&cardUid=" +
                                  card.uid
                                }
                              >
                                New Student
                              </Button>
                              <Button
                                variant="contained"
                                startIcon={<School />}
                                size="small"
                                component={Link}
                                to={
                                  "/faculty/new?autofill=true&cardUid=" +
                                  card.uid
                                }
                              >
                                New Faculty
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              );
            }}
          </PaginationTable>
        </CardContent>
      </Card>
    </Stack>
  );
}
