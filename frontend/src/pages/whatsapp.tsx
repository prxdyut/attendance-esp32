import React, { useState, useEffect } from "react";
import { handleSubmit } from "../utils/handleSubmit";
import { handleFetch } from "../utils/handleFetch";
import AutoReloadImage from "../components/AutoReloadingImage";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Replay as ReplayIcon,
  CameraAlt as CameraAltIcon,
  Send as SendIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

interface FailedMessage {
  userId: {
    name: string;
    phone: string;
  };
  message: string;
  error: string;
  screen: string;
}

interface Stats {
  messagesToday: number;
  messagesThisMonth: number;
  sendRate: number;
  failedMessages: number;
}

export default function Whatsapp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    messagesToday: 0,
    messagesThisMonth: 0,
    sendRate: 0,
    failedMessages: 0,
  });
  const [failedMessages, setFailedMessages] = useState<FailedMessage[]>([]);

  useEffect(() => {
    checkApiStatus();
    getFailedMessages();
  }, []);

  const checkApiStatus = async () => {
    handleFetch(
      "/whatsapp/api-status",
      setLoading,
      (data: { isLoggedIn: boolean }) => {
        console.log(data);
        setIsLoggedIn(data.isLoggedIn);
      },
      setError
    );
  };

  const getFailedMessages = async () => {
    handleFetch(
      "/whatsapp/failed-messages",
      setLoading,
      (data: { failedMessages: FailedMessage[] }) => {
        setFailedMessages(data.failedMessages);
        setStats((prev) => ({
          ...prev,
          failedMessages: data.failedMessages.length,
        }));
        console.log(data);
      },
      setError
    );
  };

  const retryFailedMessages = async (event: React.FormEvent) => {
    handleSubmit(
      event,
      "/whatsapp/retry-failed-messages",
      setLoading,
      () => {
        alert("Retrying failed messages");
        getFailedMessages();
      },
      setError
    );
  };

  const login = async () => {
    handleFetch(
      "/whatsapp/login",
      setLoading,
      (data: { qrCodeUrl?: string }) => {
        console.log(data);
        if (data.qrCodeUrl) {
          setQrCode(data.qrCodeUrl);
        } else {
          setIsLoggedIn(true);
          setQrCode(null);
        }
      },
      setError
    );
  };

  const logout = async (e: React.FormEvent) => {
    handleSubmit(
      e,
      "/whatsapp/logout",
      setLoading,
      () => {
        setIsLoggedIn(false);
        setQrCode(null);
      },
      setError
    );
  };

  const restart = async (event: React.FormEvent) => {
    handleSubmit(
      event,
      "/whatsapp/reload",
      setLoading,
      () => {
        checkApiStatus();
      },
      setError
    );
  };

  const sendTestMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(
      event,
      "/whatsapp/send-test-message",
      setLoading,
      () => {
        alert("Test message sent successfully!");
      },
      setError
    );
  };

  const getScreenshot = async () => {
    handleFetch(
      "/whatsapp/screenshot",
      setLoading,
      (data: { screenshotPath: string }) => {
        window.open(`/api/${data.screenshotPath}`);
      },
      setError
    );
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* {loading && <LoadingOverlay />} */}
      <Stack
        sx={{
          overflow: "auto",
          height: "100%",
          flexFlow: "column",
          pb: 2,
          flex: 1,
        }}
        gap={2}
      >
        <Typography variant="h5" fontWeight={600}>
          Whatsapp
        </Typography>

        <Card
          elevation={0}
          sx={{
            bgcolor: grey[100],
            borderRadius: 5,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "" :"center",
              flexFlow: isMobile ? "column" : "row"
            }}
          >
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <Typography variant="h6" fontWeight={700}>
                Status:{" "}
              </Typography>
              <Chip
                label={isLoggedIn ? "Connected" : "Not Connected"}
                color={isLoggedIn ? "success" : "error"}
                size="small"
              />
            </Box>
            <Box sx={{textAlign: isMobile ? 'end' : ""}}>
              <Tooltip title="Check Status">
                <IconButton onClick={checkApiStatus} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Login">
                <IconButton onClick={login} color="success">
                  <LoginIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton onClick={logout} color="error">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reload">
                <IconButton onClick={restart} color="warning">
                  <ReplayIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Get Screenshot">
                <IconButton onClick={getScreenshot} color="secondary">
                  <CameraAltIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {Object.entries(stats).map(([key, value]) => (
            <Grid item xs={6} sm={3} key={key}>
              <Card
                elevation={0}
                sx={{
                  textAlign: "center",
                  height: "100%",
                  bgcolor: grey[100],
                  borderRadius: 5,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {qrCode && (
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <AutoReloadImage
                src={`/api/${qrCode}`}
                alt={"Whatsapp QR"}
                sx={{ maxWidth: "100%", height: "auto" }}
              />
            </Paper>
          </Box>
        )}

        <Card sx={{ bgcolor: grey[100], borderRadius: 5 }} elevation={0}>
          <CardContent>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
              Test Message
            </Typography>
            <form onSubmit={sendTestMessage}>
              <Stack direction={isMobile ? "column":"row"} gap={2}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  variant="outlined"
                  sx={{borderRadius: 2.5}}
                />
                <TextField
                  fullWidth
                  name="contactName"
                  label="Contact Name"
                  variant="outlined"
                  sx={{borderRadius: 2.5}}
                />
                <TextField
                  fullWidth
                  name="message"
                  label="Message"
                  variant="outlined"
                  sx={{borderRadius: 2.5}}
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SendIcon />}
                  size="large"
                  sx={{ width: "100%", px: 2 }}
                >
                  Send
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
        <Card
          elevation={0}
          sx={{
            bgcolor: grey[100],
            borderRadius: 5,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box display={"flex"} sx={{ pb: 1, flexFlow: isMobile? "column" : 'row' }}>
              <Typography variant="h6" gutterBottom>
                Failed Messages
              </Typography>
              <Box flex={1} />
              <Button
                variant="contained"
                color="secondary"
                onClick={retryFailedMessages}
                startIcon={<RefreshIcon />}
                size="small"
              >
                Retry Failed Messages
              </Button>
            </Box>
            {failedMessages.length > 0 ? (
              <>
                <List sx={{ flex: 1, overflow: "auto" }}>
                  {failedMessages.map((msg, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: "error.light",
                        mb: 1,
                        borderRadius: 1,
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            To: {msg.userId.name} ({msg.userId.phone})
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Message: {msg.message}
                            </Typography>
                            {msg.error && (
                              <Typography variant="body2" color="error">
                                Error: {msg.error}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      {msg.screen && (
                        <Button
                          href={`/whatsapp/errors${msg.screen}`}
                          target="_blank"
                          size="small"
                          variant="outlined"
                          startIcon={<ErrorIcon />}
                          sx={{ mt: 1 }}
                        >
                          Preview Error
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Typography align="center" color="textSecondary">
                No failed messages
              </Typography>
            )}
          </CardContent>
        </Card>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
