import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth";
import { AdminPanel } from "@/components/admin-panel";

// The dashboard must never turn up in a search result.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function HqPage() {
  return (
    <AuthProvider>
      <AdminPanel />
    </AuthProvider>
  );
}
