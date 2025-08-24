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
  SearchX,
  Loader2,
} from "lucide-react";
import { listAPI } from "../services/api";

const DistributedLists = ({ searchQuery }) => {
  const [allLists, setAllLists] = useState([]); // Holds the original, unfiltered data
  const [filteredLists, setFilteredLists] = useState([]); // Holds the data to be displayed
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // 1. Fetches all lists once when the component mounts
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await listAPI.getAll();
        setAllLists(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch distributed lists");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLists();
  }, []);

  // 2. Filters the lists whenever the search query or the master list changes
  useEffect(() => {
    const lowercasedQuery = searchQuery ? searchQuery.toLowerCase() : "";

    if (!lowercasedQuery) {
      setFilteredLists(allLists); // If search is empty, show all lists
    } else {
      const filtered = allLists.filter((list) => {
        const agentName = list.agentId.name.toLowerCase();
        const agentEmail = list.agentId.email.toLowerCase();
        const fileName = list.fileName.toLowerCase();

        // Check agent, file, and also check items inside the list
        const hasMatchingItem = list.items.some(
          (item) =>
            item.firstName?.toLowerCase().includes(lowercasedQuery) ||
            item.phone?.includes(lowercasedQuery)
        );

        return (
          agentName.includes(lowercasedQuery) ||
          agentEmail.includes(lowercasedQuery) ||
          fileName.includes(lowercasedQuery) ||
          hasMatchingItem
        );
      });
      setFilteredLists(filtered);
    }
  }, [searchQuery, allLists]);

  // 3. Group the *filtered* lists by agent for rendering
  const groupedLists = filteredLists.reduce((acc, list) => {
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
      <div className="flex items-center justify-center min-h-64 p-6">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin h-12 w-12 text-purple-500 mx-auto" />
          <p className="text-gray-600 text-lg">Loading distributed lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
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

        {/* Conditional Rendering for search results */}
        {allLists.length > 0 && filteredLists.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0 p-12 text-center">
            <SearchX className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900">
              No Results Found
            </h3>
            <p className="text-gray-600 mt-2">
              Your search for "{searchQuery}" did not match any lists.
            </p>
          </div>
        ) : Object.keys(groupedLists).length === 0 ? (
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
                  Upload a CSV file to begin.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats (now reflects filtered data) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
                <p className="text-sm font-medium text-gray-600">
                  Agents Found
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {Object.keys(groupedLists).length}
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
                <p className="text-sm font-medium text-gray-600">Files Found</p>
                <p className="text-3xl font-bold text-purple-600">
                  {filteredLists.length}
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
                <p className="text-sm font-medium text-gray-600">Items Found</p>
                <p className="text-3xl font-bold text-purple-600">
                  {filteredLists.reduce(
                    (sum, list) => sum + list.items.length,
                    0
                  )}
                </p>
              </div>
            </div>

            {/* Agents Grid (renders the filtered and grouped data) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.values(groupedLists).map(({ agent, lists }) => {
                const totalItems = lists.reduce(
                  (sum, list) => sum + list.items.length,
                  0
                );
                return (
                  <div
                    key={agent._id}
                    className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0 overflow-hidden"
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
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
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
