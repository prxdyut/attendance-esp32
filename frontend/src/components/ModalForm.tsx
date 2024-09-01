import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { handleSubmit } from "../utils/handleSubmit";
import {
  Alert,
  Box,
  Collapse,
  DialogContentText,
  Divider,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalButton(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
  title: string;
  path: string;
  url: string;
  button: string;
  onSuccess: (arg: any) => void;
  success: string;
}) {
  const location = useLocation();
  const navigateTo = useNavigate();
  const open =
    `/${location.pathname.split("/")[1]}${props.path}` == location.pathname;

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<
    | {
        type: "error" | "loading" | "success";
        text: string;
      }
    | undefined
  >();

  const onSuccess = (arg: any) => {
    setMessage({ type: "success", text: props.success });
  };
  const onError = (arg: any) => {
    setMessage({
      type: "error",
      text: arg,
    });
  };

  const handleOpen = () => {
    navigateTo(`/${location.pathname.split("/")[1]}${props.path}`);
  };
  const handleClose = () => {
    if (isLoading) return;
    setTimeout(() => {
      if (message?.type == "success") {
        props.onSuccess(true);
      }
      setMessage(undefined);
    }, 500);
    navigateTo(-1);
  };
  const handleForm = async (e: React.FormEvent) =>
    handleSubmit(e, props.url, setLoading, onSuccess, onError);

  const isLoading = message?.type == "loading";
  const isSuccess = message?.type == "success";
  const isError = message?.type == "error";
  return (
    <React.Fragment>
      <Box onClick={handleOpen}>{props.children}</Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        component={"form"}
        onSubmit={handleForm}
        PaperProps={{ style: { marginBlock: 16 } }}
        sx={{ "& .MuiDialog-paper": { borderRadius: 5 } }}
      >
        <DialogTitle fontWeight={600}>{props.title}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <Divider />
        <DialogContent>
          <Collapse in={!Boolean(isSuccess)}>
            <Box sx={{ mt: 1 }}>{props.modal}</Box>
          </Collapse>
          <Collapse in={Boolean(isSuccess)}>
            <DialogContentText>{message?.text}</DialogContentText>
          </Collapse>
          <Collapse in={Boolean(isError)}>
            <DialogContentText sx={{ mt: 2 }}>
              {message?.text}
            </DialogContentText>
          </Collapse>
        </DialogContent>
        <Divider />
        {Boolean(isSuccess || !props.button) ? (
          <DialogActions sx={{ height: "3rem" }}>
            <Button onClick={handleClose}>Done</Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ height: "3rem" }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {props.button}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
