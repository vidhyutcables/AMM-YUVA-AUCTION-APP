import { Player, PlayerRole, PlayerStatus, Team } from './types';

export const INITIAL_TEAMS: Team[] = [
    { id: 't1', name: 'Royal Strikers', logo: '👑', budget: 10000000, spent: 0 },
    { id: 't2', name: 'Thunder Bolts', logo: '⚡', budget: 10000000, spent: 0 },
    { id: 't3', name: 'Super Kings', logo: '🦁', budget: 10000000, spent: 0 },
    { id: 't4', name: 'Titan Warriors', logo: '🛡️', budget: 10000000, spent: 0 },
];

export const INITIAL_PLAYERS: Player[] = [
    { id: 'p1', name: 'Virat Kohli', basePrice: 200000, category: 'Elite', role: PlayerRole.BATSMAN, image: 'https://picsum.photos/400/400?random=1', status: PlayerStatus.AVAILABLE },
    { id: 'p2', name: 'Jasprit Bumrah', basePrice: 200000, category: 'Elite', role: PlayerRole.BOWLER, image: 'https://picsum.photos/400/400?random=2', status: PlayerStatus.AVAILABLE },
    { id: 'p3', name: 'Hardik Pandya', basePrice: 150000, category: 'A', role: PlayerRole.ALL_ROUNDER, image: 'https://picsum.photos/400/400?random=3', status: PlayerStatus.AVAILABLE },
    { id: 'p4', name: 'MS Dhoni', basePrice: 200000, category: 'Legend', role: PlayerRole.WICKET_KEEPER, image: 'https://picsum.photos/400/400?random=4', status: PlayerStatus.AVAILABLE },
    { id: 'p5', name: 'Rohit Sharma', basePrice: 200000, category: 'Elite', role: PlayerRole.BATSMAN, image: 'https://picsum.photos/400/400?random=5', status: PlayerStatus.AVAILABLE },
    { id: 'p6', name: 'Rashid Khan', basePrice: 150000, category: 'A', role: PlayerRole.BOWLER, image: 'https://picsum.photos/400/400?random=6', status: PlayerStatus.AVAILABLE },
    { id: 'p7', name: 'Ben Stokes', basePrice: 150000, category: 'A', role: PlayerRole.ALL_ROUNDER, image: 'https://picsum.photos/400/400?random=7', status: PlayerStatus.AVAILABLE },
    { id: 'p8', name: 'Sanju Samson', basePrice: 100000, category: 'B', role: PlayerRole.WICKET_KEEPER, image: 'https://picsum.photos/400/400?random=8', status: PlayerStatus.AVAILABLE },
    { id: 'p9', name: 'Shubman Gill', basePrice: 100000, category: 'B', role: PlayerRole.BATSMAN, image: 'https://picsum.photos/400/400?random=9', status: PlayerStatus.AVAILABLE },
    { id: 'p10', name: 'Trent Boult', basePrice: 120000, category: 'A', role: PlayerRole.BOWLER, image: 'https://picsum.photos/400/400?random=10', status: PlayerStatus.AVAILABLE },
];