import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { agentAPI } from "../services/api";
import {
  Trash2,
  Users,
  Calendar,
  Mail,
  Phone,
  Loader2,
  SearchX,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AgentList = ({ searchQuery }) => {
  const [allAgents, setAllAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Fetches all agents once on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await agentAPI.getAll();
        setAllAgents(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch agents");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgents();
  }, []);

  // Filters agents whenever the search query or master list changes
  useEffect(() => {
    const lowercasedQuery = searchQuery ? searchQuery.toLowerCase() : "";

    if (!lowercasedQuery) {
      setFilteredAgents(allAgents);
    } else {
      const filtered = allAgents.filter(
        (agent) =>
          agent.name.toLowerCase().includes(lowercasedQuery) ||
          agent.email.toLowerCase().includes(lowercasedQuery) ||
          agent.mobile.number.includes(lowercasedQuery)
      );
      setFilteredAgents(filtered);
    }
  }, [searchQuery, allAgents]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete agent "${name}"?`)) {
      try {
        await agentAPI.delete(id);
        toast.success("Agent deleted successfully");
        const response = await agentAPI.getAll();
        setAllAgents(response.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Failed to delete agent");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-3 text-purple-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg font-medium">Loading agents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto p-4 sm:p-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 sm:px-6 py-4 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Agents ({filteredAgents.length})
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Manage your agent network
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {allAgents.length > 0 && filteredAgents.length === 0 ? (
          <Alert className="border-yellow-200 bg-yellow-50">
            <SearchX className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-gray-700">
              <p className="font-medium">No agents found for "{searchQuery}"</p>
              <p className="text-sm text-gray-600">
                Try searching for a different name, email, or phone number.
              </p>
            </AlertDescription>
          </Alert>
        ) : filteredAgents.length === 0 ? (
          <Alert className="border-purple-200 bg-purple-50">
            <Users className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-gray-700">
              <p className="font-medium">No agents found</p>
              <p className="text-sm text-gray-600">
                Add your first agent to get started.
              </p>
            </AlertDescription>
          </Alert>
        ) : (
          <div>
            {/* --- DESKTOP TABLE VIEW (Visible on large screens) --- */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Mobile
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Created Date
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map((agent) => (
                    <tr
                      key={agent._id}
                      className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-700 font-semibold">
                              {agent.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">
                            {agent.name}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700 truncate">
                        {agent.email}
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
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(agent.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
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

            {/* --- MOBILE CARD VIEW (Visible on small/medium screens) --- */}
            <div className="block lg:hidden space-y-4">
              {filteredAgents.map((agent) => (
                <div
                  key={agent._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-700 font-semibold">
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {agent.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {agent.email}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <div className="flex items-center space-x-1 min-w-0 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-medium">
                          {agent.mobile.countryCode}
                        </span>
                        <span className="text-gray-700 font-mono truncate">
                          {agent.mobile.number}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-gray-600">
                        {new Date(agent.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
                    <button
                      className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                      onClick={() => handleDelete(agent._id, agent.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentList;
