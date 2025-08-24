import React, { useState } from "react";
import { logout, getUser } from "../utils/auth";
import AddAgent from "./AddAgent";
import AgentList from "./AgentList";
import UploadCSV from "./UploadCSV";
import DistributedLists from "./DistributedLists";
import { Profile } from "./Profile";
import {
  Users,
  UserPlus,
  Upload,
  List,
  User,
  LogOut,
  Settings,
  Search,
  Menu,
  X,
  Database,
} from "lucide-react";
import { authAPI } from "@/services/api";
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("agents");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const user = getUser();

  const handleLogout = async () => {
    try {
      await authAPI.logout(); // Call the backend logout endpoint
    } catch (error) {
      // Log error but still proceed with client-side logout
      console.error("Server logout failed:", error);
    } finally {
      logout(); // This function from utils/auth will clear local storage and redirect
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Add your search functionality here
    console.log("Searching for:", searchQuery);
    // You can implement search logic based on activeTab
    if (searchQuery.trim()) {
      // Example: You could dispatch a search action or filter data
      // searchAPI.search(searchQuery, activeTab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "agents":
        return <AgentList searchQuery={searchQuery} />;
      case "add-agent":
        return <AddAgent onAgentAdded={() => setActiveTab("agents")} />;
      case "upload":
        return <UploadCSV onUploadComplete={() => setActiveTab("lists")} />;
      case "lists":
        return <DistributedLists searchQuery={searchQuery} />;
      case "profile":
        return <Profile />;
      default:
        return <AgentList searchQuery={searchQuery} />;
    }
  };

  const tabItems = [
    { id: "agents", label: "Agents", icon: Users },
    { id: "add-agent", label: "Add Agent", icon: UserPlus },
    { id: "upload", label: "Upload CSV", icon: Upload },
    { id: "lists", label: "Distributed Lists", icon: List },
    { id: "profile", label: "Profile", icon: User },
  ];

  const getActiveTabLabel = () => {
    const activeTabItem = tabItems.find((tab) => tab.id === activeTab);
    return activeTabItem ? activeTabItem.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>

              {/* Logo and Title */}
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                    Agent Management System
                  </h1>
                  {user && (
                    <p className="text-xs sm:text-sm text-purple-600 hidden sm:block truncate">
                      Welcome, {user.name || user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Search Bar */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(e);
                      }
                    }}
                    className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all ${
                      isSearchFocused
                        ? "border-purple-300 ring-purple-500 bg-white"
                        : "border-purple-200 bg-purple-50/50"
                    }`}
                  />
                </div>
              </div>

              {/* Mobile Search Button */}
              <button className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="hidden sm:block text-xs sm:text-sm font-medium text-gray-700 max-w-24 lg:max-w-none truncate">
                  {user?.name || user?.email || "Admin"}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
              className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-purple-50/50"
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 sm:w-72 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Navigation
                </h2>
              </div>
              <nav className="space-y-2">
                {tabItems.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105"
                          : "text-gray-600 hover:text-gray-900 hover:bg-purple-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 xl:w-72 bg-white/70 backdrop-blur-sm border-r border-purple-200 min-h-screen shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Main Menu
              </h3>
            </div>
            <nav className="space-y-2">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50 hover:shadow-md"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        activeTab === tab.id ? "text-white" : "text-purple-500"
                      }`}
                    />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

     
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          {/* Content Header - Mobile */}
          <div className="lg:hidden bg-white/70 backdrop-blur-sm border-b border-purple-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              {(() => {
                const activeTabItem = tabItems.find(
                  (tab) => tab.id === activeTab
                );
                const Icon = activeTabItem ? activeTabItem.icon : Users;
                return (
                  <>
                    <Icon className="w-5 h-5 text-purple-500" />
                    <span>{getActiveTabLabel()}</span>
                  </>
                );
              })()}
            </h2>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200 min-h-96 overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-200 px-2 sm:px-4 py-2 z-30 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          {tabItems.slice(0, 4).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 py-2 px-2 sm:px-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-purple-600 bg-purple-50 transform scale-105"
                    : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs font-medium truncate max-w-16">
                  {tab.label}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center space-y-1 py-2 px-2 sm:px-3 rounded-lg transition-all duration-200 ${
              activeTab === "profile"
                ? "text-purple-600 bg-purple-50 transform scale-105"
                : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
            }`}
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Padding for mobile bottom navigation */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default Dashboard;
