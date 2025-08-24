import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import { getUser, setUser, logout } from "../utils/auth"; // UPDATED: import logout
import { User, Lock, Mail, Eye, EyeOff, AlertTriangle } from "lucide-react"; // UPDATED: import AlertTriangle

export const Profile = () => {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // NEW: State for deletion
  const user = getUser();

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue,
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPasswordForm,
  } = useForm();

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  const onSubmitProfile = async (data) => {
    setIsLoadingProfile(true);
    try {
      const response = await authAPI.updateProfile(data);
      setUser(response.data.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setIsLoadingPassword(true);
    try {
      await authAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password changed successfully!");
      resetPasswordForm();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to change password";
      toast.error(message);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  // NEW: Function to handle account deletion
  const handleDeleteProfile = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account?\n\nThis action is irreversible and will permanently delete your profile, all agents you have created, and all distributed lists."
    );

    if (isConfirmed) {
      setIsDeleting(true);
      try {
        await authAPI.deleteProfile();
        toast.success("Account deleted successfully.");
        logout(); // Log out and redirect the user
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Failed to delete account. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your account information and security settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border-0">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg p-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Profile Information</h3>
              </div>
              <p className="text-purple-100 mt-2">
                Update your personal details and contact information
              </p>
            </div>
            <div className="p-6">
              <form
                onSubmit={handleSubmitProfile(onSubmitProfile)}
                className="space-y-6"
              >
                {/* ... Name and Email fields ... */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      {...registerProfile("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {profileErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      {...registerProfile("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="Enter your email"
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {profileErrors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg shadow-lg transition-colors disabled:opacity-50"
                  disabled={isLoadingProfile}
                >
                  {isLoadingProfile ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border-0">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg p-6">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Change Password</h3>
              </div>
              <p className="text-purple-100 mt-2">
                Update your password to keep your account secure
              </p>
            </div>
            <div className="p-6">
              <form
                onSubmit={handleSubmitPassword(onSubmitPassword)}
                className="space-y-6"
              >
                {/* ... Current, New, and Confirm Password fields ... */}
                <div className="space-y-2">
                  <label
                    htmlFor="currentPassword"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      className="w-full pl-10 pr-10 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      {...registerPassword("currentPassword", {
                        required: "Current password is required",
                      })}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      className="w-full pl-10 pr-10 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      {...registerPassword("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="w-full pl-10 pr-10 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      {...registerPassword("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) =>
                          value === newPassword || "Passwords do not match",
                      })}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg shadow-lg transition-colors disabled:opacity-50"
                  disabled={isLoadingPassword}
                >
                  {isLoadingPassword ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- NEW DANGER ZONE SECTION --- */}
        <div className="bg-red-50/70 backdrop-blur-sm rounded-lg shadow-lg border border-red-200">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-xl font-semibold">Danger Zone</h3>
            </div>
            <p className="text-red-100 mt-2">
              These actions are permanent and cannot be undone.
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">
                  Delete Your Account
                </h4>
                <p className="text-sm text-gray-600 mt-1 max-w-md">
                  Once you delete your account, you will lose access
                  permanently, and all your created agents and distributed lists
                  will be deleted.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
