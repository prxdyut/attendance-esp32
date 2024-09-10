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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, EditOutlined, VisibilityOutlined } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { grey } from "@mui/material/colors";
import ModalButton from "../../components/ModalForm";
import DynamicForm, { defaultDate } from "../../components/DynamicForm";
import { ViewSingleScore } from "./view";
import { getAllSubjects, getSubject } from "../../utils/subjectsActions";
import PaginationTable from "../../components/PaginationTable";

export default function Scores() {
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
          Scores
        </Typography>
        <Box flex={1} />

        <ModalButton
          modal={
            <DynamicForm
              fields={[
                {
                  type: "text",
                  label: "Title",
                  name: "title",
                  required: true,
                },
                {
                  type: "date",
                  label: "Date",
                  name: "date",
                  required: true,
                },
                {
                  type: "optionSelector",
                  required: true,
                  name: "subject",
                  label: "Subject",
                  options: getAllSubjects(),
                  readOnly: true,
                },
                {
                  type: "number",
                  label: "Total",
                  name: "total",
                  required: true,
                },
                {
                  type: "targetSelectorWithStudentsInput",
                  label: "Select Batch",
                  selectOnly: "batchIds",
                  name: "target",
                },
              ]}
            />
          }
          path="/new"
          url="/scores"
          title="New Score"
          button="Create"
          onSuccess={() => {}}
          success="Created a new score Successfully!"
        >
          <Button variant="contained" size="small">
            <Add /> Create Score
          </Button>
        </ModalButton>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <PaginationTable
            name={"scores"}
            url={`/scores`}
            placeholder="Search for Subject or Title"
            notFound="No Scores found"
            hasDateFilter
            hasSearchFilter
            hasBatchFilter
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
                        <TableCell>Title</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Batch</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.map((score: any, index: number) => {
                        let userData: any = {};

                        score.obtained.forEach((o: any) => {
                          userData[o.studentId] = o.marks;
                        });

                        return (
                          <TableRow key={index}>
                            <TableCell>
                              {format(parseISO(score.date), "dd MMM yyyy")}
                            </TableCell>
                            <TableCell>{score.title}</TableCell>
                            <TableCell>{getSubject(score.subject)}</TableCell>
                            <TableCell>{score.total}</TableCell>
                            <TableCell>
                              {score.batchIds.map(
                                (batch: any, index: number) => (
                                  <>
                                    {batch.name}{" "}
                                    {!(data?.length == index) && <br />}
                                  </>
                                )
                              )}
                            </TableCell>

                            <TableCell sx={{ display: "flex" }}>
                              <ModalButton
                                modal={
                                  <DynamicForm
                                    fields={[
                                      {
                                        type: "text",
                                        label: "Title",
                                        name: "title",
                                        required: true,
                                        defaultValue: score.title,
                                      },
                                      {
                                        type: "date",
                                        label: "Date",
                                        name: "date",
                                        required: true,
                                        defaultValue: defaultDate(score.date),
                                      },
                                      {
                                        type: "optionSelector",
                                        required: true,
                                        name: "subject",
                                        label: "Subject",
                                        options: getAllSubjects(),
                                        // readOnly: true,
                                        defaultValue: score.subject,
                                      },
                                      {
                                        type: "number",
                                        label: "Total",
                                        name: "total",
                                        required: true,
                                        defaultValue: score.total,
                                      },
                                      {
                                        type: "targetSelectorWithStudentsInput",
                                        name: "targetWithStudents",
                                        label: "Select Batch",
                                        selectOnly: "batchIds",
                                        defaultValue: {
                                          type: "batchIds",
                                          ids: score.batchIds.map(
                                            (_: any) => _._id
                                          ),
                                        },
                                      },
                                    ]}
                                    users={userData}
                                  />
                                }
                                path={`/${score._id}/edit`}
                                url={`/scores/${score._id}/edit`}
                                title="Edit Score"
                                button="Save"
                                onSuccess={() => {}}
                                success="Saved the edited score successfully!"
                              >
                                <IconButton>
                                  <EditOutlined />
                                </IconButton>
                              </ModalButton>
                              <ModalButton
                                modal={<ViewSingleScore />}
                                path={`/${score._id}`}
                                url=""
                                title="Score Details"
                                button=""
                                onSuccess={() => {}}
                                success=""
                              >
                                <IconButton>
                                  <VisibilityOutlined />
                                </IconButton>
                              </ModalButton>
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
