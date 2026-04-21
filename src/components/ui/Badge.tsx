import { EDITORIAS } from "@/types";

interface BadgeProps {
  category?: string;
  label?: string;
  className?: string;
}

export default function Badge({ category, label, className = "" }: BadgeProps) {
  const editoria = category ? EDITORIAS[category.toLowerCase()] : null;

  const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide";

  if (editoria) {
    return (
      <span className={`${base} ${editoria.bg} ${editoria.text} ${className}`}>
        {label ?? editoria.label}
      </span>
    );
  }

  return (
    <span className={`${base} bg-teal-light text-teal ${className}`}>
      {label ?? category}
    </span>
  );
}
