import React, { useState, useEffect } from 'react';
import { Waves, Play, SkipForward, ChevronRight, Sparkles, Star } from 'lucide-react';

const FeedingFrenzyGame = () => {
  const [gameState, setGameState] = useState('story');
  const [storyStep, setStoryStep] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [bubbles, setBubbles] = useState([]);

  // Generate floating bubbles for animations
  useEffect(() => {
    const newBubbles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 10 + Math.random() * 40
    }));
    setBubbles(newBubbles);
  }, []);

  const storyTexts = [
    {
      title: "In the Deep Blue Ocean...",
      text: "There was a small fish who dreamed of becoming the biggest fish in the ocean...",
      gradient: "from-blue-950 via-blue-800 to-cyan-700",
      fishEmoji: "🐠",
      accentColor: "cyan"
    },
    {
      title: "The Only Rule of the Sea",
      text: "Big fish eat small fish... but a smart small fish can grow and become the strongest!",
      gradient: "from-purple-950 via-blue-900 to-blue-700",
      fishEmoji: "🦈",
      accentColor: "purple"
    },
    {
      title: "Your Journey Begins Now",
      text: "Start small, eat smaller fish, avoid bigger ones... until you become the king of the ocean!",
      gradient: "from-cyan-950 via-teal-800 to-blue-700",
      fishEmoji: "🌊",
      accentColor: "teal"
    }
  ];

  const nextStory = () => {
    if (storyStep < storyTexts.length - 1) {
      setStoryStep(storyStep + 1);
    } else {
      setGameState('character-select');
    }
  };

  const skipStory = () => {
    setGameState('character-select');
  };

  const handlePlayClick = () => {
    if (playerName.trim()) {
      const friendGameUrl = 'YOUR_FRIEND_GAME_URL_HERE';
      const params = new URLSearchParams({
        playerName: playerName,
        character: 'hero1_left_closed'
      });
      
      // Uncomment when ready to redirect:
      // window.location.href = `${friendGameUrl}?${params.toString()}`;
      
      alert(`Ready to start!\n\nPlayer: ${playerName}\nCharacter: hero1_left_closed.png\n\nReplace 'YOUR_FRIEND_GAME_URL_HERE' with the actual game URL.`);
    }
  };

  if (gameState === 'story') {
    const currentStory = storyTexts[storyStep];
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentStory.gradient} flex items-center justify-center p-4 relative overflow-hidden`}>
        {/* Animated Bubbles */}
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="absolute rounded-full bg-white opacity-10 animate-float"
            style={{
              left: `${bubble.left}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`,
              bottom: '-50px'
            }}
          />
        ))}

        {/* Waves at bottom */}
        <div className="absolute bottom-0 left-0 right-0 opacity-20">
          <svg viewBox="0 0 1200 120" className="w-full">
            <path d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z" fill="white" opacity="0.3"/>
            <path d="M0,80 C200,50 400,100 600,80 C800,60 1000,110 1200,80 L1200,120 L0,120 Z" fill="white" opacity="0.2"/>
          </svg>
        </div>

        {/* Floating fish decorations */}
        <div className="absolute top-20 left-10 text-6xl opacity-30 animate-bounce" style={{ animationDuration: '3s' }}>
          🐠
        </div>
        <div className="absolute top-40 right-20 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          🐟
        </div>
        <div className="absolute bottom-40 left-20 text-7xl opacity-25 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
          🦈
        </div>

        <div className="max-w-3xl w-full relative z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border-2 border-white/30 relative overflow-hidden">
            {/* Sparkle effects */}
            <Sparkles className="absolute top-6 right-6 w-8 h-8 text-yellow-300 animate-pulse" />
            <Sparkles className="absolute bottom-6 left-6 w-6 h-6 text-cyan-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <Waves className="w-20 h-20 mx-auto text-cyan-300 animate-pulse drop-shadow-lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping" />
              </div>
              
              <div className="text-8xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
                {currentStory.fishEmoji}
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in leading-tight">
                {currentStory.title}
              </h1>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl" />
                <p className="text-2xl md:text-3xl text-white/95 leading-relaxed font-medium relative px-4">
                  {currentStory.text}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <button
                onClick={skipStory}
                className="px-8 py-4 bg-white/15 hover:bg-white/25 text-white text-lg font-semibold rounded-full flex items-center justify-center gap-3 transition-all transform hover:scale-105 border border-white/30 shadow-lg"
              >
                <SkipForward className="w-6 h-6" />
                Skip Story
              </button>
              <button
                onClick={nextStory}
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold text-lg rounded-full flex items-center justify-center gap-3 transition-all transform hover:scale-110 shadow-2xl border-2 border-white/50"
              >
                {storyStep < storyTexts.length - 1 ? 'Next Chapter' : 'Begin Adventure'}
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex justify-center gap-3 mt-8">
              {storyTexts.map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-500 ${
                    idx === storyStep 
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-400 w-12 h-4 shadow-lg' 
                      : 'bg-white/30 w-4 h-4'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(100vh) translateX(0); }
            50% { transform: translateY(-10vh) translateX(20px); }
          }
          .animate-float {
            animation: float linear infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
        `}</style>
      </div>
    );
  }

  if (gameState === 'character-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-cyan-800 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background bubbles */}
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="absolute rounded-full bg-white opacity-10 animate-float"
            style={{
              left: `${bubble.left}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`,
              bottom: '-50px'
            }}
          />
        ))}

        {/* Floating stars */}
        <Star className="absolute top-20 left-20 w-12 h-12 text-yellow-300 opacity-40 animate-pulse" />
        <Star className="absolute top-32 right-32 w-8 h-8 text-cyan-300 opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <Star className="absolute bottom-32 left-40 w-10 h-10 text-purple-300 opacity-35 animate-pulse" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute top-48 right-48 w-14 h-14 text-yellow-300 opacity-25 animate-pulse" style={{ animationDelay: '1.5s' }} />

        {/* Waves at bottom */}
        <div className="absolute bottom-0 left-0 right-0 opacity-15">
          <svg viewBox="0 0 1200 120" className="w-full">
            <path d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z" fill="white" opacity="0.3"/>
            <path d="M0,80 C200,50 400,100 600,80 C800,60 1000,110 1200,80 L1200,120 L0,120 Z" fill="white" opacity="0.2"/>
          </svg>
        </div>

        <div className="max-w-4xl w-full relative z-10">
          <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-12 md:p-16 shadow-2xl border-2 border-white/30 relative overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 animate-pulse" style={{ animationDuration: '3s' }} />
            
            {/* Sparkle decorations */}
            <Sparkles className="absolute top-8 right-8 w-10 h-10 text-yellow-300 animate-pulse" />
            <Sparkles className="absolute bottom-8 left-8 w-8 h-8 text-cyan-300 animate-pulse" style={{ animationDelay: '0.7s' }} />
            <Star className="absolute top-16 left-16 w-6 h-6 text-purple-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
            <Star className="absolute bottom-16 right-16 w-6 h-6 text-blue-300 animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10">
              {/* Title Section */}
              <div className="text-center mb-12">
                <div className="inline-block relative mb-6">
                  <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 mb-4 drop-shadow-2xl animate-pulse tracking-tight">
                    Feeding Frenzy
                  </h1>
                  <div className="absolute -top-6 -right-6 text-5xl animate-bounce">🐠</div>
                  <div className="absolute -bottom-3 -left-6 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🐟</div>
                </div>
                
                <div className="relative inline-block">
                  <p className="text-cyan-200 text-2xl md:text-3xl font-bold tracking-wide">
                    Enter Your Name & Dive Into Adventure
                  </p>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />
                </div>
              </div>
              
              {/* Character Display */}
              <div className="mb-12 flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/40 shadow-2xl">
                    <img 
                      src="assets/characters/hero1_left_closed.png" 
                      alt="Your Fish Character"
                      className="w-64 h-64 object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full px-6 py-2 font-bold text-lg shadow-lg animate-bounce">
                      Your Hero!
                    </div>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-12">
                <label className="block text-white text-2xl mb-5 text-center font-bold flex items-center justify-center gap-3">
                  <Sparkles className="w-7 h-7 text-yellow-300 animate-pulse" />
                  What's Your Name, Hero?
                  <Sparkles className="w-7 h-7 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </label>
                <div className="relative max-w-2xl mx-auto">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your epic name..."
                    className="w-full px-10 py-6 bg-white/15 border-3 border-cyan-400/60 rounded-full text-white placeholder-white/50 text-center text-2xl font-bold focus:outline-none focus:border-cyan-300 focus:bg-white/25 transition-all shadow-2xl backdrop-blur-xl"
                    maxLength={15}
                  />
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-7 h-7 text-yellow-300 animate-pulse" />
                  </div>
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <Star className="w-7 h-7 text-cyan-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
                
                {playerName && (
                  <div className="text-center mt-6 animate-fade-in">
                    <p className="text-cyan-200 text-xl font-semibold">
                      Welcome, <span className="text-yellow-300 font-bold text-2xl">{playerName}</span>! 🎉
                    </p>
                  </div>
                )}
              </div>

              {/* Play Button */}
              <button
                onClick={handlePlayClick}
                disabled={!playerName.trim()}
                className={`w-full max-w-2xl mx-auto block px-12 py-6 rounded-full font-black text-3xl transition-all transform relative overflow-hidden ${
                  playerName.trim()
                    ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white shadow-2xl hover:scale-105 border-4 border-white/60 animate-pulse-subtle'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed border-4 border-gray-600'
                }`}
              >
                {playerName.trim() && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                )}
                <div className="flex items-center justify-center gap-4 relative z-10">
                  <Play className="w-10 h-10 fill-current" />
                  START ADVENTURE
                  <Waves className="w-10 h-10" />
                </div>
              </button>
              
              {!playerName.trim() && (
                <p className="text-center text-cyan-300 text-lg mt-4 opacity-80 animate-pulse">
                  👆 Enter your name to begin your journey!
                </p>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(100vh) translateX(0); }
            50% { transform: translateY(-10vh) translateX(20px); }
          }
          .animate-float {
            animation: float linear infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          @keyframes pulse-subtle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          .animate-pulse-subtle {
            animation: pulse-subtle 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default FeedingFrenzyGame;