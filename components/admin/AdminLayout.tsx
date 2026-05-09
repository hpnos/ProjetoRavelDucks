import { ReactNode } from "react";
import { AdminGuard } from "./AdminGuard";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2b00_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />

          <div className="flex min-w-0 flex-col gap-6">{children}</div>
        </div>
      </main>
    </AdminGuard>
  );
}
