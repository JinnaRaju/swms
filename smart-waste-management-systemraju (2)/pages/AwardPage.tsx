import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_CONTRIBUTORS, getAwardLevel } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { TrophyIcon, CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { AwardLevel } from '../types';

// A helper component for the podium to avoid repetition
const PodiumCard: React.FC<{contributor?: any, rank: number, style: any}> = ({contributor, rank, style}) => {
    if (!contributor) return <div className="min-h-[10rem] bg-gray-100 rounded-t-xl"></div>; // Placeholder for fewer than 3 contributors
    const heightClass = rank === 1 ? 'min-h-[12rem] sm:-translate-y-4' : 'min-h-[10rem]';
    return (
        <div className={`flex flex-col items-center justify-end p-4 rounded-t-xl bg-gray-50 ${heightClass} transition-all duration-300 shadow-lg hover:shadow-2xl ring-2 ${style.ring} ${style.glow}`}>
             <div className="relative mb-2">
                <img src={contributor.avatarUrl} alt={contributor.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md" />
                <span className={`absolute -bottom-2 -right-2 text-2xl`}>{style.medal}</span>
             </div>
            <p className="font-bold text-gray-900 truncate w-full">{contributor.name}</p>
            <p className={`font-bold text-xl ${style.text}`}>{contributor.uploads.toLocaleString()}</p>
        </div>
    );
}

// --- START: New Interactive Components ---

const Confetti: React.FC = () => {
  const confettiCount = 150;
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#ffeb3b', '#ff9800'];
  
  return (
    <>
      <style>
        {`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotateZ(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 20px;
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: 1; /* Play once */
          animation-fill-mode: forwards; /* Hold final state */
        }
        `}
      </style>
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({ length: confettiCount }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              animationDuration: `${Math.random() * 2 + 3}s`,
              animationDelay: `${Math.random()}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

const AwardModal: React.FC<{ award: any, onClose: () => void }> = ({ award, onClose }) => {
  const { level, reports, gradient, icon, isAchieved } = award;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="award-modal-title"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative p-8 rounded-t-2xl text-white overflow-hidden ${isAchieved ? gradient : 'bg-gradient-to-br from-slate-500 to-gray-600'}`}>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-12 -left-4 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-4 bg-white/20 rounded-full mb-4">
              {icon}
            </div>
            <h2 id="award-modal-title" className="text-3xl font-bold">{level} Award</h2>
            {isAchieved ? (
              <p className="text-lg font-semibold text-white/90">UNLOCKED!</p>
            ) : (
              <p className="text-lg font-semibold text-white/90">LOCKED</p>
            )}
          </div>
        </div>
        <div className="p-6 text-center">
          {isAchieved ? (
            <>
              <p className="text-gray-700 text-lg">Congratulations on your incredible achievement!</p>
              <p className="text-gray-500 mt-2">You unlocked this by submitting {reports.toLocaleString()} reports. Keep up the amazing work!</p>
              <button onClick={onClose} className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"> Awesome! </button>
            </>
          ) : (
             <>
              <p className="text-gray-700 text-lg">You're on your way to greatness!</p>
              <p className="text-gray-500 mt-2">Submit a total of <span className="font-bold text-gray-800">{reports.toLocaleString()} reports</span> to unlock the {level} award.</p>
               <button onClick={onClose} className="mt-6 w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"> Keep Contributing </button>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
// --- END: New Interactive Components ---


const AwardPage: React.FC = () => {
    const { user } = useAuth();
    const { complaints } = useComplaints();
    
    // --- START: State for interactivity ---
    const [selectedAward, setSelectedAward] = useState<any>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleAwardClick = (tier: any, isAchieved: boolean) => {
        setSelectedAward({ ...tier, isAchieved });
        if (isAchieved) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000); // Let confetti animation run
        }
    };

    const handleCloseModal = () => setSelectedAward(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleCloseModal();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    // --- END: State for interactivity ---
    
    const { leaderboard, currentUserData, userRank, userUploads } = useMemo(() => {
        const sortedContributors = [...MOCK_CONTRIBUTORS].sort((a, b) => b.uploads - a.uploads);
        if (!user) {
            return { 
                leaderboard: sortedContributors, 
                currentUserData: undefined, 
                userRank: -1, 
                userUploads: 0 
            };
        }

        const currentUserEntry = {
            name: `${user.firstName} ${user.lastName}`,
            location: user.address.split(',')[1]?.trim() || 'Hyderabad',
            uploads: complaints.length,
            avatarUrl: user.profilePictureUrl,
        };

        const otherContributors = MOCK_CONTRIBUTORS.filter(
            c => c.name.toLowerCase() !== currentUserEntry.name.toLowerCase()
        );

        const finalLeaderboard = [currentUserEntry, ...otherContributors].sort((a, b) => b.uploads - a.uploads);
        
        const cUserData = finalLeaderboard.find(c => c.name === currentUserEntry.name);
        const uRank = finalLeaderboard.findIndex(c => c.name === currentUserEntry.name) + 1;

        return {
            leaderboard: finalLeaderboard,
            currentUserData: cUserData,
            userRank: uRank,
            userUploads: cUserData?.uploads || 0,
        };
    }, [user, complaints]);

    const userAwardLevel = getAwardLevel(userUploads);

    const awardTiers: { level: AwardLevel; reports: number; color: string; icon: React.ReactNode; gradient: string }[] = [
        { level: AwardLevel.Bronze, reports: 2500, color: 'text-amber-500', icon: <TrophyIcon className="w-8 h-8" />, gradient: 'bg-gradient-to-br from-amber-400 to-yellow-500' },
        { level: AwardLevel.Silver, reports: 5000, color: 'text-slate-400', icon: <TrophyIcon className="w-8 h-8" />, gradient: 'bg-gradient-to-br from-slate-300 to-gray-400' },
        { level: AwardLevel.Gold, reports: 7500, color: 'text-yellow-400', icon: <TrophyIcon className="w-8 h-8" />, gradient: 'bg-gradient-to-br from-yellow-300 to-amber-400' },
        { level: AwardLevel.Platinum, reports: 10000, color: 'text-indigo-400', icon: <TrophyIcon className="w-8 h-8" />, gradient: 'bg-gradient-to-br from-indigo-400 to-purple-500' },
    ];
    
    const nextAward = awardTiers.find(tier => userUploads < tier.reports);
    const progressToNextAward = nextAward ? Math.min((userUploads / nextAward.reports) * 100, 100) : 100;

    const awardInfo = {
        [AwardLevel.Bronze]: { color: 'text-amber-500', name: 'Bronze Contributor' },
        [AwardLevel.Silver]: { color: 'text-slate-400', name: 'Silver Contributor' },
        [AwardLevel.Gold]: { color: 'text-yellow-400', name: 'Gold Contributor' },
        [AwardLevel.Platinum]: { color: 'text-indigo-400', name: 'Platinum Contributor' },
    };
    
    const podiumStyles = [
        { glow: 'shadow-yellow-400/50', ring: 'ring-yellow-400', text: 'text-yellow-400', medal: '🥇' }, // 1st
        { glow: 'shadow-slate-400/40', ring: 'ring-slate-400', text: 'text-slate-400', medal: '🥈' }, // 2nd
        { glow: 'shadow-amber-600/40', ring: 'ring-amber-600', text: 'text-amber-600', medal: '🥉' },  // 3rd
    ];
    
    return (
        <div className="space-y-10 relative">
            {showConfetti && <Confetti />}

            {/* Header */}
            <div>
                <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Your Achievements</h2>
                <p className="mt-2 text-lg text-gray-500">Track your progress, see your rank, and unlock new awards!</p>
            </div>

            {/* User Progress Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="relative w-36 h-36 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <circle className="text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (progressToNextAward / 100) * 283} strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out'}} />
                    </svg>
                    <img src={currentUserData?.avatarUrl} alt="You" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full object-cover border-4 border-gray-800" />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <p className="text-sm font-medium text-gray-400">GLOBAL RANK</p>
                    <p className="text-5xl font-bold tracking-tighter">#{userRank}</p>
                    <p className="mt-2 text-lg text-green-300 font-semibold">{userUploads.toLocaleString()} Reports Submitted</p>
                    <div className="mt-4">
                        <p className="text-sm text-gray-400">{nextAward ? `Next goal: ${nextAward.level} Award` : "You've reached the pinnacle!"}</p>
                         <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                          <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${progressToNextAward}%`, transition: 'width 1s ease-out' }}></div>
                        </div>
                    </div>
                </div>
                {userAwardLevel && (
                    <div className={`text-center flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-black/30 backdrop-blur-sm flex-shrink-0 ${awardInfo[userAwardLevel].color}`}>
                       <TrophyIcon className="w-16 h-16 drop-shadow-lg" />
                       <p className="font-bold text-xl">{awardInfo[userAwardLevel].name}</p>
                    </div>
                )}
            </div>

            {/* Leaderboard */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Global Leaderboard</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-center mb-6">
                    <PodiumCard contributor={leaderboard[1]} rank={2} style={podiumStyles[1]}/>
                    <PodiumCard contributor={leaderboard[0]} rank={1} style={podiumStyles[0]}/>
                    <PodiumCard contributor={leaderboard[2]} rank={3} style={podiumStyles[2]}/>
                </div>

                <ul className="space-y-3">
                    {leaderboard.slice(3).map((contributor, index) => {
                        const isCurrentUser = user && contributor.name === `${user.firstName} ${user.lastName}`;
                        return (
                            <li key={index} className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${isCurrentUser ? 'bg-gradient-to-r from-green-100 to-emerald-100 ring-2 ring-green-500' : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md'}`}>
                                <span className="text-lg font-bold text-gray-500 w-8 text-center">{index + 4}</span>
                                <img src={contributor.avatarUrl} alt={contributor.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white" />
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{contributor.name} {isCurrentUser && <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded-full ml-2">YOU</span>}</p>
                                    <p className="text-sm text-gray-500">{contributor.location}</p>
                                </div>
                                <div className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 text-xl">{contributor.uploads.toLocaleString()}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            
             {/* Award Tiers */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Achievement Unlocks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {awardTiers.map(tier => {
                        const isAchieved = userUploads >= tier.reports;
                        const progressToTier = isAchieved ? 100 : Math.round((userUploads / tier.reports) * 100);
                        return (
                            <div 
                                key={tier.level}
                                onClick={() => handleAwardClick(tier, isAchieved)}
                                className={`p-5 rounded-2xl text-center transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${isAchieved ? `${tier.gradient} text-white shadow-lg` : 'bg-gray-100 text-gray-600'}`}
                            >
                                <div className={`relative inline-block p-4 rounded-full ${isAchieved ? 'bg-white/20' : 'bg-gray-200'}`}>
                                    <span className={isAchieved ? 'text-white' : tier.color}>{tier.icon}</span>
                                    {!isAchieved && <LockClosedIcon className="w-5 h-5 absolute -top-1 -right-1 text-gray-400 bg-gray-100 rounded-full p-0.5" />}
                                </div>
                                <p className={`mt-3 text-xl font-bold ${isAchieved ? 'text-white' : 'text-gray-800'}`}>{tier.level}</p>
                                <p className={`text-sm ${isAchieved ? 'text-white/80' : 'text-gray-500'}`}>{tier.reports.toLocaleString()} reports</p>
                                {isAchieved ? (
                                    <div className="mt-3 flex items-center justify-center gap-1 font-semibold text-sm bg-white/20 rounded-full px-3 py-1">
                                        <CheckCircleIcon className="w-5 h-5"/> Unlocked
                                    </div>
                                ) : (
                                    <div className="mt-3">
                                        <div className="w-full bg-gray-300 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full" style={{width: `${progressToTier}%`}}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{progressToTier}% complete</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {selectedAward && <AwardModal award={selectedAward} onClose={handleCloseModal} />}
        </div>
    );
};

export default AwardPage;