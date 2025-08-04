"use client";

import React, { useEffect, useState } from "react";
import { AuthService } from "@/lib/services";
import { toast } from "sonner";
import { FiMail, FiUser, FiCheck } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";

interface Errors {
  username?: string;
  first_name?: string;
  last_name?: string;
  general?: string;
}

const UserUpdatePage = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const params = useParams(); // for dynamic route: /users/:id/edit
  const userId = params?.id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getUserById(userId as string);
        console.log(user)
        setFormData({
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
        });
      } catch (err) {
        toast.error("Failed to fetch user data.");
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(formData.username)) {
      newErrors.username =
        "Username must be 3–20 characters and only contain letters, numbers, underscores, dots, or dashes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await AuthService.updateUser(userId as string, formData);
      if (res) {
        toast.success("User updated successfully.");
        setSuccess(true);
        setTimeout(() => router.push("/users"), 1500);
      }
    } catch (error: any) {
      if (error?.response?.data) {
        const backendErrors = error.response.data;
        const formattedErrors: Errors = {};

        for (const key in backendErrors) {
          formattedErrors[key as keyof Errors] = backendErrors[key].join("\n");
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

  return (
    <div className="min-h-screen bg-gradient-to-bl from-indigo-50 via-sky-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4 text-center">
          Update User
        </h2>

        {success && (
          <div className="flex justify-center mb-4">
            <FiCheck className="text-green-500 text-3xl" />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="first_name" className="text-sm font-medium">
              First Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FiUser />
              </span>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.first_name ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
              />
            </div>
            {errors.first_name && (
              <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="last_name" className="text-sm font-medium">
              Last Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FiUser />
              </span>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.last_name ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
              />
            </div>
            {errors.last_name && (
              <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FiMail />
              </span>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">{errors.username}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {isLoading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdatePage;
