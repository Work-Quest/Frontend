import { ProjectLogEntry } from "@/types/LogApi";

export type DamageLogEntry = {
  id: string;
  action: string;
  timestamp: string | Date;
  damageValue: number;
  participants: string[];
  comment?: string;
};

export type DamageLogPayload = {
  task_id?: string;
  task?: { task_name?: string };
  actor?: { username?: string };
  target?: { username?: string };
  damage?: number;
};

export type DamageLogProps = {
  logs?: ProjectLogEntry[];
  currentUsername?: string | null;
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