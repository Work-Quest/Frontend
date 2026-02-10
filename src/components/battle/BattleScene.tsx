import React from 'react';
import { SpriteEntity } from '@/components/battle/SpriteEntity';
import { POSITIONS, ENTITY_CONFIG } from '@/config/battleConfig';
import { User, BossState } from '@/types/battleTypes';
import EnemyHealthDisplay from '@/components/ui/8bit/enemy-health-display';
import { Backpack } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "@/components/ui/8bit/item";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface BattleSceneProps {
    users: User[];
    boss: BossState;
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

export const BattleScene: React.FC<BattleSceneProps> = ({ users, boss }) => {
    const bossName = (ENTITY_CONFIG.bosses as any)[boss.id]?.name || "GREAT BOSS";

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
                                <ItemGroup>
                                    <Item variant="default" className="border-b border-gray-800 pb-2 mb-2">
                                        <ItemContent>
                                            <ItemTitle className="text-blue-300 font-bold">POTION &bull; x5</ItemTitle>
                                            <ItemDescription className="text-gray-400 text-xs">Restores 50 HP</ItemDescription>
                                        </ItemContent>
                                        <ItemActions><Button variant="outline" size="sm" className="h-7 text-xs border-blue-500/50 hover:bg-blue-900/50 hover:text-blue-200">USE</Button></ItemActions>
                                    </Item>
                                    <ItemSeparator className="bg-gray-700 my-2" />
                                    <Item variant="default" className="border-b border-gray-800 pb-2 mb-2">
                                        <ItemContent>
                                            <ItemTitle className="text-red-400 font-bold">BOMB &bull; x2</ItemTitle>
                                            <ItemDescription className="text-gray-400 text-xs">Deals 200 DMG</ItemDescription>
                                        </ItemContent>
                                        <ItemActions><Button variant="outline" size="sm" className="h-7 text-xs border-red-500/50 hover:bg-red-900/50 hover:text-red-200">USE</Button></ItemActions>
                                    </Item>
                                    <ItemSeparator className="bg-gray-700 my-2" />
                                    <Item variant="default" className="pb-2 mb-2">
                                        <ItemContent>
                                            <ItemTitle className="text-green-400 font-bold">HERB &bull; x3</ItemTitle>
                                            <ItemDescription className="text-gray-400 text-xs">Cures Status</ItemDescription>
                                        </ItemContent>
                                        <ItemActions><Button variant="outline" size="sm" className="h-7 text-xs border-green-500/50 hover:bg-green-900/50 hover:text-green-200">USE</Button></ItemActions>
                                    </Item>
                                </ItemGroup>
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