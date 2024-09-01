import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Search, Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import ModalButton from "../../components/ModalForm";
import DynamicForm from "../../components/DynamicForm";

const Faculty = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ users: [] });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFaculty = () =>
    handleFetch("/users?role=faculty", setLoading, setData, console.log);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const filteredUsers = data.users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(data);
  return (
    <Stack
      sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
      gap={2}
    >
      <Box display={"flex"} justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>
          Facultys
        </Typography>
        <ModalButton
          modal={
            <DynamicForm
              fields={[
                { type: "text", name: "name", label: "Full Name" },
                { type: "text", name: "phone", label: "Phone No." },
                { type: "text", name: "cardUid", label: "Card UID" },
                {
                  type: "optionSelector",
                  required: true,
                  name: "role",
                  label: "User Type",
                  options: [
                    {
                      value: "Faculty",
                      name: "Faculty",
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
                },
              ]}
            />
          }
          path={`/new`}
          url={`/users`}
          title="New Faculty"
          button="Create"
          onSuccess={fetchFaculty}
          success="Created new Faculty successfully!"
        >
          <Button variant="contained" size="small">
            <Add /> New Faculty
          </Button>
        </ModalButton>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <FormControl fullWidth>
            <OutlinedInput
              placeholder="Search Facultys..."
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
            ) : filteredUsers.length > 0 ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Facultys table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Batch</TableCell>
                      <TableCell>Card UID</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.cardUid}</TableCell>
                        <TableCell>
                          {user.batchIds?.map((user: any) => (
                            <>
                              {user.name} <br />
                            </>
                          ))}
                        </TableCell>
                        <TableCell sx={{ display: "flex" }}>
                          <IconButton
                            component={Link}
                            to={`/user/${user._id}`}
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
                                    defaultValue: user.name,
                                  },
                                  {
                                    type: "text",
                                    name: "phone",
                                    label: "Phone No.",
                                    defaultValue: user.phone,
                                  },
                                  {
                                    type: "text",
                                    name: "cardUid",
                                    label: "Card UID",
                                    defaultValue: user.cardUid,
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
                                      ids: user.batchIds?.map(
                                        (user: any) => user._id
                                      ),
                                    },
                                  },
                                ]}
                              />
                            }
                            path={`/${user._id}/edit`}
                            url={`/users/${user._id}/edit`}
                            title="Edit Faculty"
                            button="Save"
                            onSuccess={fetchFaculty}
                            success="Edited Faculty successfully!"
                          >
                            <IconButton>
                              <Edit />
                            </IconButton>
                          </ModalButton>
                          <ModalButton
                            modal={
                              <Typography>
                                Are you sure you want to delete this?
                              </Typography>
                            }
                            path={`/${user._id}/delete`}
                            url={`/users/${user._id}/delete`}
                            title="Delete Facultys"
                            button="Delete"
                            onSuccess={fetchFaculty}
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
            ) : (
              <Typography variant="body1" textAlign="center" py={4}>
                No Facultys found.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Faculty;
