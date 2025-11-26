import React, { useState } from 'react';
import { Player, Team, AuctionPhase, PlayerStatus, BidHistoryItem } from '../types';
import { Play, Pause, RotateCcw, UserPlus, CheckCircle, XCircle, DollarSign, Users, Trophy, Gavel, Search, History, Clock } from 'lucide-react';

interface AuctioneerDashboardProps {
    players: Player[];
    teams: Team[];
    phase: AuctionPhase;
    activePlayer: Player | null;
    currentBid: number;
    timer: number;
    isTimerRunning: boolean;
    bidHistory: BidHistoryItem[];
    onStartAuction: () => void;
    onNextPlayer: () => void;
    onStartReAuction: () => void;
    onBidUpdate: (amount: number) => void;
    onTimerControl: (action: 'start' | 'pause' | 'reset' | 'add') => void;
    onSold: (teamId: string, amount: number) => void;
    onUnsold: () => void;
}

const AuctioneerDashboard: React.FC<AuctioneerDashboardProps> = ({
    players,
    teams,
    phase,
    activePlayer,
    currentBid,
    timer,
    isTimerRunning,
    bidHistory,
    onStartAuction,
    onNextPlayer,
    onStartReAuction,
    onBidUpdate,
    onTimerControl,
    onSold,
    onUnsold
}) => {
    const [manualBidInput, setManualBidInput] = useState<string>('');
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    const soldCount = players.filter(p => p.status === PlayerStatus.SOLD).length;
    const unsoldCount = players.filter(p => p.status === PlayerStatus.UNSOLD).length;
    const remainingCount = players.filter(p => p.status === PlayerStatus.AVAILABLE).length;

    const filteredPlayers = players.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleManualBidSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseInt(manualBidInput);
        if (!isNaN(amount)) {
            onBidUpdate(amount);
            setManualBidInput('');
        }
    };

    const handleQuickBid = (increment: number) => {
        onBidUpdate(currentBid + increment);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 text-slate-900">
            {/* Top Stats Bar */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0 shadow-sm z-10">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="bg-slate-100 p-2 rounded-lg"><Gavel className="w-5 h-5 text-slate-600" /></div>
                    Auction Control
                </h2>
                <div className="flex gap-8 text-sm font-medium">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Sold</span>
                        <span className="text-green-600 font-bold text-lg leading-none">{soldCount}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Unsold</span>
                        <span className="text-red-600 font-bold text-lg leading-none">{unsoldCount}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Pending</span>
                        <span className="text-blue-600 font-bold text-lg leading-none">{remainingCount}</span>
                    </div>
                </div>
                <div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        phase === AuctionPhase.LIVE_INITIAL ? 'bg-green-50 text-green-700 border-green-200' :
                        phase === AuctionPhase.LIVE_REAUCTION ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        phase === AuctionPhase.COMPLETED ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                        {phase.replace('_', ' ')}
                    </span>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Player List & Search */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search players..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        {filteredPlayers.map(player => (
                            <div key={player.id} className={`p-3 mb-2 rounded-lg border text-sm flex items-center gap-3 transition-colors ${
                                player.status === PlayerStatus.SOLD ? 'bg-green-50 border-green-100 opacity-60' :
                                player.status === PlayerStatus.UNSOLD ? 'bg-red-50 border-red-100 opacity-60' :
                                'bg-white border-slate-100 hover:border-blue-400 cursor-pointer'
                            }`}>
                                <img src={player.image} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-slate-700 truncate">{player.name}</div>
                                    <div className="text-xs text-slate-500">{player.role} • {player.category}</div>
                                </div>
                                <div className="text-xs font-bold whitespace-nowrap">
                                    {player.status === PlayerStatus.SOLD ? 'SOLD' : 
                                     player.status === PlayerStatus.UNSOLD ? 'UNSOLD' : 
                                     `₹${(player.basePrice / 1000)}k`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Column: Active Auction Controls */}
                <div className="flex-1 bg-slate-100 p-6 flex flex-col overflow-y-auto">
                    
                    {phase === AuctionPhase.SETUP && (
                        <div className="flex flex-col items-center justify-center h-full gap-6">
                            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <Gavel className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-700">Ready to Start Auction</h2>
                            <p className="text-slate-500 max-w-md text-center">Ensure all teams and players are loaded correctly. Once started, you can manage bids and player status.</p>
                            <button 
                                onClick={onStartAuction}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-3"
                            >
                                <Play className="w-6 h-6" /> Start Initial Auction
                            </button>
                        </div>
                    )}

                    {(phase === AuctionPhase.LIVE_INITIAL || phase === AuctionPhase.LIVE_REAUCTION) && !activePlayer && (
                        <div className="flex flex-col items-center justify-center h-full gap-6">
                             <div className="w-20 h-20 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-2 animate-pulse">
                                <UserPlus className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-600">Waiting for Next Player</h3>
                            <button 
                                onClick={onNextPlayer}
                                className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-3"
                            >
                                <UserPlus className="w-6 h-6" /> 
                                {phase === AuctionPhase.LIVE_REAUCTION ? "Select Re-Auction Player" : "Select Random Player"}
                            </button>
                            {phase === AuctionPhase.LIVE_INITIAL && remainingCount === 0 && (
                                <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-center max-w-md">
                                    <h4 className="font-bold text-yellow-800 text-lg mb-2">Initial Round Complete</h4>
                                    <p className="text-sm text-yellow-700 mb-4">All available players have been auctioned. You can now proceed to re-auction unsold players.</p>
                                    <button 
                                        onClick={onStartReAuction}
                                        className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold shadow transition-colors"
                                    >
                                        Start Re-Auction Round
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activePlayer && (
                        <div className="flex gap-6 h-full">
                            {/* Main Action Area */}
                            <div className="flex-1 flex flex-col gap-4">
                                {/* Player Header Card */}
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex gap-5 items-center">
                                    <img src={activePlayer.image} className="w-28 h-28 rounded-lg object-cover bg-slate-100 shadow-md" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-3xl font-bold text-slate-800">{activePlayer.name}</h2>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-bold uppercase tracking-wide">{activePlayer.role}</span>
                                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-bold uppercase tracking-wide">{activePlayer.category}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Base Price</div>
                                                <div className="text-xl font-bold text-slate-600">₹{activePlayer.basePrice.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Bid & Timer Section */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center items-center relative overflow-hidden">
                                        <div className="text-sm text-slate-400 uppercase font-bold tracking-widest mb-2">Current Bid</div>
                                        <div className="text-5xl font-bold text-blue-600 flex items-center">
                                            <span className="text-2xl mr-1">₹</span>
                                            {currentBid.toLocaleString()}
                                        </div>
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <DollarSign className="w-24 h-24" />
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Timer Control</span>
                                            <span className={`text-4xl font-mono font-bold ${timer <= 3 ? 'text-red-500' : 'text-slate-800'}`}>
                                                {timer}s
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => onTimerControl(isTimerRunning ? 'pause' : 'start')}
                                                className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${isTimerRunning ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                            >
                                                {isTimerRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
                                            </button>
                                            <button onClick={() => onTimerControl('reset')} className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors">
                                                <RotateCcw className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bidding Interface */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
                                    <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
                                        <DollarSign className="w-4 h-4 text-blue-500" /> Place Bid
                                    </h4>
                                    
                                    <div className="grid grid-cols-4 gap-3 mb-4">
                                        {[10000, 20000, 50000, 100000, 200000, 500000].map(amt => (
                                            <button 
                                                key={amt}
                                                onClick={() => handleQuickBid(amt)}
                                                className="py-3 bg-blue-50 hover:bg-blue-100 hover:shadow-md text-blue-700 rounded-lg border border-blue-200 text-sm font-bold transition-all"
                                            >
                                                +{amt / 1000}k
                                            </button>
                                        ))}
                                    </div>

                                    <form onSubmit={handleManualBidSubmit} className="flex gap-3 mb-6">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                                            <input 
                                                type="number" 
                                                value={manualBidInput}
                                                onChange={(e) => setManualBidInput(e.target.value)}
                                                placeholder="Enter custom amount..."
                                                className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                            />
                                        </div>
                                        <button type="submit" className="px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors">
                                            Set
                                        </button>
                                    </form>

                                    {/* Final Decision */}
                                    <div className="mt-auto pt-6 border-t border-slate-100">
                                        <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-3">
                                            <Trophy className="w-4 h-4 text-yellow-500" /> Close Lot
                                        </h4>
                                        <div className="flex gap-4">
                                            <div className="flex-1 flex gap-2">
                                                <select 
                                                    value={selectedTeamId}
                                                    onChange={(e) => setSelectedTeamId(e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                                >
                                                    <option value="">Select Winner...</option>
                                                    {teams.map(t => {
                                                        const rem = t.budget - t.spent;
                                                        const canAfford = rem >= currentBid;
                                                        return (
                                                            <option key={t.id} value={t.id} disabled={!canAfford}>
                                                                {t.name} (Bal: {rem/1000}k)
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                                <button 
                                                    disabled={!selectedTeamId}
                                                    onClick={() => {
                                                        if(selectedTeamId) {
                                                            onSold(selectedTeamId, currentBid);
                                                            setSelectedTeamId('');
                                                        }
                                                    }}
                                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-all shadow-md"
                                                >
                                                    SOLD
                                                </button>
                                            </div>
                                            <button 
                                                onClick={onUnsold}
                                                className="px-6 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 rounded-lg font-bold transition-all shadow-sm"
                                            >
                                                UNSOLD
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Bid History */}
                            <div className="w-72 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                                    <History className="w-4 h-4 text-slate-500" />
                                    <h3 className="font-bold text-slate-700">Bid History</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
                                    {bidHistory.length === 0 ? (
                                        <div className="text-center text-slate-400 py-8 text-sm italic">
                                            No bids yet.
                                        </div>
                                    ) : (
                                        bidHistory.map((bid, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Bid #{bidHistory.length - idx}</span>
                                                    <span className="font-bold text-slate-700">₹{bid.amount.toLocaleString()}</span>
                                                </div>
                                                <span className="text-xs text-slate-400 font-mono">
                                                    {new Date(bid.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
                                    {bidHistory.length} bids recorded
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Far Right Column: Teams Overview */}
                <div className="w-72 bg-white border-l border-slate-200 p-4 flex flex-col shrink-0 overflow-y-auto">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Teams Status
                    </h3>
                    <div className="space-y-4">
                        {teams.map(team => {
                            const remaining = team.budget - team.spent;
                            const teamPlayers = players.filter(p => p.teamId === team.id);
                            return (
                                <div key={team.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-bold flex items-center gap-2 text-sm">
                                            <span className="text-lg">{team.logo}</span>
                                            <span className="truncate max-w-[100px]">{team.name}</span>
                                        </div>
                                        <div className="px-2 py-0.5 bg-slate-200 rounded text-xs font-bold text-slate-600">{teamPlayers.length} / 15</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Budget Use</span>
                                            <span>{Math.round((team.spent / team.budget) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className={`h-1.5 rounded-full ${remaining < 2000000 ? 'bg-red-500' : 'bg-blue-600'}`}
                                                style={{ width: `${(team.spent / team.budget) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium pt-1">
                                            <span className="text-slate-400">Spent: {(team.spent / 100000).toFixed(1)}L</span>
                                            <span className={remaining < 2000000 ? 'text-red-600' : 'text-green-600'}>
                                                Rem: {(remaining / 100000).toFixed(1)}L
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctioneerDashboard;