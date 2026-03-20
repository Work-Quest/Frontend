import type { Tag } from "@/types/Tag";
import type { Boss } from "@/types/Boss";

export enum MemberStatus {
  Alive = "Alive",
  Dead = "Dead",
}

export type UserScore = {
  order: number;
  name: string;
  username: string;
  user_id?: string;  // Add user_id for profile navigation
  score: number;
  selected_character_id?: number;
  bg_color_id?: number;
};

export type UserProfile = {
  name?: string;
  username?: string;
  selectedCharacterId?: number;
  bgColorId?: number;
  backgroundColor?: string;
  avatarFallback?: string;
  tag?: Tag[];
  bossCollection?: Boss[];
};

export type UserStatus = {
  id: string;
  name: string;
  username: string;
  hp: number;
  status: MemberStatus;
};

export interface PartyMember {
  id: string;
  username: string;
  name: string;
  avatarId: number;
  avatarBgColorId: number;
  isLeader?: boolean;
}

export type BusinessUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  profile_img: string | null;
  selected_character_id: number;
  bg_color_id: number;
};