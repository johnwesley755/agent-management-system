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
      <div className="flex items-center justify-center min-h-64 bg-white rounded-xl border border-gray-200 shadow-sm mx-4 sm:mx-0">
        <div className="flex items-center space-x-3 text-purple-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg font-medium">Loading agents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mx-4 sm:mx-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Agents ({agents.length})
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Manage your agent network
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
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
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <div className="min-w-full">
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
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-purple-700 font-semibold text-sm">
                                  {agent.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {agent.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-700 truncate">
                                {agent.email}
                              </span>
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
                              onClick={() =>
                                handleDelete(agent._id, agent.name)
                              }
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
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {agents.map((agent, index) => (
                  <div
                    key={agent._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Agent Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-700 font-semibold">
                          {agent.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {agent.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {agent.email}
                        </p>
                      </div>
                    </div>

                    {/* Agent Details */}
                    <div className="space-y-3">
                      {/* Mobile */}
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <div className="flex items-center space-x-1 min-w-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-medium">
                            {agent.mobile.countryCode}
                          </span>
                          <span className="text-sm text-gray-700 font-mono truncate">
                            {agent.mobile.number}
                          </span>
                        </div>
                      </div>

                      {/* Created Date */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
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

                      {/* Actions */}
                      <div className="flex justify-end pt-2">
                        <button
                          className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                          onClick={() => handleDelete(agent._id, agent.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablet Horizontal Scroll Table */}
              <div className="hidden sm:block lg:hidden">
                <div className="overflow-x-auto -mx-4 sm:-mx-6">
                  <div className="inline-block min-w-full px-4 sm:px-6">
                    <div className="overflow-hidden">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-purple-600" />
                                <span>Name</span>
                              </div>
                            </th>
                            <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-purple-600" />
                                <span>Email</span>
                              </div>
                            </th>
                            <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-purple-600" />
                                <span>Mobile</span>
                              </div>
                            </th>
                            <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-purple-600" />
                                <span>Created</span>
                              </div>
                            </th>
                            <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">
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
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-700 font-semibold text-xs">
                                      {agent.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="font-medium text-gray-900 text-sm">
                                    {agent.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="text-gray-700 text-sm">
                                  {agent.email}
                                </span>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="flex items-center space-x-1">
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-medium">
                                    {agent.mobile.countryCode}
                                  </span>
                                  <span className="text-gray-700 font-mono text-sm">
                                    {agent.mobile.number}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="text-gray-600 text-sm">
                                  {new Date(agent.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "2-digit",
                                    }
                                  )}
                                </span>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <button
                                  className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-200"
                                  onClick={() =>
                                    handleDelete(agent._id, agent.name)
                                  }
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span>Delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentList;
