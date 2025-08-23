import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Users, Phone, FileText } from "lucide-react";
import { listAPI } from "../services/api";

const DistributedLists = () => {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await listAPI.getAll();
      setLists(response.data);
    } catch (error) {
      toast.error("Failed to fetch distributed lists");
    } finally {
      setIsLoading(false);
    }
  };

  // Group lists by agent
  const groupedLists = lists.reduce((acc, list) => {
    const agentId = list.agentId._id;
    if (!acc[agentId]) {
      acc[agentId] = {
        agent: list.agentId,
        lists: [],
      };
    }
    acc[agentId].lists.push(list);
    return acc;
  }, {});

  if (isLoading) {
    return <div className="loading">Loading distributed lists...</div>;
  }

  return (
    <div className="card">
      <h3>Distributed Lists</h3>

      {Object.keys(groupedLists).length === 0 ? (
        <div className="empty-state">
          <h3>No distributed lists found</h3>
          <p>Upload a CSV file to distribute items among agents.</p>
        </div>
      ) : (
        <div className="distribution-summary">
          {Object.values(groupedLists).map(({ agent, lists }) => {
            const totalItems = lists.reduce(
              (sum, list) => sum + list.items.length,
              0
            );

            return (
              <div key={agent._id} className="agent-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Users size={20} />
                  <h4>{agent.name}</h4>
                </div>

                <p>
                  <strong>Email:</strong> {agent.email}
                </p>
                <p>
                  <strong>Total Items:</strong> {totalItems}
                </p>
                <p>
                  <strong>Files:</strong> {lists.length}
                </p>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    setSelectedAgent(
                      selectedAgent === agent._id ? null : agent._id
                    )
                  }
                  style={{ marginTop: "1rem" }}
                >
                  {selectedAgent === agent._id
                    ? "Hide Details"
                    : "View Details"}
                </button>

                {selectedAgent === agent._id && (
                  <div className="items-list">
                    <h5 style={{ marginBottom: "1rem" }}>Assigned Items:</h5>
                    {lists.map((list) => (
                      <div key={list._id} style={{ marginBottom: "1.5rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <FileText size={16} />
                          <strong>{list.fileName}</strong>
                          <span style={{ color: "#666", fontSize: "0.875rem" }}>
                            ({list.items.length} items)
                          </span>
                        </div>

                        {list.items.map((item, index) => (
                          <div key={index} className="item">
                            <div>
                              <strong>{item.firstName}</strong>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                margin: "0.25rem 0",
                              }}
                            >
                              <Phone size={14} />
                              <span>{item.phone}</span>
                            </div>
                            {item.notes && (
                              <div
                                style={{ color: "#666", fontSize: "0.875rem" }}
                              >
                                Notes: {item.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DistributedLists;
