import React, { useState } from "react";
import { logout, getUser } from "../utils/auth";
import AddAgent from "./AddAgent";
import AgentList from "./AgentList";
import UploadCSV from "./UploadCSV";
import DistributedLists from "./DistributedLists";
import { Profile } from "./Profile";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("agents");
  const user = getUser();

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "agents":
        return <AgentList />;
      case "add-agent":
        return <AddAgent onAgentAdded={() => setActiveTab("agents")} />;
      case "upload":
        return <UploadCSV onUploadComplete={() => setActiveTab("lists")} />;
      case "lists":
        return <DistributedLists />;
      case "profile":
        return <Profile />;
      default:
        return <AgentList />;
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Agent Management System</h1>
            {user && (
              <p
                style={{
                  margin: "0.5rem 0 0 0",
                  fontSize: "0.875rem",
                  opacity: 0.9,
                }}
              >
                Welcome, {user.name || user.email}
              </p>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "agents" ? "active" : ""}`}
            onClick={() => setActiveTab("agents")}
          >
            Agents
          </button>
          <button
            className={`tab ${activeTab === "add-agent" ? "active" : ""}`}
            onClick={() => setActiveTab("add-agent")}
          >
            Add Agent
          </button>
          <button
            className={`tab ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            Upload CSV
          </button>
          <button
            className={`tab ${activeTab === "lists" ? "active" : ""}`}
            onClick={() => setActiveTab("lists")}
          >
            Distributed Lists
          </button>
          <button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
