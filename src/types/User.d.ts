import type { Tag } from "@/types/Tag";
import type { Boss } from "@/types/Boss"



export enum MemberStatus {
  Alive = "Alive",
  Dead = "Dead",
}

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

export type UserStatus = {
    id : string;
    name : string;
    username : string;
    hp : number;
    status : MemberStatus;
};