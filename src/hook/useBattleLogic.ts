import { useMemo, useRef, useState, useEffect } from 'react';
import { ENTITY_CONFIG } from '@/config/battleConfig';
import { User, BossState, GameActionPayload } from '@/types/battleTypes';
import type { UserStatus } from "@/types/User"

type ProjectMemberLike = UserStatus

export const useBattleLogic = (initial: number | ProjectMemberLike[] = 5) => {
    const [hasInitialized, setHasInitialized] = useState(false);
    
    const initialCount = useMemo(() => (typeof initial === "number" ? initial : initial.length), [initial])
    const initialMembers = useMemo(() => (typeof initial === "number" ? null : initial), [initial])

    const [numUsers, setNumUsers] = useState(initialCount);
    const [boss, setBoss] = useState<BossState>({ id: 'b01', status: 'idle', hp: 5000, maxHp: 5000 });
    const [users, setUsers] = useState<User[]>([]);
    const [isSequenceRunning, setIsSequenceRunning] = useState(false);
    // Use a ref so "sequence running" flips synchronously inside async handlers.
    // This prevents back-to-back calls from slipping through before React state updates.
    const sequenceRunningRef = useRef(false);

    useEffect(() => {
        if (hasInitialized) return

        // New behavior: if a project-member list is provided, initialize users from that.
        if (initialMembers) {
            setNumUsers(initialMembers.length)
            setUsers(
                initialMembers.map((m, i) => {
                    const backendStatus = String(m.status || "")
                    const isDead = backendStatus.toLowerCase() === "dead"

                    const hp = Number.isFinite(m.hp) ? m.hp : 0
                    const maxHp = Math.max(hp, 100)

                    return {
                        uid: String(m.id),
                        charId: "c01",
                        status: isDead ? "dead" : "idle",
                        slot: i,
                        name: m.name || m.username || `Hero ${i + 1}`,
                        hp,
                        maxHp,
                    } satisfies User
                })
            )
            return
        }

        // Back-compat for BattlePlayground: still allow number-based dummy users.
        setNumUsers(initialCount)
        setUsers(
            Array.from({ length: initialCount }, (_, i) => ({
                uid: String(i + 1),
                charId: "c01",
                status: "idle",
                slot: i,
                name: `Hero ${i + 1}`,
                hp: 100,
                maxHp: 100,
            }))
        )
    }, [initialCount, initialMembers, hasInitialized]);

    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleGameAction = async (payload: GameActionPayload) => {
        if (sequenceRunningRef.current) return;

        const setSequenceRunning = (v: boolean) => {
            sequenceRunningRef.current = v;
            setIsSequenceRunning(v);
        };

        if (payload.act === 'SETUP_GAME') {
            setHasInitialized(true); // Stop the useEffect from overwriting this
            setUsers(payload.users);
            setBoss(payload.boss);
            setNumUsers(payload.users.length); // Sync the counter
            return;
        }

        if (payload.act === 'BOSS_DIE') {
            if (boss.status === 'dead' || boss.status === 'hidden') return;
            const bossConfig = ENTITY_CONFIG.bosses[boss.id as keyof typeof ENTITY_CONFIG.bosses];
            
            setBoss(prev => ({ ...prev, status: 'dead', hp: 0 }));
            await wait(bossConfig.actions.dead.duration || 1500);

            setBoss(prev => ({ ...prev, status: 'hidden' }));
            return;
        }

        if (payload.act === 'BOSS_REVIVE') {
            setBoss(prev => ({ ...prev, status: 'idle', hp: prev.maxHp }));
            return;
        }

        if (payload.act === 'BOSS_ATTACK_USER') {
            if (boss.status === 'dead' || boss.status === 'hidden') return;
            setSequenceRunning(true);
            const bossConfig = ENTITY_CONFIG.bosses[boss.id as keyof typeof ENTITY_CONFIG.bosses]?.actions.attack;
            
            setBoss(prev => ({ ...prev, status: 'moving_in' }));
            await wait(1000);

            setBoss(prev => ({ ...prev, status: 'attacking' }));
            setTimeout(() => {
                setUsers(prev => prev.map(u => {
                    if (u.uid === payload.userId && u.status !== 'dead') return { ...u, status: 'damage' };
                    return u;
                }));
            }, 800);

            await wait(bossConfig?.duration || 1500);
            setBoss(prev => ({ ...prev, status: 'moving_out' }));
            setUsers(prev => prev.map(u => u.status === 'dead' ? u : { ...u, status: 'idle' }));
            await wait(1000);

            setBoss(prev => ({ ...prev, status: 'idle' }));
            setSequenceRunning(false);
            return;
        }

        if (payload.act === 'BOSS_ULTIMATE') {
            if (boss.status === 'dead' || boss.status === 'hidden') return;
            setSequenceRunning(true);
            const bossConfig = ENTITY_CONFIG.bosses[boss.id as keyof typeof ENTITY_CONFIG.bosses]?.actions.attack;

            setBoss(prev => ({ ...prev, status: 'moving_in' }));
            await wait(1000);

            setBoss(prev => ({ ...prev, status: 'attacking' }));
            setTimeout(() => {
                setUsers(prev => prev.map(u => {
                    if (u.slot < 4 && u.slot >= 0 && u.status !== 'dead') return { ...u, status: 'damage' };
                    return u;
                }));
            }, 800);

            await wait(bossConfig?.duration || 1500);
            setBoss(prev => ({ ...prev, status: 'moving_out' }));
            setUsers(prev => prev.map(u => u.status === 'dead' ? u : { ...u, status: 'idle' }));
            await wait(1000);

            setBoss(prev => ({ ...prev, status: 'idle' }));
            setSequenceRunning(false);
            return;
        }

        const userIndex = users.findIndex(u => u.uid === payload.userId);
        if (userIndex === -1) return;
        const targetUser = users[userIndex];
        const userConfig = ENTITY_CONFIG.characters[targetUser.charId as keyof typeof ENTITY_CONFIG.characters] || ENTITY_CONFIG.characters['c01'];

        if (payload.act === 'ATTACK') {
            if (targetUser.status === 'dead' || boss.status === 'hidden') return;
            setSequenceRunning(true);
            const attackerOldSlot = targetUser.slot;

            const setStatus = (idx: number, s: User['status']) => {
                setUsers(prev => { const c = [...prev]; if(c[idx]) c[idx].status = s; return c; });
            };

            setStatus(userIndex, 'walking_in');
            await wait(1000);
            setStatus(userIndex, 'attacking');

            setTimeout(() => {
                if (boss.status !== 'dead' && boss.status !== 'hidden') {
                    setBoss(prev => ({ ...prev, status: 'damage' }));
                    setTimeout(() => { setBoss(prev => ({ ...prev, status: 'idle' })); }, 600);
                }
            }, userConfig.actions.attack.damageDelay || 500);

            await wait(userConfig.actions.attack.duration || 800);

            setUsers(prev => prev.map(u => {
                if (u.status === 'dead') return u;
                if (u.uid === payload.userId) return { ...u, status: 'walking_out', slot: 0 };
                if (u.slot < attackerOldSlot) return { ...u, status: 'shifting_backward', slot: u.slot + 1 };
                return { ...u, status: 'idle' };
            }));

            await wait(1000);
            setUsers(prev => prev.map(u => u.status === 'dead' ? u : { ...u, status: 'idle' }));
            setSequenceRunning(false);

        } else if (payload.act === 'DIE') {
            const deadSlot = targetUser.slot;
            setUsers(prev => prev.map(u => {
                if (u.uid === payload.userId) return { ...u, status: 'dead' };
                return u;
            }));
            await wait(userConfig.actions.dead.duration || 1000);
            setUsers(prev => prev.map(u => {
                if (u.uid === payload.userId) return { ...u, slot: -1 }; 
                if (u.slot > deadSlot) return { ...u, status: 'shifting_forward', slot: u.slot - 1 };
                return u;
            }));
            await wait(1000);
            setUsers(prev => prev.map(u => (u.status === 'shifting_forward') ? { ...u, status: 'idle' } : u));

        } else if (payload.act === 'REVIVE') {
            setUsers(prev => prev.map(u => {
                if (u.uid === payload.userId) return { ...u, status: 'idle', slot: 0 };
                if (u.status !== 'dead' && u.slot >= 0) return { ...u, status: 'shifting_backward', slot: u.slot + 1 };
                return u;
            }));
            await wait(1000);
            setUsers(prev => prev.map(u => (u.status === 'shifting_backward') ? { ...u, status: 'idle' } : u));
        } else if (payload.act === 'SUPPORT') {
            // Placeholder: reuse die animation until a dedicated support animation exists.
            // TODO: replace SUPPORT placeholder with real support animation (e.g., buff glow / item pop).
            if (targetUser.status === 'dead') return;
            setSequenceRunning(true);
            setUsers(prev => prev.map(u => {
                if (u.uid === payload.userId) return { ...u, status: 'dead' };
                return u;
            }));
            await wait(userConfig.actions.dead.duration || 1000);
            setUsers(prev => prev.map(u => {
                if (u.uid === payload.userId) return { ...u, status: 'idle' };
                return u;
            }));
            setSequenceRunning(false);
        }
    };

    const updateUserName = (index: number, name: string) => {
        setUsers(prev => { const c = [...prev]; if (c[index]) c[index].name = name; return c; });
    };

    const updateUserCharId = (index: number, charId: string) => {
        setUsers(prev => { const c = [...prev]; if (c[index]) c[index].charId = charId; return c; });
    };

    const updateBossId = (id: string) => {
        setBoss(prev => ({ ...prev, id }));
    };

    return { 
        users, boss, numUsers, isSequenceRunning, 
        setNumUsers, setBoss, updateUserName, updateUserCharId, updateBossId, 
        handleGameAction 
    };
};