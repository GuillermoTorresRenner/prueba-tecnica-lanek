import React from "react";
import PublicLayout from "../public-layout";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
