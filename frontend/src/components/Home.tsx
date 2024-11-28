import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
      <p className="text-xl">Hello, {user?.username}!</p>
      <p>This page is accessible to all authenticated users.</p>
      <p>Your role is: {user?.role}</p>
    </div>
  );
};

export default Home;
