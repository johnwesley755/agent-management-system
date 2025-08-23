import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { agentAPI } from "../services/api";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await agentAPI.getAll();
      setAgents(response.data);
    } catch (error) {
      toast.error("Failed to fetch agents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete agent "${name}"?`)) {
      try {
        await agentAPI.delete(id);
        toast.success("Agent deleted successfully");
        fetchAgents();
      } catch (error) {
        toast.error("Failed to delete agent");
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Loading agents...</div>;
  }

  return (
    <div className="card">
      <h3>Agents ({agents.length})</h3>

      {agents.length === 0 ? (
        <div className="empty-state">
          <h3>No agents found</h3>
          <p>Add your first agent to get started.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent._id}>
                  <td>{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>
                    {agent.mobile.countryCode} {agent.mobile.number}
                  </td>
                  <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(agent._id, agent.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentList;
