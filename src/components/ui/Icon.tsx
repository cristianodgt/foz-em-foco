import { LucideProps, LucideIcon } from "lucide-react";

interface IconProps extends LucideProps {
  icon: LucideIcon;
}

export default function Icon({ icon: LucideComponent, size = 16, ...props }: IconProps) {
  return <LucideComponent size={size} {...props} />;
}
