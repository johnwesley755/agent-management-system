import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { agentAPI } from "../services/api";
import { Trash2, Users, Calendar, Mail, Phone, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    return (
      <div className="flex items-center justify-center min-h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 text-purple-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg font-medium">Loading agents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Agents ({agents.length})
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your agent network
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {agents.length === 0 ? (
          <Alert className="border-purple-200 bg-purple-50">
            <Users className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-gray-700">
              <div className="space-y-2">
                <p className="font-medium">No agents found</p>
                <p className="text-sm text-gray-600">
                  Add your first agent to get started with your network.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-purple-600" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-purple-600" />
                      <span>Mobile</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <span>Created Date</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, index) => (
                  <tr
                    key={agent._id}
                    className={`border-b border-gray-100 hover:bg-purple-50/50 transition-colors ${
                      index % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-700 font-semibold text-sm">
                            {agent.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {agent.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">{agent.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-800 text-sm font-medium">
                          {agent.mobile.countryCode}
                        </span>
                        <span className="text-gray-700 font-mono">
                          {agent.mobile.number}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">
                          {new Date(agent.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                        onClick={() => handleDelete(agent._id, agent.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentList;
