import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  helper?: string;
  accent?: "teal" | "amber" | "red" | "ink";
  icon?: LucideIcon;
  compactValue?: boolean;
}

export function MetricCard({ label, value, helper, accent = "teal", icon: Icon, compactValue = false }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${accent}${compactValue ? " metric-card--compact" : ""}`}>
      <span>{Icon ? <Icon size={17} strokeWidth={1.8} aria-hidden="true" /> : null}{label}</span>
      <strong>{value}</strong>
      {helper ? <small>{helper}</small> : null}
    </article>
  );
}

