import { ProjectLogEntry } from "@/types/LogApi";

export type DamageLogEntry = {
  id: string;
  action: string;
  timestamp: string | Date;
  damageValue: number;
  participants: string[];
  comment?: string;
};

export type DamageLogProps = {
  logs?: ProjectLogEntry[];
};

// export type ProjectLogEntry = {
//   id: string
//   project_id: string
//   actor_type: "user" | "boss" | "system" | string
//   actor_id: string | null
//   event_type: string
//   payload: Record<string, unknown>
//   created_at: string
// }