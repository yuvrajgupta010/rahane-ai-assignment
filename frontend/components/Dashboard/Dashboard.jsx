import { useAuthCTX } from "@/store/AuthCTX";
import React from "react";
import AdminDashboard from "./Admin";
import DashboardLayout from "./DashboardLayout";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const { userDetails } = useAuthCTX();

  if (!userDetails) return null;

  return (
    <DashboardLayout>
      {userDetails.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
