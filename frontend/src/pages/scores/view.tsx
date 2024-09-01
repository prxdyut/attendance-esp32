import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { handleFetch } from "../../utils/handleFetch";
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export function ViewSingleScore() {
  const [score, setScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const id = pathname.split("/")[2];

  useEffect(() => {
    if (id) handleFetch(`/scores/${id}`, setLoading, setScore, console.error);
  }, [id]);

  return (
    <Stack gap={2} sx={{ maxHeight: "50vh", minWidth: "25rem" }}>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}
      {!score ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Typography variant="h5">Score not found</Typography>
        </Box>
      ) : (
        <React.Fragment>
          <Grid container spacing={2} sx={{ textAlign: "center" }}>
            <Grid item xs={12} sm={6}>
              <Card
                elevation={0}
                sx={{ bgcolor: grey[100], py: 1.5, borderRadius: 5 }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Date:
                </Typography>
                <Typography>
                  {new Date(score.date).toLocaleDateString()}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                elevation={0}
                sx={{ bgcolor: grey[100], py: 1.5, borderRadius: 5 }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Subject:
                </Typography>
                <Typography>{score.subject}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                elevation={0}
                sx={{ bgcolor: grey[100], py: 1.5, borderRadius: 5 }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Total Marks:
                </Typography>
                <Typography>{score.total}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                elevation={0}
                sx={{ bgcolor: grey[100], py: 1.5, borderRadius: 5 }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Batch:
                </Typography>
                <Typography>
                  {score.batchIds?.map((batch: any) => batch.name).join(", ")}
                </Typography>
              </Card>
            </Grid>
          </Grid>
          <Typography variant="h6" fontWeight={600}>
            Student Scores
          </Typography>
          <Box>
            <Grid2 container spacing={2}>
              {score.obtained.map((item: any) => (
                <Grid2 xs={6}>
                  <Card
                    elevation={0}
                    key={item.studentId}
                    sx={{
                      textAlign: "center",
                      bgcolor: grey[100],
                      p: 1,
                      borderRadius: 5,
                    }}
                  >
                    <Typography fontWeight={500}>
                      {item.studentId.name}
                    </Typography>
                    <Typography fontWeight={600}>{`${item.marks}`}</Typography>
                  </Card>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        </React.Fragment>
      )}
    </Stack>
  );
}
