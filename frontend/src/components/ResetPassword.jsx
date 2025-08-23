import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import { setToken, setUser } from "../utils/auth";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authAPI.resetPassword(token, {
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const { token: authToken, user } = response.data;
      setToken(authToken);
      setUser(user);

      toast.success("Password reset successfully!");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reset password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Reset Your Password</h2>

        <p
          style={{ marginBottom: "1.5rem", color: "#666", textAlign: "center" }}
        >
          Enter your new password below.
        </p>

        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            placeholder="Enter new password"
          />
          {errors.password && (
            <div className="error-message">{errors.password.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && (
            <div className="error-message">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="text-center mt-1">
          <div className="text-sm">
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
