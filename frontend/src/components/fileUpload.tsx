import React, { useState, useCallback } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const S3Uploader = ({ name = 'fileUrl' }: { name?: string }) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState("");

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
    setProgress(0);
    setError("");
    console.log("File selected:", file.name);
  }, []);

  const uploadFile = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select a file first!");
      return;
    }

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
      console.log("File URL:", fileUrl);
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setError(`Error uploading file: ${err.message}`);
    }
  }, [selectedFile, s3Client]);

  return (
    <div>
      {fileUrl && <input type="text" value={fileUrl} name={name} />}
      <input type="file" onChange={handleFileInput} />
      <button onClick={uploadFile} type="button" disabled={!selectedFile}>
        Upload to S3
      </button>
      {progress > 0 && (
        <div>
          <progress value={progress} max="100" />
          <span>{progress}%</span>
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default S3Uploader;
