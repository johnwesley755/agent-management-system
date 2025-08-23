import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { getUser, setUser } from '../utils/auth';

export const Profile = () => {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const user = getUser();

  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    formState: { errors: profileErrors },
    setValue
  } = useForm();

  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    formState: { errors: passwordErrors },
    watch,
    reset: resetPasswordForm
  } = useForm();

  const newPassword = watch('newPassword');

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const onSubmitProfile = async (data) => {
    setIsLoadingProfile(true);
    try {
      const response = await authAPI.updateProfile(data);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
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
        confirmPassword: data.confirmPassword
      });
      toast.success('Password changed successfully!');
      resetPasswordForm();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <div>
      {/* Profile Information */}
      <div className="profile-section">
        <h3>Profile Information</h3>
        <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                {...registerProfile('name', { 
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                placeholder="Enter your full name"
              />
              {profileErrors.name && <div className="error-message">{profileErrors.name.message}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                {...registerProfile('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Enter your email"
              />
              {profileErrors.email && <div className="error-message">{profileErrors.email.message}</div>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoadingProfile}
          >
            {isLoadingProfile ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="profile-section">
        <h3>Change Password</h3>
        <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              className="form-control"
              {...registerPassword('currentPassword', { 
                required: 'Current password is required'
              })}
              placeholder="Enter current password"
            />
            {passwordErrors.currentPassword && <div className="error-message">{passwordErrors.currentPassword.message}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                {...registerPassword('newPassword', { 
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                placeholder="Enter new password"
              />
              {passwordErrors.newPassword && <div className="error-message">{passwordErrors.newPassword.message}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                {...registerPassword('confirmPassword', { 
                  required: 'Confirm password is required',
                  validate: (value) => value === newPassword || 'Passwords do not match'
                })}
                placeholder="Confirm new password"
              />
              {passwordErrors.confirmPassword && <div className="error-message">{passwordErrors.confirmPassword.message}</div>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoadingPassword}
          >
            {isLoadingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};