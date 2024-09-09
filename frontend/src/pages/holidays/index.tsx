import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
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
import { Add, Delete, RemoveRedEyeOutlined } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { format, parseISO } from "date-fns";
import ModalButton from "../../components/ModalForm";
import DynamicForm from "../../components/DynamicForm";
import { HolidayDetails } from "./view";
import PaginationTable from "../../components/PaginationTable";

function Holidays() {
  return (
    <Stack
      sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
      gap={2}
    >
      <Box display={"flex"}>
        <Typography variant="h5" fontWeight={600}>
          Holidays
        </Typography>
        <Box flex={1} />
        <ModalButton
          modal={
            <DynamicForm
              fields={[
                {
                  type: "text",
                  label: "Event",
                  name: "event",
                  required: true,
                },
                {
                  type: "date",
                  label: "Date",
                  name: "date",
                  required: true,
                },
                {
                  type: "targetSelector",
                  label: "Select Target",
                  name: "target",
                  required: true,
                },
              ]}
            />
          }
          path="/new"
          url="/holidays"
          title="New Holiday"
          button="Create"
          onSuccess={() => {}}
          success="Created a new Holiday Successfully!"
        >
          <Button variant="contained" size="small">
            <Add /> Create Holiday
          </Button>
        </ModalButton>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <PaginationTable
            name={"holidays"}
            url={`/holidays`}
            placeholder="Search for Scores"
            notFound="No Scores found"
          >
            {(data) => (
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
                      <TableCell>Event</TableCell>
                      <TableCell>Target</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((holiday: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {format(parseISO(holiday.date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>{holiday.event}</TableCell>
                        <TableCell>
                          {holiday.all && (
                            <Typography variant="caption" fontWeight={600}>
                              All
                            </Typography>
                          )}
                          {holiday.batchIds.length != 0 && (
                            <>
                              <Typography variant="caption" fontWeight={600}>
                                Batches
                              </Typography>
                              {holiday.batchIds.map(
                                (batch: any, index: number) => (
                                  <>
                                    <br />
                                    {batch.name}
                                  </>
                                )
                              )}
                            </>
                          )}
                          {holiday.userIds?.length != 0 && (
                            <>
                              <Typography variant="caption" fontWeight={600}>
                                Users
                              </Typography>
                              {holiday?.userIds?.map(
                                (user: any, index: number) => (
                                  <>
                                    <br />
                                    {user.name}
                                  </>
                                )
                              )}
                            </>
                          )}
                        </TableCell>
                        <TableCell sx={{ display: "flex" }}>
                          <ModalButton
                            modal={<HolidayDetails />}
                            path={`/${holiday._id}`}
                            url=""
                            title="Holiday Details"
                            button=""
                            onSuccess={() => {}}
                            success=""
                          >
                            <IconButton>
                              <RemoveRedEyeOutlined />
                            </IconButton>
                          </ModalButton>
                          <ModalButton
                            modal={
                              <Typography>
                                Are you sure you want to delete this?
                              </Typography>
                            }
                            path={`/${holiday._id}/delete`}
                            url={`/holidays/${holiday._id}/delete`}
                            title="Delete Holidays"
                            button="Delete"
                            onSuccess={() => {}}
                            success="Deleted the Holiday Successfully!"
                          >
                            <IconButton>
                              <Delete />
                            </IconButton>
                          </ModalButton>
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

export default Holidays;
