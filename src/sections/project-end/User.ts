export type UserScore = {
    order: number;
    name: string;
    username: string;
    user_id?: string;
    score: number;
    damageDeal: number;
    damageReceive: number;
    status: string;
    isMVP: boolean;
    selected_character_id?: number;
    bg_color_id?: number;
  };