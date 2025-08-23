import React, { useState } from "react";
import toast from "react-hot-toast";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { listAPI } from "../services/api";

const UploadCSV = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const allowedTypes = [".csv", ".xlsx", ".xls"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    // Check file type
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      toast.error("Only CSV, XLS, and XLSX files are allowed");
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await listAPI.upload(formData);
      const { totalItems, agentsCount, distribution } = response.data;

      toast.success(
        `File uploaded successfully! ${totalItems} items distributed among ${agentsCount} agents.`
      );

      setFile(null);
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      const message = error.response?.data?.message || "Upload failed";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card">
      <h3>Upload CSV File</h3>

      <div className="form-group">
        <div
          className={`file-upload ${dragOver ? "dragover" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input").click()}
        >
          <Upload
            size={48}
            style={{ color: "#667eea", marginBottom: "1rem" }}
          />
          <p>
            <strong>Click to browse</strong> or drag and drop your file here
          </p>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            Supported formats: CSV, XLS, XLSX (Max 5MB)
          </p>
        </div>

        <input
          type="file"
          id="file-input"
          style={{ display: "none" }}
          accept=".csv,.xlsx,.xls"
          onChange={handleFileInput}
        />
      </div>

      {file && (
        <div className="file-info">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={20} />
            <div>
              <p>
                <strong>{file.name}</strong>
              </p>
              <p style={{ color: "#666", fontSize: "0.875rem" }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: "1.5rem" }}>
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload and Distribute"}
        </button>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <AlertCircle size={16} />
          <strong>File Requirements:</strong>
        </div>
        <ul style={{ paddingLeft: "1.5rem", color: "#666" }}>
          <li>CSV must contain columns: FirstName, Phone, Notes</li>
          <li>FirstName and Phone are required fields</li>
          <li>Notes field is optional</li>
          <li>Items will be distributed equally among 5 agents</li>
          <li>
            If total items is not divisible by 5, remaining items will be
            distributed sequentially
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UploadCSV;
