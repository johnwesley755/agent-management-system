import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp,
  Database,
  UserCheck,
  List,
  Eye,
  EyeOff,
} from "lucide-react";
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-600 text-lg">
                Loading distributed lists...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg">
            <Database className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Distributed Lists
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and view distributed items across agents
            </p>
          </div>
        </div>

        {Object.keys(groupedLists).length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0 p-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full">
                <List className="w-12 h-12 text-purple-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900">
                  No distributed lists found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Upload a CSV file to distribute items among agents and start
                  managing your distributed lists.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Agents
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {Object.keys(groupedLists).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Files
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {lists.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Items
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {lists.reduce((sum, list) => sum + list.items.length, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                    <List className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.values(groupedLists).map(({ agent, lists }) => {
                const totalItems = lists.reduce(
                  (sum, list) => sum + list.items.length,
                  0
                );

                return (
                  <div
                    key={agent._id}
                    className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0 overflow-hidden transition-all duration-300 hover:shadow-xl"
                  >
                    {/* Agent Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold">
                            {agent.name}
                          </h4>
                          <p className="text-purple-100 text-sm">
                            {agent.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-purple-100 text-xs uppercase tracking-wide">
                            Items
                          </p>
                          <p className="text-2xl font-bold">{totalItems}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-purple-100 text-xs uppercase tracking-wide">
                            Files
                          </p>
                          <p className="text-2xl font-bold">{lists.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Agent Content */}
                    <div className="p-6">
                      <button
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                          selectedAgent === agent._id
                            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() =>
                          setSelectedAgent(
                            selectedAgent === agent._id ? null : agent._id
                          )
                        }
                      >
                        {selectedAgent === agent._id ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hide Details
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            View Details
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {selectedAgent === agent._id && (
                        <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                          <div className="border-t border-gray-200 pt-4">
                            <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <UserCheck className="w-5 h-5 text-purple-500" />
                              Assigned Items
                            </h5>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {lists.map((list) => (
                                <div
                                  key={list._id}
                                  className="bg-gray-50/50 rounded-lg p-4 border border-gray-100"
                                >
                                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                                    <FileText className="w-4 h-4 text-purple-500" />
                                    <span className="font-medium text-gray-900">
                                      {list.fileName}
                                    </span>
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                      {list.items.length} items
                                    </span>
                                  </div>

                                  <div className="space-y-3">
                                    {list.items.map((item, index) => (
                                      <div
                                        key={index}
                                        className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm"
                                      >
                                        <div className="font-medium text-gray-900 mb-2">
                                          {item.firstName}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                          <Phone className="w-3 h-3" />
                                          <span>{item.phone}</span>
                                        </div>
                                        {item.notes && (
                                          <div className="text-sm text-gray-500 bg-gray-50 rounded px-2 py-1 mt-2">
                                            <strong>Notes:</strong> {item.notes}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributedLists;
