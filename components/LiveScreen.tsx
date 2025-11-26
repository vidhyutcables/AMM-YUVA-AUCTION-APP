import React from 'react';
import { Player, Team, AuctionPhase } from '../types';
import { User, Gavel, IndianRupee, Clock, Activity, Shield } from 'lucide-react';

interface LiveScreenProps {
    activePlayer: Player | null;
    currentBid: number;
    timer: number;
    phase: AuctionPhase;
    lastBidTeam?: Team;
}

const LiveScreen: React.FC<LiveScreenProps> = ({ activePlayer, currentBid, timer, phase, lastBidTeam }) => {
    
    // Waiting / Setup Screen
    if (!activePlayer) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#0B0F19] text-white p-10 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-[#0B0F19] to-[#000000] opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                
                <div className="z-10 text-center flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                    <div className="relative mb-12">
                        <div className="absolute -inset-4 bg-yellow-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                        <Shield className="w-32 h-32 text-yellow-500 relative z-10" />
                    </div>
                    <h1 className="text-8xl font-bold mb-4 display-text text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">AMM YUVA</h1>
                    <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 display-text tracking-wider uppercase">
                        Cricket Auction 2024
                    </h2>
                    
                    <div className="mt-16 flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-2xl text-slate-300 font-light tracking-wide uppercase">
                            {phase === AuctionPhase.COMPLETED ? "Auction Completed" : 
                             phase === AuctionPhase.SETUP ? "System Check Complete" : "Next Lot Coming Up..."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-[#0B0F19] text-white relative overflow-hidden font-sans">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            
            {/* Header Bar */}
            <div className="h-28 bg-gradient-to-r from-slate-900 to-[#161b2c] flex items-center justify-between px-10 border-b border-slate-800 shadow-2xl z-20">
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-500 text-black px-4 py-1 rounded font-bold text-sm uppercase tracking-widest">Live</div>
                    <div className="text-4xl font-bold text-white display-text tracking-wide">AUCTION <span className="text-yellow-500">2024</span></div>
                </div>
                
                {/* Central Timer - Massive */}
                <div className={`flex items-center gap-4 text-7xl font-mono font-bold transition-all duration-300 ${timer <= 5 && timer > 0 ? 'text-red-500 scale-110' : 'text-white'}`}>
                    <div className="bg-black/40 px-6 py-2 rounded-xl border border-white/10 backdrop-blur shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-4">
                        <Clock className={`w-14 h-14 ${timer <= 5 ? 'animate-bounce' : ''}`} />
                        <span>{String(timer).padStart(2, '0')}s</span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Phase</div>
                    <div className="text-xl text-yellow-500 font-bold uppercase tracking-wider">
                        {phase === AuctionPhase.LIVE_REAUCTION ? "Re-Auction Round" : "Initial Round"}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex p-10 gap-10 z-10 relative">
                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-[100px] opacity-20"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full filter blur-[100px] opacity-20"></div>

                {/* Left: Player Card */}
                <div className="w-[40%] flex items-center justify-center">
                    <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-700 bg-slate-800 group">
                        <img 
                            src={activePlayer.image} 
                            alt={activePlayer.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-90"></div>
                        
                        <div className="absolute bottom-0 inset-x-0 p-8">
                            <div className="flex gap-3 mb-4">
                                <span className="inline-block px-4 py-1.5 bg-yellow-500 text-black font-bold text-lg rounded shadow-lg uppercase tracking-wider">
                                    {activePlayer.role}
                                </span>
                                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur text-white font-bold text-lg rounded shadow-lg uppercase tracking-wider border border-white/20">
                                    {activePlayer.category}
                                </span>
                            </div>
                            <h2 className="text-6xl font-bold display-text text-white mb-2 drop-shadow-md leading-none">{activePlayer.name}</h2>
                            <div className="flex items-center gap-3 text-slate-400 font-mono text-xl mt-4">
                                <span className="px-3 py-1 bg-slate-800 rounded border border-slate-700">ID: #{activePlayer.id.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Bidding Details */}
                <div className="flex-1 flex flex-col justify-center gap-8 pl-10">
                    
                    {/* Base Price Panel */}
                    <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                         <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                            <Activity className="w-8 h-8 text-slate-400" />
                         </div>
                         <div>
                             <div className="text-slate-400 text-xl uppercase tracking-widest font-bold">Base Price</div>
                             <div className="text-4xl font-bold text-white font-mono">₹ {activePlayer.basePrice.toLocaleString()}</div>
                         </div>
                    </div>

                    {/* Current Bid Display - The Main Focus */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-[#161b2c] rounded-3xl p-12 border border-slate-700 shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-blue-400 text-2xl uppercase tracking-[0.2em] font-bold">Current Bid</div>
                                <div className="animate-pulse flex items-center gap-2 text-green-500 font-bold uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Live
                                </div>
                            </div>
                            
                            <div className="text-[9rem] leading-none font-bold text-white flex items-center display-text tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                <IndianRupee className="w-24 h-24 mr-4 text-slate-500" strokeWidth={3} />
                                {currentBid.toLocaleString()}
                            </div>

                            {/* Optional: Show who holds the bid if we wanted to (currently just amount) */}
                            {lastBidTeam && (
                                <div className="mt-8 pt-6 border-t border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom-5">
                                    <div className="text-4xl">{lastBidTeam.logo}</div>
                                    <div className="text-2xl font-bold text-white">{lastBidTeam.name}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                            <span className="text-slate-500 font-bold uppercase tracking-wider">Status: <span className="text-white">Active Bidding</span></span>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                             <span className="text-slate-500 font-bold uppercase tracking-wider">Lot Type: <span className="text-white">Capped Player</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveScreen;