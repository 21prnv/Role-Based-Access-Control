import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessage(response.data.message);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("You do not have permission to access the dashboard.");
      }
    };

    fetchDashboardData();
  }, [token]);

  if (error) {
    return (
      <div className="container mx-auto mt-10 p-4">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-xl">Welcome, {user?.username}!</p>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
