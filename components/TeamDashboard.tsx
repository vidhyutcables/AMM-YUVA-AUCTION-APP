import React from 'react';
import { Player, Team, AuctionPhase, BidHistoryItem } from '../types';
import { IndianRupee, Users, Wallet, Trophy, Clock, Activity } from 'lucide-react';

interface TeamDashboardProps {
    team: Team;
    players: Player[];
    activePlayer: Player | null;
    currentBid: number;
    phase: AuctionPhase;
    bidHistory: BidHistoryItem[];
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ team, players, activePlayer, currentBid, phase, bidHistory }) => {
    const myPlayers = players.filter(p => p.teamId === team.id);
    const remainingBudget = team.budget - team.spent;
    const lastBid = bidHistory.length > 0 ? bidHistory[0] : null;

    return (
        <div className="h-full flex flex-col md:flex-row bg-slate-50 text-slate-900 overflow-hidden">
            {/* Left Sidebar: Team Profile & Stats */}
            <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-full shadow-lg z-10">
                <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-b from-white to-slate-50">
                    <div className="text-7xl mb-4 transform hover:scale-110 transition-transform duration-300">{team.logo}</div>
                    <h1 className="text-2xl font-bold text-slate-800 font-serif tracking-wide">{team.name}</h1>
                    <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Team Dashboard</div>
                </div>

                <div className="p-4 space-y-4">
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wallet className="w-12 h-12 text-blue-600" />
                        </div>
                        <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Purse Remaining</div>
                        <div className="text-3xl font-bold text-slate-800 flex items-center">
                            <span className="text-lg mr-1 text-slate-500">₹</span>
                            {(remainingBudget / 100000).toFixed(2)}
                            <span className="text-sm ml-1 text-slate-500 font-medium">Lakhs</span>
                        </div>
                        <div className="mt-2 w-full bg-blue-200 h-1 rounded-full overflow-hidden">
                             <div className="bg-blue-500 h-full" style={{width: `${(remainingBudget / team.budget) * 100}%`}}></div>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="w-12 h-12 text-purple-600" />
                        </div>
                        <div className="text-purple-600 text-xs font-bold uppercase tracking-wider mb-1">Squad Size</div>
                        <div className="text-3xl font-bold text-slate-800 flex items-center">
                            {myPlayers.length}
                            <span className="text-sm ml-1 text-slate-500 font-medium">/ 15 Players</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col p-4 pt-0">
                    <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <Trophy className="w-4 h-4 text-yellow-500" /> My Squad
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {myPlayers.length === 0 ? (
                            <div className="text-center text-slate-400 py-10 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                No players purchased yet.
                            </div>
                        ) : (
                            myPlayers.map(p => (
                                <div key={p.id} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
                                    <img src={p.image} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm truncate text-slate-700">{p.name}</div>
                                        <div className="text-xs text-slate-500">{p.role}</div>
                                    </div>
                                    <div className="font-bold text-green-600 text-sm bg-green-50 px-2 py-1 rounded">
                                        {(p.soldPrice! / 100000).toFixed(1)}L
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Live Auction Feed */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50"></div>
                
                <div className="w-full max-w-4xl z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800">Live Auction</h2>
                            <p className="text-slate-500">Real-time updates from the auction floor</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm border ${
                             phase === AuctionPhase.LIVE_INITIAL || phase === AuctionPhase.LIVE_REAUCTION ? 'bg-green-100 text-green-700 border-green-200 animate-pulse' : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}>
                            {phase.replace('_', ' ')}
                        </span>
                    </div>

                    {activePlayer ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Main Player Card */}
                            <div className="lg:col-span-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="relative h-64 bg-slate-800">
                                    <img src={activePlayer.image} alt="" className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                        <div className="flex gap-2 mb-2">
                                            <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold uppercase">{activePlayer.role}</span>
                                            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold uppercase">{activePlayer.category}</span>
                                        </div>
                                        <h3 className="text-4xl font-bold mb-1 shadow-black drop-shadow-lg">{activePlayer.name}</h3>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Current Highest Bid</div>
                                            <div className="text-6xl font-bold text-slate-900 flex items-center text-blue-600">
                                                <IndianRupee className="w-10 h-10 mr-2" />
                                                {currentBid.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Base Price</div>
                                            <div className="text-2xl font-bold text-slate-600">
                                                ₹{activePlayer.basePrice.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Side Panel */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                {/* Last Bid Update Box */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                                    <Activity className="w-10 h-10 text-blue-500 mb-4" />
                                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Latest Bid Update</div>
                                    {lastBid ? (
                                        <div className="animate-in zoom-in duration-300">
                                            <div className="text-3xl font-bold text-slate-800">₹{lastBid.amount.toLocaleString()}</div>
                                            <div className="text-sm text-slate-400 mt-1 flex items-center justify-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(lastBid.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-400 italic">Waiting for opening bid...</div>
                                    )}
                                </div>

                                <div className="bg-slate-800 p-6 rounded-2xl shadow-lg text-white text-center">
                                    <p className="text-slate-400 text-sm mb-2">My Strategy</p>
                                    <p className="font-bold text-lg leading-tight">
                                        "Focus on your remaining budget. Don't overspend on one player."
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-2xl border-2 border-slate-200 border-dashed shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">Waiting for next player...</h3>
                            <p className="text-slate-400 mt-2">The auctioneer is selecting the next lot.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamDashboard;