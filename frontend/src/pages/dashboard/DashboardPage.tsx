import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowUpRight, FileText, FolderKanban, Server, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { MetricCard } from "../../components/workspace/MetricCard";
import { ProjectTable } from "../../components/workspace/ProjectTable";
import { SectionCard } from "../../components/workspace/SectionCard";
import { StatusBadge } from "../../components/workspace/StatusBadge";
import { getConfigStatus, listProjects } from "../../services/api";
import { useRuntimeSettings } from "../../app/runtime";

export function DashboardPage() {
  const { apiBaseUrl } = useRuntimeSettings();
  const projectsQuery = useQuery({
    queryKey: ["projects", apiBaseUrl],
    queryFn: () => listProjects(apiBaseUrl),
  });
  const configQuery = useQuery({
    queryKey: ["config-status", apiBaseUrl],
    queryFn: () => getConfigStatus(apiBaseUrl),
  });

  const projects = projectsQuery.data?.projects || [];
  const evaluatingCount = projects.filter((project) => project.status === "evaluating").length;
  const completedCount = projects.filter((project) => project.status === "completed").length;
  const reportCount = projects.filter((project) => project.latest_report_id).length;

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORKSPACE / OVERVIEW</span>
          <h2>运行概览</h2>
        </div>
        <Link className="button-ghost" to="/projects">机会项目 <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>

      <div className="metric-grid">
        <MetricCard label="机会项目" value={projects.length} helper="已创建项目总数" icon={FolderKanban} />
        <MetricCard label="评估中" value={evaluatingCount} helper="正在运行或等待结果" accent="amber" icon={Activity} />
        <MetricCard label="已完成" value={completedCount} helper="形成 Gate 决策" accent="ink" icon={ShieldCheck} />
        <MetricCard label="报告产物" value={reportCount} helper="可审阅报告与 PRD" accent="red" icon={FileText} />
      </div>

      <div className="dashboard-grid">
        <SectionCard
          title="最近机会"
          kicker="Project Ledger"
          action={<Link to="/projects">查看全部 <ArrowUpRight size={15} aria-hidden="true" /></Link>}
        >
          <ProjectTable projects={projects.slice(0, 5)} />
        </SectionCard>

        <SectionCard title="系统状态" kicker="Runtime" action={<Server size={18} aria-hidden="true" />}>
          <div className="status-list">
            <div>
              <span>LLM Provider</span>
              <StatusBadge value={configQuery.data?.llm_provider || "unknown"} tone="info" />
            </div>
            <div>
              <span>Search Provider</span>
              <StatusBadge value={configQuery.data?.search_provider || "unknown"} tone="neutral" />
            </div>
            <div>
              <span>Ark API</span>
              <StatusBadge value={configQuery.data?.ark.configured ? "configured" : "not_configured"} />
            </div>
            <div>
              <span>Evidence per dimension</span>
              <strong>{configQuery.data?.search.evidence_per_dimension ?? "-"}</strong>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
