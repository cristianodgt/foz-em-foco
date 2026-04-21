export type UserRole = "super_admin" | "editor" | "reporter" | "estagiario";

export type AdSlotType =
  | "leaderboard"
  | "mpu"
  | "sticky"
  | "halfpage"
  | "infeed"
  | "newsletter"
  | "section"
  | "video";

export type BusinessPlan = "basico" | "prata" | "ouro";

export type EditoriaCor = {
  bg: string;
  text: string;
  label: string;
};

export const EDITORIAS: Record<string, EditoriaCor> = {
  cidade: { bg: "bg-blue-100", text: "text-blue-800", label: "Cidade" },
  politica: { bg: "bg-red-100", text: "text-red-800", label: "Política" },
  economia: { bg: "bg-green-100", text: "text-green-800", label: "Economia" },
  turismo: { bg: "bg-teal-light", text: "text-teal", label: "Turismo" },
  paraguai: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Paraguai" },
  cultura: { bg: "bg-purple-100", text: "text-purple-800", label: "Cultura" },
  esporte: { bg: "bg-orange-100", text: "text-orange-800", label: "Esporte" },
  itaipu: { bg: "bg-teal-light", text: "text-teal-dark", label: "Itaipu" },
};
