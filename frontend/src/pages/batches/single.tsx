import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import {
  Box,
  Container,
  Typography,
  Paper,
  InputBase,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Card,
  FormControl,
  OutlinedInput,
  InputAdornment,
  CardContent,
} from "@mui/material";
import {
  Search,
  Add,
  Visibility,
  Edit,
  Delete,
  Remove,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import ModalButton from "../../components/ModalForm";
import DynamicForm from "../../components/DynamicForm";

export default function BatchSingle() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({ students: [], faculty: [] });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { pathname } = useLocation();
  const id = pathname.split("/")[2];
  const fetchData = () =>
    handleFetch("/batches/" + id, setLoading, setData, console.log);
  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const filteredStudents =
    data?.students?.filter((student: any) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredFaculty =
    data?.faculty?.filter((faculty: any) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const users = [
    ...data?.faculty?.map((user: any) => user._id),
    ...data?.students?.map((user: any) => user._id),
  ];
  return (
    <Stack
      sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
      gap={2}
    >
      <Box display={"flex"} justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>
          Batches {">"} {data?.batch?.name}
        </Typography>
        <Box flex={1} />
        <ModalButton
          modal={
            <Box sx={{ m: 0 }}>
              <DynamicForm
                key={String(users.length)}
                fields={[
                  {
                    type: "text",
                    name: "name",
                    label: "Batch Name",
                    defaultValue: data?.batch?.name,
                  },
                  {
                    type: "targetSelector",
                    label: "Select Target",
                    name: "target",
                    noPrompt: true,
                    selectOnly: "userIds",
                    defaultValue: {
                      type: "userIds",
                      ids: users,
                    },
                  },
                ]}
              />
            </Box>
          }
          path={`/${data?.batch?._id}/edit/users`}
          url={`/batches/${data?.batch?._id}/edit`}
          title="Edit Users"
          button="Create"
          onSuccess={fetchData}
          success="Edited the Batch successfully!"
        >
          <Button variant="contained" size="small" startIcon={<Edit />}>
            Edit Batch
          </Button>
        </ModalButton>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <FormControl fullWidth>
            <OutlinedInput
              placeholder="Search batches..."
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
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={8}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Faculty Table */}
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 2 }}
              >
                <Typography variant="body1" sx={{ px: 2, py: 1 }}>
                  Faculty
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFaculty.map((faculty: any) => (
                      <TableRow key={faculty.id}>
                        <TableCell>{faculty.name}</TableCell>
                        <TableCell>{faculty.email}</TableCell>
                        <TableCell sx={{ display: "flex" }}>
                          <IconButton
                            component={Link}
                            to={`/user/${faculty._id}`}
                            size="small"
                          >
                            <Visibility />
                          </IconButton>
                          <ModalButton
                            modal={
                              <DynamicForm
                                fields={[
                                  {
                                    type: "text",
                                    name: "name",
                                    label: "Full Name",
                                    defaultValue: faculty.name,
                                  },
                                  {
                                    type: "text",
                                    name: "phone",
                                    label: "Phone No.",
                                    defaultValue: faculty.phone,
                                  },
                                  {
                                    type: "text",
                                    name: "cardUid",
                                    label: "Card UID",
                                    defaultValue: faculty.cardUid,
                                  },
                                  {
                                    type: "optionSelector",
                                    required: true,
                                    name: "role",
                                    label: "User Type",
                                    options: [
                                      {
                                        value: "student",
                                        name: "Student",
                                      },
                                      {
                                        value: "faculty",
                                        name: "Faculty",
                                      },
                                    ],
                                    defaultValue: "faculty",
                                    readOnly: true,
                                  },
                                  {
                                    type: "targetSelector",
                                    label: "Select Batch",
                                    selectOnly: "batchIds",
                                    name: "target",
                                    defaultValue: {
                                      type: "batchIds",
                                      ids: faculty.batchIds?.map(
                                        (user: any) => user._id
                                      ),
                                    },
                                  },
                                ]}
                              />
                            }
                            path={`/${id}/${faculty._id}/edit`}
                            url={`/users/${faculty._id}/edit`}
                            title="Edit Faculty"
                            button="Save"
                            onSuccess={fetchData}
                            success="Edited Faculty successfully!"
                          >
                            <IconButton>
                              <Edit />
                            </IconButton>
                          </ModalButton>
                          <ModalButton
                            modal={
                              <Typography>
                                Are you sure you want to remove from this batch?
                              </Typography>
                            }
                            path={`/${id}/${faculty._id}/remove`}
                            url={`/users/${faculty._id}/${id}/remove`}
                            title="Remove Faculty"
                            button="Remove"
                            onSuccess={fetchData}
                            success="removed Faculty successfully!"
                          >
                            <IconButton>
                              <Remove />
                            </IconButton>
                          </ModalButton>
                          <ModalButton
                            modal={
                              <Typography>
                                Are you sure you want to delete this User?
                              </Typography>
                            }
                            path={`/${id}/${faculty._id}/delete`}
                            url={`/users/${faculty._id}/delete`}
                            title="Delete Faculty"
                            button="Delete"
                            onSuccess={fetchData}
                            success="Deleted the User Successfully!"
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

              {/* Students Table */}
              <TableContainer
                elevation={0}
                component={Paper}
                sx={{ borderRadius: 2 }}
              >
                <Typography variant="body1" sx={{ px: 2, py: 1 }}>
                  Students
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.map((student: any) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell sx={{ display: "flex" }}>
                          <IconButton
                            component={Link}
                            to={`/user/${student._id}`}
                            size="small"
                          >
                            <Visibility />
                          </IconButton>
                          <ModalButton
                            modal={
                              <DynamicForm
                                fields={[
                                  {
                                    type: "text",
                                    name: "name",
                                    label: "Full Name",
                                    defaultValue: student.name,
                                  },
                                  {
                                    type: "text",
                                    name: "phone",
                                    label: "Phone No.",
                                    defaultValue: student.phone,
                                  },
                                  {
                                    type: "text",
                                    name: "cardUid",
                                    label: "Card UID",
                                    defaultValue: student.cardUid,
                                  },
                                  {
                                    type: "optionSelector",
                                    required: true,
                                    name: "role",
                                    label: "User Type",
                                    options: [
                                      {
                                        value: "student",
                                        name: "Student",
                                      },
                                      {
                                        value: "faculty",
                                        name: "Faculty",
                                      },
                                    ],
                                    defaultValue: "student",
                                    readOnly: true,
                                  },
                                  {
                                    type: "targetSelector",
                                    label: "Select Batch",
                                    selectOnly: "batchIds",
                                    name: "target",
                                    single: true,
                                    defaultValue: {
                                      type: "batchIds",
                                      ids: [student.batchIds[0]._id],
                                    },
                                  },
                                ]}
                              />
                            }
                            path={`/${id}/${student._id}/edit`}
                            url={`/users/${student._id}/edit`}
                            title="Edit Student"
                            button="Save"
                            onSuccess={fetchData}
                            success="Edited Student successfully!"
                          >
                            <IconButton>
                              <Edit />
                            </IconButton>
                          </ModalButton>
                          <ModalButton
                            modal={
                              <Typography>
                                Are you sure you want to remove from this batch?
                              </Typography>
                            }
                            path={`/${id}/${student._id}/remove`}
                            url={`/users/${student._id}/${id}/remove`}
                            title="Remove Student"
                            button="Remove"
                            onSuccess={fetchData}
                            success="removed Student successfully!"
                          >
                            <IconButton>
                              <Remove />
                            </IconButton>
                          </ModalButton>
                          <ModalButton
                            modal={
                              <Typography>
                                Are you sure you want to delete this User?
                              </Typography>
                            }
                            path={`/${id}/${student._id}/delete`}
                            url={`/users/${student._id}/delete`}
                            title="Delete Student"
                            button="Delete"
                            onSuccess={fetchData}
                            success="Deleted the User Successfully!"
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
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
