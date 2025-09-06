import { AppSidebar } from "@/components/AppSidebar";
import { MobileNavbar } from "@/components/MobileNavbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <>
        <AppSidebar />
        <SidebarInset className="p-6 overflow-auto pb-20 md:pb-6">
          {children}
        </SidebarInset>
        <MobileNavbar />
      </>
    </SidebarProvider>
  );
}