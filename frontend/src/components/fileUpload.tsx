import React, { useState, useCallback } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  LinearProgress,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import {
  Close,
  FolderOutlined,
  LaunchOutlined,
  RefreshOutlined,
  UploadFileOutlined,
  UploadOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const S3Uploader = ({
  name = "fileUrl",
  label = "Upload File",
}: {
  name?: string;
  label?: string;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [progress, setProgress] = useState(-1);
  const [error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const resetUpload = () => {
    setSelectedFile(undefined);
    setProgress(-1);
    setError("");
    setFileUrl("");
    setFileType("");
  };
  const s3Client = new S3Client({
    endpoint: "http://localhost:9000",
    region: "india",
    credentials: {
      accessKeyId: "TfhmUr4p6Y9xo4W4RpA1",
      secretAccessKey: "fda1lQshPh6G99QOquzAm8zR94yYZ60Kyguhky5N",
    },
    forcePathStyle: true,
  });

  const handleFileInput = useCallback((e: any) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setProgress(-1);
    setError("");
    console.log("File selected:", file.name);
  }, []);

  const uploadFile = useCallback(async () => {
    if (fileUrl) {
      selectFile();
      return;
    }
    if (!selectedFile) {
      setError("Please select a file first!");
      return;
    }
    setProgress(0);
    const params = {
      Bucket: "uploads",
      Key: `${selectedFile.name}`,
      Body: selectedFile,
    };

    try {
      console.log("Starting upload...");
      const upload = new Upload({
        client: s3Client,
        params: params,
      });

      upload.on("httpUploadProgress", (progress: any) => {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        setProgress(percentage);
        console.log(`Upload progress: ${percentage}%`);
      });
      await upload.done();
      const fileUrl = `/${params.Bucket}/${params.Key}`;
      setFileUrl(fileUrl);
      setFileType(selectedFile.type);
      console.log("File URL:", fileUrl);
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setProgress(-1);
      setError(`Error uploading file: ${err.message}`);
    }
  }, [selectedFile, s3Client]);
  const selectFile = () => {
    if (selectedFile) resetUpload();
    else (document.querySelector('[type="file"]') as HTMLElement)?.click();
  };

  return (
    <Box>
      {fileUrl && <input type="hidden" value={fileUrl} name={name} />}
      {fileType && <input type="hidden" value={fileType} name={"fileType"} />}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <TextField
              onClick={selectFile}
              type="text"
              value={selectedFile?.name ? selectedFile.name : ""}
              label={label}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
                width: "100%",
                "& input": {
                  caretColor: "transparent",
                  cursor: "pointer",
                },
              }}
              InputLabelProps={{
                shrink: Boolean(selectedFile?.name),
              }}
            />
            <Box
              sx={{ position: "absolute", right: ".6rem", bgcolor: "white" }}
            >
              {fileUrl ? (
                <IconButton onClick={resetUpload}>
                  <Close />
                </IconButton>
              ) : (
                <IconButton onClick={selectFile}>
                  <FolderOutlined />
                </IconButton>
              )}
            </Box>
          </Box>
          {selectedFile?.size ? (
            <Typography variant="caption">
              {selectedFile.type}{" "}
              {Number((selectedFile?.size || 0) / 1000000).toFixed(2) + "MB"}
            </Typography>
          ) : (
            <Typography variant="caption">Max file size 50MB</Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            type="button"
            variant="contained"
            size="small"
            sx={{ borderRadius: 2.5 }}
            endIcon={<LaunchOutlined />}
            color="secondary"
            component={Link}
            to={fileUrl}
            target="_blank"
            disabled={!fileUrl}
          >
            Preview
          </Button>
          <Button
            onClick={uploadFile}
            disabled={!selectedFile}
            type="button"
            variant="contained"
            sx={{ borderRadius: 2.5 }}
            endIcon={fileUrl ? <RefreshOutlined /> : <UploadOutlined />}
          >
            {fileUrl ? "Reset" : "Upload"}
          </Button>
        </Box>
      </Box>
      <input
        type="file"
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
      <Collapse in={progress >= 0 && progress < 100}>
        <LinearProgress
          variant={progress == 0 ? "indeterminate" : "buffer"}
          sx={{
            mt: 1,
          }}
          value={progress}
        />
      </Collapse>

      {error && <Typography variant="caption">{error}</Typography>}
    </Box>
  );
};

export default S3Uploader;
