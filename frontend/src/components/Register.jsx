import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import { setToken, setUser } from "../utils/auth";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
      const response = await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        sendWelcomeEmail: data.sendWelcomeEmail,
      });

      if (data.sendWelcomeEmail) {
        toast.success(
          "Account created! Check your email for login credentials."
        );
        navigate("/login");
      } else {
        const { token, user } = response.data;
        setToken(token);
        setUser(user);
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create Admin Account</h2>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <div className="error-message">{errors.name.message}</div>
          )}
        </div>

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

        <div className="form-group">
          <label htmlFor="password">Password</label>
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
            placeholder="Enter your password"
          />
          {errors.password && (
            <div className="error-message">{errors.password.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <div className="error-message">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="sendWelcomeEmail"
            {...register("sendWelcomeEmail")}
          />
          <label htmlFor="sendWelcomeEmail">
            Send welcome email with temporary password
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="text-center mt-1">
          <div className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
