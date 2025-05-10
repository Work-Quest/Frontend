import type { Tag } from "@/types/Tag";
import type { Boss } from "@/types/Boss"

// interface User {
//     id: string;
//     name: string;
//     username: string;
//     email: string;
//   }
export type UserScore = {
    order: number;
    name: string;
    username: string;
    score: number;
  };

export type UserProfile = {
    name: string;
    username: string;
    profileImg: string;
    tag: Tag[];
    bossCollection: Boss[];
};