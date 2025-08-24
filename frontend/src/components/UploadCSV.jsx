import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Database,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { listAPI } from "../services/api";

const UploadCSV = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const allowedTypes = [".csv", ".xlsx", ".xls"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!file) return false;
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      toast.error("Only CSV, XLS, and XLSX files are allowed");
      return false;
    }
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
      const { totalItems, agentsCount } = response.data;

      toast.success(
        `File uploaded! ${totalItems} items distributed among ${agentsCount} agents.`
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Database className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Upload Data File
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Import and distribute data to agents
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? "border-purple-400 bg-purple-50 scale-102"
              : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/30"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input").click()}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full">
              <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-medium text-gray-900">
                <span className="text-purple-600 hover:text-purple-700 underline">
                  Click to browse
                </span>{" "}
                or drag & drop
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                CSV, XLS, XLSX (Max 5MB)
              </p>
            </div>
          </div>
          {dragOver && (
            <div className="absolute inset-0 bg-purple-100/50 rounded-xl flex items-center justify-center">
              <div className="text-purple-600 font-medium">Drop file here</div>
            </div>
          )}
        </div>
        <input
          type="file"
          id="file-input"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileInput}
        />

        {/* File Info */}
        {file && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="font-medium text-green-900 truncate">
                    {file.name}
                  </p>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <button
            className={`w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              !file || isUploading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Upload and Distribute</span>
              </>
            )}
          </button>
        </div>

        {/* Requirements */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-1" />
          <AlertDescription>
            <div className="space-y-3">
              <span className="font-semibold text-blue-900">
                File Requirements:
              </span>
              <ul className="space-y-2 text-sm text-blue-800 list-disc list-inside">
                <li>Columns must include: `firstName` and `phone`.</li>
                <li>The `notes` column is optional.</li>
                <li>Your active agents will share the items equally.</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default UploadCSV;
