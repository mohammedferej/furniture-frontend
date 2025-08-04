'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import { AuthService } from '@/lib/services';
import styles from '@style/LoginPage.module.css';


const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
     try {
      const res = await AuthService.login(formData.username, formData.password);
      if (res?.user) {
        toast.success('Login successful!');
        window.location.href = '/dashboard';
      } else {
        toast.error('Invalid credentials or network issue');
      }
    } catch (error) {
      toast.error(`Network error: ${error}`);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400"><FaUser /></span>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`${styles.inputField} ${errors.username ? styles.errorBorder : ''}`}
                placeholder="Enter username"
              />
            </div>
            {errors.username && (
              <p className={styles.errorText}>{errors.username}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400"><FiLock /></span>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`${styles.inputField} ${errors.password ? styles.errorBorder : ''}`}
                placeholder="Enter password"
              />
            </div>
            {errors.password && (
              <p className={styles.errorText}>{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{errors.general}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.loginButton}
            >
              {isLoading ? (
                <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                    1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <>
                  Login
                  <FiLogIn className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
