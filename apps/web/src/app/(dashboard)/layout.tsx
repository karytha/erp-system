import { DashboardGate } from "@/components/layout/DashboardGate";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return <DashboardGate>{children}</DashboardGate>;
}
