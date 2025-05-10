export type DamageLogEntry = {
  id: string;
  action: string;
  timestamp: string | Date;
  damageValue: number;
  participants: string[];
  comment?: string;
};

export type DamageLogProps = {
  logs?: DamageLogEntry[];
};