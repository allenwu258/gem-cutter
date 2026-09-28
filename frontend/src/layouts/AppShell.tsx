import { useQuery } from "@tanstack/react-query";
import { Activity, ChevronRight, FileText, FolderKanban, LayoutDashboard, Settings2 } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { navigationItems } from "../constants/navigation";
import { getConfigStatus } from "../services/api";
import { useRuntimeSettings } from "../app/runtime";
import { StatusBadge } from "../components/workspace/StatusBadge";

export function AppShell() {
  const { apiBaseUrl } = useRuntimeSettings();
  const { pathname } = useLocation();
  const configQuery = useQuery({
    queryKey: ["config-status", apiBaseUrl],
    queryFn: () => getConfigStatus(apiBaseUrl),
  });

  const currentPage = navigationItems.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
  const navIcons = [LayoutDashboard, FolderKanban, Activity, FileText, Settings2];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand-mark" to="/dashboard" aria-label="Gem Cutter 首页">
          <img src="/gem-cutter-icon.svg" alt="" />
          <strong>Gem Cutter</strong>
        </NavLink>

        <div className="nav-caption">工作空间</div>
        <nav className="nav-list" aria-label="主导航">
          {navigationItems.map((item, index) => {
            const Icon = navIcons[index];
            return (
              <NavLink className="nav-item" to={item.path} key={item.path}>
                <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                <span>{item.label}</span>
                <ChevronRight className="nav-chevron" size={15} aria-hidden="true" />
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <span className={configQuery.data ? "status-dot is-online" : "status-dot"} />
          <span>{configQuery.isError ? "服务未连接" : "本地工作空间"}</span>
          <small>v0.1.0</small>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>工作空间</span>
            <ChevronRight size={14} aria-hidden="true" />
            <strong>{currentPage?.label || "机会项目"}</strong>
          </div>
          <div className="topbar__status">
            <span className="topbar__url" title={apiBaseUrl}>{apiBaseUrl}</span>
            <StatusBadge
              value={configQuery.isError ? "服务离线" : configQuery.data ? "服务在线" : "连接中"}
              tone={configQuery.isError ? "danger" : configQuery.data ? "success" : "neutral"}
            />
          </div>
        </header>

        <main className="page-frame">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>Gem Cutter</span>
          <span>证据驱动的机会评估</span>
        </footer>
      </div>
    </div>
  );
}

