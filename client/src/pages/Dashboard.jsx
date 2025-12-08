import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const getUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch user data');
    }
  };

  return (
    // <div className="min-h-screen bg-gray-100 p-8">
    //   <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
    //     <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to your Dashboard</h1>
    //     <p className="text-gray-600 mb-6">This is a protected area. Only logged-in users can see this.</p>
    //     <button
    //       onClick={getUserData}
    //       className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    //     >
    //       Get User Info
    //     </button>
    //     {user && (
    //       <div className="mt-6 p-4 bg-gray-50 rounded-md">
    //         <h2 className="text-xl font-semibold text-gray-700">User Information</h2>
    //         <p className="mt-2 text-gray-600"><strong>Username:</strong> {user.username}</p>
    //         <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
    //       </div>
    //     )}
    //     {error && <p className="mt-4 text-red-500">{error}</p>}
    //   </div>
    // </div>

    <div className="flex flex-1">
      <div
        className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-[#A0AEC0] p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        
       
      </div>
    </div>
  );
};

export default Dashboard;
