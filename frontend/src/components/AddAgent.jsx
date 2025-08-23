import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { agentAPI } from "../services/api";

const AddAgent = ({ onAgentAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await agentAPI.create({
        name: data.name,
        email: data.email,
        mobile: {
          countryCode: data.countryCode,
          number: data.mobileNumber,
        },
        password: data.password,
      });

      toast.success("Agent created successfully!");
      reset();
      if (onAgentAdded) onAgentAdded();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create agent";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Add New Agent</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
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
              placeholder="Enter agent name"
            />
            {errors.name && (
              <div className="error-message">{errors.name.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
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
              placeholder="Enter email address"
            />
            {errors.email && (
              <div className="error-message">{errors.email.message}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Mobile Number *</label>
          <div className="mobile-input">
            <input
              type="text"
              className="form-control country-code"
              {...register("countryCode", {
                required: "Country code is required",
              })}
              placeholder="+1"
            />
            <input
              type="tel"
              className="form-control"
              {...register("mobileNumber", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Invalid mobile number",
                },
              })}
              placeholder="Enter mobile number"
            />
          </div>
          {(errors.countryCode || errors.mobileNumber) && (
            <div className="error-message">
              {errors.countryCode?.message || errors.mobileNumber?.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
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
            placeholder="Enter password"
          />
          {errors.password && (
            <div className="error-message">{errors.password.message}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Creating Agent..." : "Create Agent"}
        </button>
      </form>
    </div>
  );
};

export default AddAgent;
