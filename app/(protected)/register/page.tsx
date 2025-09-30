"use client";

import { AuthService } from "@/lib/AuthService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiArrowRight, FiCheck, FiLock, FiMail, FiUser } from "react-icons/fi";
import { toast } from "sonner"; // ✅ Using ShadCN toast

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  interface Errors {
    username?: string;
    password?: string;
    password2?: string;
    first_name?: string;
    last_name?: string;
    general?: string;
  }
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof Errors]) {
      setErrors((prev: Errors) => ({ ...prev, [name as keyof Errors]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.username.trim()) {
      newErrors.username = "Usernamse is required";
    }
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(formData.username)) {
      newErrors.username =
        "Username must be 3–20 characters and can only contain letters, numbers, underscores, dots, or dashes";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.password2) {
      newErrors.password2 = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await AuthService.register(formData);
      console.log(res);
      if (res) {
        setFormData({
          username: "",
          password: "",
          password2: "",
          first_name: "",
          last_name: "",
        });

        toast.success("Registration successful! .");
        setSuccess(true);
        router.push("/users");
      }
    } catch (error: any) {
      if (error?.response?.data) {
        const backendErrors = error.response.data;
        const formattedErrors: Errors = {};

        for (const key in backendErrors) {
          if (Array.isArray(backendErrors[key])) {
            formattedErrors[key as keyof Errors] =
              backendErrors[key].join("\n");
          } else {
            formattedErrors[key as keyof Errors] = backendErrors[key];
          }
        }

        setErrors(formattedErrors);

        Object.entries(formattedErrors).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-indigo-50 via-sky-100 to-blue-200">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <FiCheck className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">
            Registration Successful
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-gradient-to-bl from-indigo-50 via-sky-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-neutral-800">Register</h2>
        </div>
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className=" mb-4 w-full flex gap-3">
            <div className=" w-full">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <FiUser />
                </span>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full border ${
                    errors.first_name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  // placeholder="name"
                />
              </div>
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
              )}
            </div>

            <div className=" w-full">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <FiUser />
                </span>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full border ${
                    errors.last_name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  //placeholder=""
                />
              </div>
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>
          <div className=" mb-4 w-full">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FiMail />
              </span>
              <input
                id="username"
                name="username"
                type="username"
                value={formData.username}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="you@example.com"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>
          <div className=" mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FiLock />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="At least 8 characters"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className=" mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FiLock />
              </span>
              <input
                id="password2"
                name="password2"
                type="password"
                value={formData.password2}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.password2 ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Confirm your password"
              />
            </div>
            {errors.password2 && (
              <p className="mt-1 text-sm text-red-600">{errors.password2}</p>
            )}
          </div>

          <div className=" w-full relative">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white
               font-medium py-2.5 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all 
                flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
        <div className=" mt-6 text-center text-gray-700">
          <p className="text-sm">
            Already have an account?{" "}
            <span className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              <Link href="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
