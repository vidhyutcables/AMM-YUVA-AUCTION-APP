import React, { useState, useEffect, useRef } from 'react';
import { Player, Team, AuctionState, AuctionPhase, PlayerStatus, BidHistoryItem } from './types';
import { INITIAL_PLAYERS, INITIAL_TEAMS } from './constants';
import LiveScreen from './components/LiveScreen';
import AuctioneerDashboard from './components/AuctioneerDashboard';
import TeamDashboard from './components/TeamDashboard';
import { Monitor, Shield, Users, Volume2, VolumeX } from 'lucide-react';

enum ViewMode {
    AUCTIONEER = 'AUCTIONEER',
    PROJECTOR = 'PROJECTOR',
    TEAM = 'TEAM',
}

// Royalty-free background music loop (Action/Sports style)
const BG_MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=action-sport-rock-trailer-118442.mp3";

const App: React.FC = () => {
    // Application State
    const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
    const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
    const [auctionState, setAuctionState] = useState<AuctionState>({
        phase: AuctionPhase.SETUP,
        activePlayerId: null,
        currentBid: 0,
        timer: 10,
        isTimerRunning: false,
        lastBidTeamId: null,
        bidHistory: []
    });

    // UI View State
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.AUCTIONEER);
    const [selectedTeamViewId, setSelectedTeamViewId] = useState<string>(INITIAL_TEAMS[0].id);
    
    // Music State
    const [isMusicEnabled, setIsMusicEnabled] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        audioRef.current = new Audio(BG_MUSIC_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4; // Optimized volume for background
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Smart Audio Logic: Play only if Enabled AND in a Live Phase
    useEffect(() => {
        if (!audioRef.current) return;

        const isLivePhase = 
            auctionState.phase === AuctionPhase.LIVE_INITIAL || 
            auctionState.phase === AuctionPhase.LIVE_REAUCTION;

        const shouldPlay = isMusicEnabled && isLivePhase;

        if (shouldPlay) {
            if (audioRef.current.paused) {
                audioRef.current.play().catch(e => {
                    console.warn("Audio autoplay blocked by browser policy:", e);
                    // No alert needed, user interaction with other buttons will eventually allow playback
                });
            }
        } else {
            if (!audioRef.current.paused) {
                audioRef.current.pause();
            }
        }
    }, [isMusicEnabled, auctionState.phase]);

    // Timer Logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (auctionState.isTimerRunning && auctionState.timer > 0) {
            interval = setInterval(() => {
                setAuctionState(prev => ({ ...prev, timer: prev.timer - 1 }));
            }, 1000);
        } else if (auctionState.timer === 0) {
            setAuctionState(prev => ({ ...prev, isTimerRunning: false }));
        }
        return () => clearInterval(interval);
    }, [auctionState.isTimerRunning, auctionState.timer]);

    // Helpers
    const getActivePlayer = () => players.find(p => p.id === auctionState.activePlayerId) || null;
    const getLastBidTeam = () => teams.find(t => t.id === auctionState.lastBidTeamId);

    // Actions
    const handleStartAuction = () => {
        setAuctionState(prev => ({ ...prev, phase: AuctionPhase.LIVE_INITIAL }));
    };

    const handleNextPlayer = () => {
        let eligiblePlayers: Player[] = [];
        
        if (auctionState.phase === AuctionPhase.LIVE_INITIAL) {
            eligiblePlayers = players.filter(p => p.status === PlayerStatus.AVAILABLE);
        } else if (auctionState.phase === AuctionPhase.LIVE_REAUCTION) {
            eligiblePlayers = players.filter(p => p.status === PlayerStatus.UNSOLD);
        }

        if (eligiblePlayers.length === 0) {
            alert("No players available in this pool.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
        const selectedPlayer = eligiblePlayers[randomIndex];

        setAuctionState(prev => ({
            ...prev,
            activePlayerId: selectedPlayer.id,
            currentBid: selectedPlayer.basePrice,
            timer: 10,
            isTimerRunning: false,
            lastBidTeamId: null,
            bidHistory: [] // Reset history for new player
        }));
    };

    const handleStartReAuction = () => {
        setAuctionState(prev => ({ ...prev, phase: AuctionPhase.LIVE_REAUCTION }));
    };

    const handleBidUpdate = (amount: number) => {
        const newHistoryItem: BidHistoryItem = {
            amount,
            timestamp: Date.now()
        };

        setAuctionState(prev => ({ 
            ...prev, 
            currentBid: amount,
            bidHistory: [newHistoryItem, ...prev.bidHistory] // Prepend new bid
        }));
    };

    const handleTimerControl = (action: 'start' | 'pause' | 'reset' | 'add') => {
        setAuctionState(prev => {
            if (action === 'start') return { ...prev, isTimerRunning: true };
            if (action === 'pause') return { ...prev, isTimerRunning: false };
            if (action === 'reset') return { ...prev, timer: 10, isTimerRunning: false };
            return prev;
        });
    };

    const handleSold = (teamId: string, amount: number) => {
        const activePlayer = getActivePlayer();
        if (!activePlayer) return;

        // 1. Update Player
        const updatedPlayers = players.map(p => 
            p.id === activePlayer.id 
                ? { ...p, status: PlayerStatus.SOLD, soldPrice: amount, teamId: teamId } 
                : p
        );
        setPlayers(updatedPlayers);

        // 2. Update Team Budget
        const updatedTeams = teams.map(t => 
            t.id === teamId 
                ? { ...t, spent: t.spent + amount } 
                : t
        );
        setTeams(updatedTeams);

        // 3. Reset Auction State for next
        setAuctionState(prev => ({
            ...prev,
            activePlayerId: null,
            currentBid: 0,
            isTimerRunning: false,
            lastBidTeamId: teamId,
            bidHistory: []
        }));
    };

    const handleUnsold = () => {
        const activePlayer = getActivePlayer();
        if (!activePlayer) return;

        // 1. Update Player
        const updatedPlayers = players.map(p => 
            p.id === activePlayer.id 
                ? { ...p, status: PlayerStatus.UNSOLD } 
                : p
        );
        setPlayers(updatedPlayers);

        // 2. Reset Auction State
        setAuctionState(prev => ({
            ...prev,
            activePlayerId: null,
            currentBid: 0,
            isTimerRunning: false,
            lastBidTeamId: null,
            bidHistory: []
        }));
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Top Bar - Role Simulator & Global Controls */}
            <div className="bg-slate-900 text-white h-14 flex justify-between items-center px-4 shadow-xl z-50 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold text-sm tracking-widest text-slate-300">AMM YUVA SYS</span>
                </div>

                <div className="flex items-center gap-4">
                     {/* Music Toggle */}
                     <div className="flex items-center gap-2">
                         <span className={`text-[10px] uppercase font-bold tracking-wider ${isMusicEnabled ? 'text-green-400' : 'text-slate-500'}`}>
                             {isMusicEnabled ? 'Music On' : 'Music Off'}
                         </span>
                         <button 
                            onClick={() => setIsMusicEnabled(!isMusicEnabled)}
                            className={`p-2 rounded-full transition-all duration-300 ${isMusicEnabled ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                            title={isMusicEnabled ? "Disable Background Music" : "Enable Background Music"}
                        >
                            {isMusicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                     </div>

                    <div className="h-6 w-px bg-slate-700 mx-2"></div>

                    {/* Role Switcher */}
                    <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
                        <button 
                            onClick={() => setViewMode(ViewMode.AUCTIONEER)}
                            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all ${viewMode === ViewMode.AUCTIONEER ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                        >
                            <Shield className="w-3 h-3" /> ADMIN
                        </button>
                        <button 
                            onClick={() => setViewMode(ViewMode.PROJECTOR)}
                            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all ${viewMode === ViewMode.PROJECTOR ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                        >
                            <Monitor className="w-3 h-3" /> BIG SCREEN
                        </button>
                        <button 
                            onClick={() => setViewMode(ViewMode.TEAM)}
                            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all ${viewMode === ViewMode.TEAM ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                        >
                            <Users className="w-3 h-3" /> TEAM VIEW
                        </button>
                    </div>
                </div>

                {viewMode === ViewMode.TEAM && (
                    <select 
                        value={selectedTeamViewId} 
                        onChange={(e) => setSelectedTeamViewId(e.target.value)}
                        className="bg-slate-800 text-xs py-1.5 px-3 rounded border border-slate-600 outline-none focus:border-blue-500 text-slate-200"
                    >
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {viewMode === ViewMode.PROJECTOR && (
                    <LiveScreen 
                        activePlayer={getActivePlayer()}
                        currentBid={auctionState.currentBid}
                        timer={auctionState.timer}
                        phase={auctionState.phase}
                        lastBidTeam={getLastBidTeam()}
                    />
                )}

                {viewMode === ViewMode.AUCTIONEER && (
                    <AuctioneerDashboard 
                        players={players}
                        teams={teams}
                        phase={auctionState.phase}
                        activePlayer={getActivePlayer()}
                        currentBid={auctionState.currentBid}
                        timer={auctionState.timer}
                        isTimerRunning={auctionState.isTimerRunning}
                        bidHistory={auctionState.bidHistory}
                        onStartAuction={handleStartAuction}
                        onNextPlayer={handleNextPlayer}
                        onStartReAuction={handleStartReAuction}
                        onBidUpdate={handleBidUpdate}
                        onTimerControl={handleTimerControl}
                        onSold={handleSold}
                        onUnsold={handleUnsold}
                    />
                )}

                {viewMode === ViewMode.TEAM && (
                    <TeamDashboard 
                        team={teams.find(t => t.id === selectedTeamViewId) || teams[0]}
                        players={players}
                        activePlayer={getActivePlayer()}
                        currentBid={auctionState.currentBid}
                        phase={auctionState.phase}
                        bidHistory={auctionState.bidHistory}
                    />
                )}
            </div>
        </div>
    );
};

export default App;