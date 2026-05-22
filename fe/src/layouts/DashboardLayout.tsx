import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Truck,
  Building2,
  UserCog,
  FileText,
  Globe,
  ScanLine,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { disconnectSocket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar-context";
import { BRAND_NAME } from "@/lib/brand";

const staffNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["OWNER", "ADMIN", "KASIR", "OPERATOR", "KURIR"] },
  { to: "/orders", label: "Order", icon: ShoppingBag, roles: ["OWNER", "ADMIN", "KASIR", "OPERATOR"] },
  { to: "/customers", label: "Pelanggan", icon: Users, roles: ["OWNER", "ADMIN", "KASIR"] },
  { to: "/scan", label: "Scan QR", icon: ScanLine, roles: ["OWNER", "ADMIN", "KASIR", "OPERATOR"] },
  { to: "/inventory", label: "Inventori", icon: Package, roles: ["OWNER", "ADMIN", "OPERATOR"] },
  { to: "/pickups", label: "Pickup/Delivery", icon: Truck, roles: ["OWNER", "ADMIN", "KASIR", "KURIR"] },
  { to: "/employees", label: "Karyawan", icon: UserCog, roles: ["OWNER", "ADMIN"] },
  { to: "/website", label: "Konten Website", icon: Globe, roles: ["OWNER"] },
  { to: "/branches", label: "Cabang", icon: Building2, roles: ["OWNER"] },
  { to: "/reports", label: "Laporan", icon: FileText, roles: ["OWNER", "ADMIN"] },
];

const customerNav = [
  { to: "/tracking", label: "Tracking Order", icon: ScanLine },
  { to: "/orders", label: "Riwayat Order", icon: ShoppingBag },
];

function SidebarNav({ items }: { items: typeof staffNav | typeof customerNav }) {
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive =
          item.to === "/dashboard"
            ? location.pathname === "/dashboard"
            : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

        return (
          <SidebarMenuItem key={item.to}>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.label}
              className="[&_svg]:size-5 group-data-[collapsible=icon]:!p-1"
              render={
                <NavLink
                  to={item.to}
                  end={item.to === "/dashboard"}
                  onClick={closeMobile}
                />
              }
            >
              <item.icon className="shrink-0" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function DashboardLayout() {
  const { user, logout, isStaff } = useAuthStore();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const nav = isStaff()
    ? staffNav.filter((n) => n.roles.includes(user!.role))
    : customerNav;

  const handleLogout = () => {
    disconnectSocket();
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={<Link to="/" />}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShoppingBag className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{BRAND_NAME}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.branch?.name ?? "Sistem Laundry"}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarNav items={nav} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Keluar"
                className="[&_svg]:size-5 border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:hover:bg-destructive/15"
              >
                <LogOut className="shrink-0" />
                <span>Keluar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between gap-2">
            <p className="text-sm font-medium md:hidden">{BRAND_NAME}</p>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
              <span className="hidden text-sm text-muted-foreground sm:inline">{user?.name}</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
