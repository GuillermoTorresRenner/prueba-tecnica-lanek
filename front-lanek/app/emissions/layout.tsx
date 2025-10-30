"use client";
import React from "react";
import PrivateLayout from "../private-layout";
import Navbar from "../../components/Navbar";

export default function EmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Handler para logout
  const handleLogout = async () => {
    const { logout } = await import("../../api/api.auth");
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <PrivateLayout>{children}</PrivateLayout>
    </>
  );
}
