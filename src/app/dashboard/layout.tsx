import Sidebar from "@/components/Sidebar/Sidebar";
import AdminNavbar from "@/components/AdminNavbar/AdminNavbar";
import { SidebarProvider } from "@/components/Sidebar/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AdminNavbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
