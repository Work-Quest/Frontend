import { useState } from 'react';
import { BattleScene } from '@/components/battle/BattleScene';
import { useBattleLogic } from '@/hook/useBattleLogic';

const BattlePlayground = () => {
  const {
    users,
    boss,
    isSequenceRunning,
    handleGameAction
  } = useBattleLogic(5);

  const [payloadText, setPayloadText] = useState<string>('{\n  "act": "ATTACK",\n  "userId": "1"\n}');
  const [lastLog, setLastLog] = useState<string | null>(null);
  const [errorLog, setErrorLog] = useState<string | null>(null);

  // --- MOCK DATA FOR INITIALIZATION ---
  const MOCK_INIT_PAYLOAD = {
    act: "SETUP_GAME",
    boss: {
      id: "b02", // Golem
      status: "idle",
      hp: 10000,
      maxHp: 10000
    },
    users: [
      { uid: "1", charId: "c01", name: "Arthur", hp: 120, maxHp: 120, status: "idle", slot: 0 },
      { uid: "2", charId: "c01", name: "Lancelot", hp: 100, maxHp: 100, status: "idle", slot: 1 },
      { uid: "3", charId: "c01", name: "Merlin", hp: 80, maxHp: 80, status: "idle", slot: 2 },
      { uid: "4", charId: "c01", name: "Gawain", hp: 150, maxHp: 150, status: "idle", slot: 3 },
      { uid: "5", charId: "c01", name: "Percival", hp: 90, maxHp: 90, status: "idle", slot: 4 }
    ]
  };

  const triggerBackendAction = () => {
    try {
      setErrorLog(null);
      const payload = JSON.parse(payloadText);
      setLastLog(`Sent: ${payload.act} ${payload.userId ? `(UID: ${payload.userId})` : ''}`);
      handleGameAction(payload);
    } catch (e) {
      setErrorLog("Invalid JSON format");
    }
  };

  const setPreset = (json: object) => {
    setPayloadText(JSON.stringify(json, null, 2));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      
      <BattleScene users={users} boss={boss} projectId={null} myProjectMemberId={null} />

      <div className="flex-1 bg-slate-900 border-t border-slate-800 p-6 shadow-2xl z-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 h-full">
            
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-blue-400 font-mono text-sm font-bold tracking-widest">BACKEND PAYLOAD INPUT</h3>
                    <div className="text-[10px] text-slate-500">
                        STATUS: <span className={isSequenceRunning ? "text-yellow-400" : "text-green-400"}>{isSequenceRunning ? "ANIMATING..." : "READY"}</span>
                    </div>
                </div>

                <div className="relative flex-1 min-h-[200px] bg-slate-950 rounded-lg border border-slate-700 overflow-hidden font-mono">
                    <textarea 
                        value={payloadText}
                        onChange={(e) => setPayloadText(e.target.value)}
                        spellCheck={false}
                        className="w-full h-full bg-transparent text-sm p-4 text-green-300 outline-none resize-none"
                    />
                    {(lastLog || errorLog) && (
                        <div className={`absolute bottom-0 left-0 right-0 px-4 py-1 text-[10px] font-bold ${errorLog ? 'bg-red-900/80 text-red-200' : 'bg-green-900/80 text-green-200'}`}>
                            {errorLog || `> ${lastLog}`}
                        </div>
                    )}
                </div>

                <button 
                    onClick={triggerBackendAction}
                    disabled={isSequenceRunning}
                    className="mt-3 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold tracking-widest rounded shadow-lg active:scale-[0.99] transition-all"
                >
                    {isSequenceRunning ? 'WAITING FOR ANIMATION...' : 'SEND PAYLOAD'}
                </button>
            </div>

            <div className="w-full md:w-48 shrink-0 flex flex-col gap-2">
                <h3 className="text-gray-500 font-mono text-[10px] font-bold tracking-widest mb-1">QUICK PRESETS</h3>
                
                <button onClick={() => setPreset(MOCK_INIT_PAYLOAD)} className="text-left text-xs bg-purple-900/40 hover:bg-purple-900/60 px-3 py-2 rounded text-purple-300 border border-purple-700/50 transition-colors font-bold mb-2">
                    ⚡ Initialize Game
                </button>

                <button onClick={() => setPreset({ act: "ATTACK", userId: "1" })} className="text-left text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-blue-300 border border-slate-700 transition-colors">
                    Hero 1 Attack
                </button>
                <button onClick={() => setPreset({ act: "BOSS_ATTACK_USER", userId: "1" })} className="text-left text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-orange-300 border border-slate-700 transition-colors">
                    Boss Hit Hero 1
                </button>
                <button onClick={() => setPreset({ act: "BOSS_ULTIMATE" })} className="text-left text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-red-300 border border-slate-700 transition-colors">
                    Boss Ultimate
                </button>
                <button onClick={() => setPreset({ act: "DIE", userId: "1" })} className="text-left text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-gray-400 border border-slate-700 transition-colors">
                    Hero 1 Die
                </button>
                <button onClick={() => setPreset({ act: "REVIVE", userId: "1" })} className="text-left text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-green-300 border border-slate-700 transition-colors">
                    Hero 1 Revive
                </button>
                <div className="h-px bg-slate-800 my-1" />
                <button onClick={() => setPreset({ act: "BOSS_DIE" })} className="text-left text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-red-500 border border-slate-700 transition-colors">
                    Kill Boss
                </button>
                <button onClick={() => setPreset({ act: "BOSS_REVIVE" })} className="text-left text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-green-500 border border-slate-700 transition-colors">
                    Revive Boss
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default BattlePlayground;