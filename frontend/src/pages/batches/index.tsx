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
  IconButton,
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
import { Search, Add, Visibility, Edit, Delete } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import ModalButton from "../../components/ModalForm";
import DynamicForm from "../../components/DynamicForm";

interface Batch {
  _id: string;
  name: string;
}

export default function Batches() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<{ batches: Batch[] }>({ batches: [] });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const fetchBatches = () => {
    handleFetch("/batches", setLoading, setData, console.log);
  };
  useEffect(() => {
    fetchBatches();
  }, []);

  const filteredBatches = data.batches.filter((batch) =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(data);
  return (
    <Stack
      sx={{ overflow: "hidden", height: "100%", flexFlow: "column" }}
      gap={2}
    >
      <Box display={"flex"} justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>
          Batches
        </Typography>
        <ModalButton
          modal={
            <DynamicForm
              fields={[
                { type: "text", name: "name", label: "Batch Name" },
                {
                  type: "targetSelector",
                  label: "Select Students",
                  selectOnly: "userIds",
                  name: "target",
                  noPrompt: true,
                },
              ]}
            />
          }
          path={`/new`}
          url={`/batches`}
          title="New Batch"
          button="Create"
          onSuccess={fetchBatches}
          success="Created new Batch successfully!"
        >
          <Button variant="contained" size="small">
            <Add /> New Batch
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
            ) : (
              <TableContainer
                elevation={0}
                component={Paper}
                sx={{ borderRadius: 2 }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Students</TableCell>
                      <TableCell>Teachers</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBatches.map((batch: any, index) => (
                      <TableRow key={batch._id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{batch.name}</TableCell>
                        <TableCell>
                          {batch.students.length + batch.faculty.length}
                        </TableCell>
                        <TableCell>{batch.students.length}</TableCell>
                        <TableCell>{batch.faculty.length}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              component={Link}
                              to={`/batches/${batch._id}`}
                              size="small"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton
                              component={Link}
                              to={`./${batch._id}/edit/users`}
                            >
                              <Edit />
                            </IconButton>

                            <ModalButton
                              modal={
                                <Typography>
                                  Are you sure you want to delete this Batch?
                                </Typography>
                              }
                              path={`/${batch._id}/delete`}
                              url={`/batches/${batch._id}/delete`}
                              title="Delete Batch"
                              button="Delete"
                              onSuccess={fetchBatches}
                              success="Deleted the Batch Successfully!"
                            >
                              <IconButton>
                                <Delete />
                              </IconButton>
                            </ModalButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </CardContent>
      </Card>
      <Outlet />
    </Stack>
  );
}
