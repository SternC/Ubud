import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Register() {
  const formData = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  const handleChange = (e) => {
    formData[e.target.name] = e.target.value
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    alert("Registration Successful")
    console.log("Registration data:", formData)
  }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#FFFBDE" }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="text-center mb-6">
            <div
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-12 "
              style={{ backgroundColor: "#91C8E4" }}
            >
              
              <div className="w-30 h-30 bg-white rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-125">
                 <img src="/logo.png" alt="Ubud Logo" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 transition-colors duration-300 hover:text-blue-600 cursor-default">
              Welcome
            </h1>
            <p className="text-gray-600 transition-colors duration-300 hover:text-gray-800 cursor-default">
              Create your account
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-blue-600">
                Name
              </label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 hover:border-blue-300 hover:shadow-md transform focus:scale-105"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-blue-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 hover:border-blue-300 hover:shadow-md transform focus:scale-105"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-blue-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 hover:border-blue-300 hover:shadow-md transform focus:scale-105"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-blue-600">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 hover:border-blue-300 hover:shadow-md transform focus:scale-105"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 font-semibold"
              style={{ background: `linear-gradient(135deg, #91C8E4 0%, #4A90E2 100%)` }}
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline transition-all duration-200 hover:text-blue-800 hover:scale-105 inline-block"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
