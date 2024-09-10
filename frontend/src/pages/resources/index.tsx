import React, { useState, useEffect } from "react";
import { handleFetch } from "../../utils/handleFetch";
import { Link } from "react-router-dom";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Delete, Download, Preview, Search } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { DateRangeSelector } from "../../components/DateRangeSelector";
import { format, parseISO } from "date-fns";
import ModalButton from "../../components/ModalForm";
import DynamicForm from "../../components/DynamicForm";
import PaginationTable from "../../components/PaginationTable";

export const ResourceList = () => {
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
          Resources
        </Typography>
        <Box flex={1} />
        <ModalButton
          modal={
            <DynamicForm
              fields={[
                {
                  type: "date",
                  label: "Date",
                  name: "date",
                  required: true,
                },
                {
                  type: "text",
                  label: "Title",
                  name: "title",
                  required: true,
                },
                {
                  type: "fileSelector",
                  label: "Select File to Upload",
                  name: "fileUrl",
                },
                {
                  type: "targetSelector",
                  label: "Select Target",
                  name: "target",
                },
              ]}
            />
          }
          path="/new"
          url="/resources"
          title="New Resource"
          button="Create"
          onSuccess={() => {}}
          success="Created a new Resource Successfully!"
        >
          <Button variant="contained" size="small">
            <Add /> Create Schedule
          </Button>
        </ModalButton>
      </Box>
      <Card elevation={0} sx={{ borderRadius: 5, bgcolor: grey[100] }}>
        <CardContent sx={{ display: "flex", flexFlow: "column", gap: 3 }}>
          <PaginationTable
            name={"resources"}
            url={`/resources`}
            placeholder="Search for Resources"
            notFound="No Resources found"
            hasSearchFilter
            hasTargetSelector
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
                      <TableCell>UID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>File Type</TableCell>
                      <TableCell>Messages</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((resource: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {format(parseISO(resource.date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>{resource.title}</TableCell>
                        <TableCell>{resource.fileType}</TableCell>
                        <TableCell>
                          {resource.all && (
                            <Typography variant="caption" fontWeight={600}>
                              All
                            </Typography>
                          )}
                          {resource.batchIds.length != 0 && (
                            <>
                              <Typography variant="caption" fontWeight={600}>
                                Batches
                              </Typography>
                              {resource.batchIds.map(
                                (batch: any, index: number) => (
                                  <>
                                    <br />
                                    {batch.name}
                                  </>
                                )
                              )}
                            </>
                          )}
                          {resource.userIds.length != 0 && (
                            <>
                              <Typography variant="caption" fontWeight={600}>
                                Users
                              </Typography>
                              {resource.userIds.map(
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
                          {
                            // @ts-ignore
                            <IconButton
                              LinkComponent={Link}
                              to={resource.fileUrl}
                              target="_blank"
                            >
                              <Download />
                            </IconButton>
                          }

                          <ModalButton
                            modal={
                              <Typography>
                                Are you sure you want to delete this?
                              </Typography>
                            }
                            path={`/${resource._id}/delete`}
                            url={`/resources/${resource._id}/delete`}
                            title="Delete Schedule"
                            button="Delete"
                            onSuccess={() => {}}
                            success="Deleted the Schedule Successfully!"
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
};
