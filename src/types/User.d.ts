import type { Tag } from "@/types/Tag";
import type { Boss } from "@/types/Boss"

export type UserScore = {
    order: number;
    name: string;
    username: string;
    score: number;
  };

export type UserProfile = {
    name?: string;
    username?: string;
    profileImg?: string;
    backgroundColor?: string;
    avatarFallback?: string;
    tag?: Tag[];
    bossCollection?: Boss[];
};