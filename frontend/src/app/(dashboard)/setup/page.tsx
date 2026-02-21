import type { Metadata } from "next";
import SetupDashboard from "@/features/setup/components/setup-dashboard";

export const metadata: Metadata = {
  title: "Workspace Setup — PMT",
  description: "Configure your workspace environment to match your team's workflow.",
};

export default function SetupPage() {
  return <SetupDashboard />;
}
