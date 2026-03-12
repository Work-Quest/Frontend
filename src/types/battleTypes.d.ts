export interface User {
    uid: string;
    charId: string;
    status: 'idle' | 'walking_in' | 'attacking' | 'walking_out' | 'shifting_forward' | 'shifting_backward' | 'damage' | 'dead';
    slot: number;
    name: string;
    hp: number;
    maxHp: number;
}

export interface BossState {
    id: string;
    status: 'idle' | 'moving_in' | 'attacking' | 'moving_out' | 'damage' | 'dead' | 'hidden';
    hp: number;
    maxHp: number;
}

export type GameActionPayload =
    | { act: 'ATTACK'; userId: string }
    | { act: 'DIE'; userId: string }
    | { act: 'REVIVE'; userId: string }
    | { act: 'SUPPORT'; userId: string }
    | { act: 'BOSS_ULTIMATE' }
    | { act: 'BOSS_ATTACK_USER'; userId: string }
    | { act: 'BOSS_DIE' }
    | { act: 'BOSS_REVIVE' }
    | { act: 'SETUP_GAME'; users: User[]; boss: BossState };