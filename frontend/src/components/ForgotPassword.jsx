import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(data.email);
      setEmailSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset email";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Reset Password</h2>

        {emailSent ? (
          <div className="success-message">
            <h3>Check Your Email</h3>
            <p>
              We've sent a password reset link to your email address. Please
              check your inbox and follow the instructions to reset your
              password.
            </p>
            <p style={{ marginTop: "1rem" }}>
              Didn't receive the email? Check your spam folder or{" "}
              <button
                type="button"
                className="auth-link"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setEmailSent(false)}
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <>
            <p
              style={{
                marginBottom: "1.5rem",
                color: "#666",
                textAlign: "center",
              }}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="error-message">{errors.email.message}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-1">
          <div className="text-sm">
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </div>
          <div className="text-sm" style={{ marginTop: "0.5rem" }}>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
