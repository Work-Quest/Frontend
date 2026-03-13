import React, { useEffect, useState, useMemo } from 'react';
import { SpriteEntity } from '@/components/battle/SpriteEntity';
import { POSITIONS, ENTITY_CONFIG } from '@/config/battleConfig';
import { User, BossState } from '@/types/battleTypes';
import EnemyHealthDisplay from '@/components/ui/8bit/enemy-health-display';
import { Backpack } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "@/components/ui/8bit/item";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useGame } from '@/hook/useGame';
import { getItemColorCategory } from '@/lib/utils';
import type { ProjectMemberItemsResponse, StatusEffectEntry } from '@/types/GameApi';
import toast from 'react-hot-toast';

interface BattleSceneProps {
    users: User[];
    boss: BossState;
    projectId: string | null;
    myProjectMemberId: string | null;
}

type GroupedItem = {
    name: string;
    description: string;
    count: number;
    colorCategory: 'blue' | 'green' | 'red' | 'gray';
    userItemIds: string[];
}

const getUserPosition = (slot: number, status: string) => {
    if (slot === -1) return POSITIONS.graveyard;
    if (status === 'damage' && slot > 3) return POSITIONS.queue_peek;
    if (status === 'walking_in' || status === 'attacking') return POSITIONS.center;
    if (status === 'walking_out') return POSITIONS.p1;
    if (slot === 0) return POSITIONS.p1;
    if (slot === 1) return POSITIONS.p2;
    if (slot === 2) return POSITIONS.p3;
    if (slot === 3) return POSITIONS.p4;
    return POSITIONS.offscreen_queue;
};

const getBossPosition = (status: string, bossId: string) => {
    const bossConfig = (ENTITY_CONFIG.bosses as any)[bossId];
    
    const basePosition = bossConfig?.position || POSITIONS.boss_spot_default;

    if (status === 'hidden') {
        return { ...basePosition, opacity: 0 };
    }
    
    if (status === 'moving_in' || status === 'attacking') {
        return POSITIONS.center;
    }

    return { ...basePosition, opacity: 1 };
};


const EffectIconPlaceholder: React.FC<{
    effect: StatusEffectEntry;
    stackCount?: number;
}> = ({ effect, stackCount = 1 }) => {
    const isBuff = effect.effect_polarity === 'GOOD';
    let bgColor
    let borderColor
    if (isBuff) {
        if (effect.effect_value == 10) {
            bgColor = 'bg-lime-500/80'
            borderColor = 'border-lime-500'
        } else if (effect.effect_value == 20) {
            bgColor = 'bg-cyan-500/80'
            borderColor = 'border-green-500'
        } else
            bgColor = 'bg-purple-500/80'
            borderColor = 'border-emerald-500'
    }
    else  {
        if (effect.effect_value == 10.0) {
            bgColor = 'bg-pink-500/80'
            borderColor = 'border-pink-400'
        } else if (effect.effect_value == 20.0) {
            bgColor = 'bg-rose-500/80'
            borderColor = 'border-rose-400'
        } else
            bgColor = 'bg-red-500/80'
            borderColor = 'border-red-400'
    }


    // Abbreviate effect type for display (e.g., "DAMAGE_BUFF" -> "DB")
    const getIcon = (effectType: string): string => {
        // Map effect types to their icon image paths
        const effectIconMap: Record<string, string> = {
            'DAMAGE_BUFF': '/effectIcon/damage_buff.png',
            'DAMAGE_DEBUFF': '/effectIcon/damage_debuff.png',
            'DEFENCE_BUFF': '/effectIcon/defense_buff.png',
            'DEFENCE_DEBUFF': '/effectIcon/defense_debuff.png'
        };

        // Return the mapped path, or a default placeholder if not found
        return effectIconMap[effectType] || '/effectIcon/default.png';
    };

    return (
        <div
            className={`${bgColor} ${borderColor} border-2 rounded w-4 h-4 flex items-center justify-center text-white text-[10px] font-bold shadow-lg cursor-help relative group`}
            title={`${effect.effect_type}\n${effect.effect_description}\nValue: ${effect.effect_value}${stackCount > 1 ? `\nStacks: ${stackCount}` : ''}`}
        >
            <img
                src={getIcon(effect.effect_type)}
                alt={effect.effect_type}
                className="w-full h-full object-contain"
                onError={(e) => {
                    // Fallback to placeholder if image doesn't exist
                    (e.target as HTMLImageElement).src = '/effectIcon/default.png';
                }}
            />
            {/* Stack count badge */}
            {stackCount > 1 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold border border-white shadow-md z-10">
                    {stackCount}
                </div>
            )}
            {/* Tooltip on hover */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[60] bg-slate-800 border border-gray-600 rounded px-1 py-1  text-white whitespace-pre-line text-center min-w-[100px]">
                <div className="text-gray-300 text-[5px] mt-1">{effect.effect_description}</div>
                <div className="text-yellow-400 text-[5px]  mt-1">Value: {effect.effect_value}</div>
                {stackCount > 1 && (
                    <div className="text-orange-400 text-[5px] mt-1">Stacks: {stackCount}</div>
                )}
            </div>
        </div>
    );
};

export const BattleScene: React.FC<BattleSceneProps> = ({ users, boss, projectId, myProjectMemberId }) => {
    const bossName = (ENTITY_CONFIG.bosses as any)[boss.id]?.name || "GREAT BOSS";
    const { getMyItems, useMyItem, getMyStatusEffects } = useGame(projectId ?? undefined);
    const [items, setItems] = useState<ProjectMemberItemsResponse | null>(null);
    const [loadingItems, setLoadingItems] = useState(false);
    const [usingItemId, setUsingItemId] = useState<string | null>(null);
    const [statusEffects, setStatusEffects] = useState<StatusEffectEntry[]>([]);

    // Fetch items when projectId or myProjectMemberId changes
    const refreshItems = React.useCallback(async (opts?: { silent?: boolean }) => {
        if (!projectId || !myProjectMemberId) {
            setItems(null);
            return;
        }

        try {
            if (!opts?.silent) {
                setLoadingItems(true);
            }
            const data = await getMyItems(projectId);
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
            if (!opts?.silent) {
                toast.error('Failed to load items');
            }
        } finally {
            if (!opts?.silent) {
                setLoadingItems(false);
            }
        }
    }, [projectId, myProjectMemberId, getMyItems]);

    useEffect(() => {
        refreshItems();
    }, [refreshItems]);

    // Long-poll loop for items: request -> wait -> request (no overlap).
    useEffect(() => {
        if (!projectId || !myProjectMemberId) return

        const pollIntervalMs = 5000
        const enabled = true

        if (!enabled) return
        if (!pollIntervalMs || pollIntervalMs <= 0) return

        let cancelled = false
        let timer: number | null = null

        const sleep = (ms: number) =>
            new Promise<void>((resolve) => {
                timer = window.setTimeout(() => resolve(), ms)
            })

        const loop = async () => {
            // Start after initial load; keep refreshing silently.
            while (!cancelled) {
                try {
                    await refreshItems({ silent: true })
                } catch {
                    // keep polling even if a request fails
                }
                await sleep(pollIntervalMs)
            }
        }

        void loop()

        return () => {
            cancelled = true
            if (timer) window.clearTimeout(timer)
        }
    }, [projectId, myProjectMemberId, refreshItems])

    // Fetch status effects when projectId or myProjectMemberId changes
    const refreshEffects = React.useCallback(async (opts?: { silent?: boolean }) => {
        if (!projectId || !myProjectMemberId) {
            setStatusEffects([]);
            return;
        }

        try {
            const data = await getMyStatusEffects(projectId);
            // Handle both response formats: { member } or { members }
            if ('member' in data && data.member) {
                setStatusEffects(data.member.effects || []);
            } else if ('members' in data && Array.isArray(data.members)) {
                // Find the member matching myProjectMemberId
                const myMember = data.members.find(
                    m => m.project_member_id === myProjectMemberId
                );
                setStatusEffects(myMember?.effects || []);
            } else {
                setStatusEffects([]);
            }
        } catch (error) {
            console.error('Failed to fetch status effects:', error);
            // Don't show toast for effects - it's less critical than items
        }
    }, [projectId, myProjectMemberId, getMyStatusEffects]);

    useEffect(() => {
        refreshEffects();
    }, [refreshEffects]);

    // Long-poll loop for effects: request -> wait -> request (no overlap).
    useEffect(() => {
        if (!projectId || !myProjectMemberId) return

        const pollIntervalMs = 5000
        const enabled = true

        if (!enabled) return
        if (!pollIntervalMs || pollIntervalMs <= 0) return

        let cancelled = false
        let timer: number | null = null

        const sleep = (ms: number) =>
            new Promise<void>((resolve) => {
                timer = window.setTimeout(() => resolve(), ms)
            })

        const loop = async () => {
            // Start after initial load; keep refreshing silently.
            while (!cancelled) {
                try {
                    await refreshEffects({ silent: true })
                } catch {
                    // keep polling even if a request fails
                }
                await sleep(pollIntervalMs)
            }
        }

        void loop()

        return () => {
            cancelled = true
            if (timer) window.clearTimeout(timer)
        }
    }, [projectId, myProjectMemberId, refreshEffects])

    // Group effects by effect_id and count stacks
    const groupedEffects = useMemo(() => {
        const grouped = new Map<string, {
            effect: StatusEffectEntry;
            count: number;
            userEffectIds: string[];
        }>();

        statusEffects.forEach(effect => {
            const existing = grouped.get(effect.effect_id);
            if (existing) {
                existing.count += 1;
                existing.userEffectIds.push(effect.user_effect_id);
            } else {
                grouped.set(effect.effect_id, {
                    effect,
                    count: 1,
                    userEffectIds: [effect.user_effect_id]
                });
            }
        });

        return Array.from(grouped.values());
    }, [statusEffects]);

    // Group items by name and count them
    const groupedItems = useMemo<GroupedItem[]>(() => {
        if (!items?.items) return [];

        const grouped = new Map<string, GroupedItem>();

        items.items.forEach((itemEntry) => {
            const itemName = itemEntry.item.name;
            const existing = grouped.get(itemName);

            if (existing) {
                existing.count += 1;
                existing.userItemIds.push(itemEntry.user_item_id);
            } else {
                grouped.set(itemName, {
                    name: itemName,
                    description: itemEntry.item.description || '',
                    count: 1,
                    colorCategory: getItemColorCategory(itemName),
                    userItemIds: [itemEntry.user_item_id],
                });
            }
        });

        return Array.from(grouped.values());
    }, [items]);

    const handleUseItem = async (userItemId: string, itemName: string) => {
        if (!projectId || usingItemId) return;

        try {
            setUsingItemId(userItemId);
            await useMyItem(projectId, { item_id: userItemId });
            toast.success(`Used ${itemName}`);
            
            // Refresh items after use
            await refreshItems();
        } catch (error: any) {
            console.error('Failed to use item:', error);
            
            // Extract error message from axios error response
            let errorMessage = 'Failed to use item';
            if (error?.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
            
            // Refresh items on failure to get latest item IDs (item might have been used/deleted)
            try {
                await refreshItems();
            } catch (refreshError) {
                console.warn('Failed to refresh items after use error:', refreshError);
            }
        } finally {
            setUsingItemId(null);
        }
    };

    const getColorClasses = (category: 'blue' | 'green' | 'red' | 'gray') => {
        switch (category) {
            case 'blue':
                return 'text-blue-300 border-blue-500/50 hover:bg-blue-900/50 hover:text-blue-200';
            case 'green':
                return 'text-green-400 border-green-500/50 hover:bg-green-900/50 hover:text-green-200';
            case 'red':
                return 'text-red-400 border-red-500/50 hover:bg-red-900/50 hover:text-red-200';
            default:
                return 'text-gray-400 border-gray-500/50 hover:bg-gray-900/50 hover:text-gray-200';
        }
    };

    return (
        <div className="flex-1 min-h-[400px] flex items-end justify-center pb-12 overflow-hidden relative z-0">
            <div
                className="relative border-4 border-gray-600 shadow-2xl origin-bottom"
                style={{ width: '476px', height: '140px', transform: 'scale(2.5)', imageRendering: 'pixelated' }}
            >
                <img src="/assets/bg.gif" className="absolute inset-0 w-full h-full object-cover z-0" />

                {boss.status !== 'hidden' && (
                    <div className="absolute left-1/2 -translate-x-1/2 w-full z-40 pointer-events-none scale-35 transition-opacity duration-500">
                        <EnemyHealthDisplay 
                            enemyName={bossName} 
                            currentHealth={boss.hp} 
                            maxHealth={boss.maxHp} 
                            variant="retro" 
                            healthBarVariant="default" 
                            size="sm" 
                            className="shadow-lg" 
                            textColor="yellow" 
                        />
                    </div>
                )}

                {/* Status Effects Icons - positioned next to backpack button */}
                {groupedEffects.length > 0 && (
                    <div className="absolute top-2 right-12 z-50 flex flex-col gap-1">
                        {groupedEffects.map((grouped) => (
                            <EffectIconPlaceholder 
                                key={grouped.effect.effect_id} 
                                effect={grouped.effect} 
                                stackCount={grouped.count}
                            />
                        ))}
                    </div>
                )}

                <div className="absolute top-2 right-2 z-50">
                    <Sheet>
                        <SheetTrigger asChild>
                            <div className="cursor-pointer hover:brightness-110 active:scale-95 transition-all">
                                <div className="bg-slate-800/90 border-2 border-slate-600 px-2 py-1 rounded-sm shadow-md">
                                    <Backpack className="w-4 h-4 text-yellow-400" />
                                </div>
                            </div>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-slate-900 border-l-4 border-gray-600 w-[300px] text-white">
                            <SheetHeader>
                                <SheetTitle className="text-orange-400 font-bold font-mono text-xl tracking-widest border-b-2 border-gray-700 pb-2">INVENTORY</SheetTitle>
                                <SheetDescription className="text-gray-400 text-[10px] uppercase">Select an item to use in battle</SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                                {loadingItems ? (
                                    <div className="text-gray-400 text-sm text-center py-4">Loading items...</div>
                                ) : groupedItems.length === 0 ? (
                                    <div className="text-gray-400 text-sm text-center py-4">No items in inventory</div>
                                ) : (
                                    <ItemGroup>
                                        {groupedItems.map((groupedItem, index) => {
                                            const colorClasses = getColorClasses(groupedItem.colorCategory);
                                            const displayName = groupedItem.count > 1 
                                                ? `${groupedItem.name.toUpperCase()} • x${groupedItem.count}`
                                                : groupedItem.name.toUpperCase();
                                            const firstUserItemId = groupedItem.userItemIds[0];
                                            const isUsing = usingItemId === firstUserItemId;

                                            return (
                                                <React.Fragment key={groupedItem.name}>
                                                    {index > 0 && <ItemSeparator className="bg-gray-700 my-2" />}
                                                    <Item variant="default" className={index < groupedItems.length - 1 ? "border-b border-gray-800 pb-2 mb-2" : "pb-2 mb-2"}>
                                                        <ItemContent>
                                                            <ItemTitle className={`${colorClasses.split(' ')[0]} font-bold`}>
                                                                {displayName}
                                                            </ItemTitle>
                                                            <ItemDescription className="text-gray-400 text-xs">
                                                                {groupedItem.description || 'No description'}
                                                            </ItemDescription>
                                                        </ItemContent>
                                                        <ItemActions>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                className={`h-7 text-xs ${colorClasses}`}
                                                                onClick={() => handleUseItem(firstUserItemId, groupedItem.name)}
                                                                disabled={isUsing || !projectId}
                                                            >
                                                                {isUsing ? 'USING...' : 'USE'}
                                                            </Button>
                                                        </ItemActions>
                                                    </Item>
                                                </React.Fragment>
                                            );
                                        })}
                                    </ItemGroup>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {(() => {
                    let action = 'idle';
                    if (boss.status === 'moving_in') action = 'walk_left';
                    if (boss.status === 'moving_out') action = 'walk_right';
                    if (boss.status === 'attacking') action = 'attack';
                    if (boss.status === 'damage') action = 'damage';
                    if (boss.status === 'dead' || boss.status === 'hidden') action = 'dead';
                    
                    return (
                        <SpriteEntity 
                            type="bosses" 
                            id={boss.id} 
                            action={action} 
                            positionStyle={getBossPosition(boss.status, boss.id)} 
                            isMirrored={false} 
                            name={boss.status === 'hidden' ? undefined : bossName} 
                        />
                    );
                })()}

                {users.map((user) => {
                    let action = 'idle';
                    let isMirrored = false;
                    
                    if (user.status === 'walking_in') { action = 'walk_right'; }
                    else if (user.status === 'walking_out') { action = 'walk_left'; isMirrored = false; }
                    else if (user.status === 'attacking') { action = 'attack'; }
                    else if (user.status === 'damage') { action = 'damage'; }
                    else if (user.status === 'dead') { action = 'dead'; }
                    else if (user.status === 'shifting_forward') { action = 'walk_right'; isMirrored = false; }
                    else if (user.status === 'shifting_backward') { action = 'walk_left'; isMirrored = false; }

                    return (<SpriteEntity key={user.uid} type="characters" id={user.charId} action={action} positionStyle={getUserPosition(user.slot, user.status)} isMirrored={isMirrored} name={user.status === 'dead' ? undefined : user.name} />);
                })}
            </div>
        </div>
    );
};