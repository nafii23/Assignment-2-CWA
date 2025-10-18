"use client";

import { useState, useEffect, useRef } from "react";

const TimerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="9"/>
    <path d="M12 7v6l4 2"/>
    <path d="M12 4V2"/>
    <path d="M10 2h4"/>
  </svg>
);

const HintIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const ALL_CHALLENGES = [
  { id: 1, title: "Fix Syntax", description: "Add semicolons", challenge: "let x = 5\nlet y = 10", solution: "let x=5;let y=10;", category: "syntax", hint: "Add semicolons (;) at the end of each line" },
  { id: 2, title: "Debug Equality", description: "Fix = to ===", challenge: "if(user=null)", solution: "if(user===null)", category: "debug", hint: "Use === for comparison, not =" },
  { id: 3, title: "Loop 1-5", description: "Print 1 to 5", challenge: "// for loop", solution: "for(let i=1;i<=5;i++)", category: "loops", hint: "for(let i = 1; i <= 5; i++) { console.log(i); }" },
  { id: 4, title: "Loop 0-100", description: "Print 0 to 100", challenge: "// for loop", solution: "for(let i=0;i<=100;i++)", category: "loops", hint: "for(let i = 0; i <= 100; i++) { console.log(i); }" },
  { id: 5, title: "Loop 0-1000", description: "Print 0 to 1000", challenge: "// for loop", solution: "for(let i=0;i<=1000;i++)", category: "loops", hint: "for(let i = 0; i <= 1000; i++) { console.log(i); }" },
  { id: 6, title: "Filter Evens", description: "Filter even numbers", challenge: "const arr=[1,2,3,4,5,6]", solution: "arr.filter(n=>n%2===0)", category: "arrays", hint: "Use arr.filter(n => n % 2 === 0)" },
  { id: 7, title: "CSV to JSON", description: "Convert CSV format", challenge: "// name,age\\nJohn,25", solution: "csv.split('\\n').map(line=>line.split(','))", category: "data", hint: "Split by newline, then split each line by comma" },
  { id: 8, title: "Async Function", description: "Create async/await", challenge: "// fetch data", solution: "async function fetch(){const data=await fetch('/api');}", category: "async", hint: "Use: async function name() { const data = await fetch(...); }" },
  { id: 9, title: "Try-Catch", description: "Add error handling", challenge: "JSON.parse(input)", solution: "try{JSON.parse(input)}catch(e){}", category: "errors", hint: "Wrap in: try { ... } catch (e) { console.error(e); }" },
  { id: 10, title: "Format Code", description: "Fix formatting", challenge: "function calc(x,y){if(x>y){return x+y}}", solution: "function calc(x,y){if(x>y){return x+y;}}", category: "syntax", hint: "Add semicolons after return statements" },
];

export default function EscapeRoom() {
  const [gameMode, setGameMode] = useState<'setup' | 'playing' | 'completed'>('setup');
  const [customTime, setCustomTime] = useState(10);
  const [numStages, setNumStages] = useState(3);
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([1, 3, 6]);
  const [difficulty, setDifficulty] = useState('medium');
  const [backgroundTheme, setBackgroundTheme] = useState('dark');
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [message, setMessage] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [completedTime, setCompletedTime] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [savedId, setSavedId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setGameMode('completed');
            const elapsed = startTime;
            setCompletedTime(elapsed);
            setMessage("⏰ Time's up! Game over!");
            generateHTML(selectedChallenges.slice(0, numStages).length, elapsed);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, timeLeft]);

  const toggleChallenge = (id: number) => {
    setSelectedChallenges(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const startCustomGame = () => {
    const challenges = selectedChallenges.slice(0, numStages);
    if (challenges.length === 0) {
      setMessage("⚠️ Select at least one challenge!");
      return;
    }
    if (challenges.length < numStages) {
      setMessage(`⚠️ Not enough challenges selected! Need ${numStages}, have ${challenges.length}`);
      return;
    }
    
    const gameStartTime = customTime * 60;
    setStartTime(gameStartTime);
    setTimeLeft(gameStartTime);
    setIsRunning(true);
    setGameMode('playing');
    setCurrentStage(0);
    setGameWon(false);
    setAttemptCount(0);
    setShowHint(false);
    setCompletedTime(0);
    setGeneratedHTML("");
    setSavedId("");
    
    const firstChallenge = ALL_CHALLENGES.find(c => c.id === challenges[0]);
    setUserCode(firstChallenge?.challenge || "");
    setMessage(`🎮 Game started! Solve ${challenges.length} challenges in ${customTime} minutes!`);
  };

  const startPresetGame = (preset: 'easy' | 'medium' | 'hard') => {
    const presets = {
      easy: { time: 15, challenges: [1, 3] },
      medium: { time: 10, challenges: [1, 2, 4, 6] },
      hard: { time: 8, challenges: [1, 2, 5, 7, 8, 9] }
    };
    const config = presets[preset];
    
    setCustomTime(config.time);
    setNumStages(config.challenges.length);
    setSelectedChallenges(config.challenges);
    setDifficulty(preset);
    
    const gameStartTime = config.time * 60;
    setStartTime(gameStartTime);
    setTimeLeft(gameStartTime);
    setIsRunning(true);
    setGameMode('playing');
    setCurrentStage(0);
    setGameWon(false);
    setAttemptCount(0);
    setShowHint(false);
    setCompletedTime(0);
    setGeneratedHTML("");
    setSavedId("");
    
    const firstChallenge = ALL_CHALLENGES.find(c => c.id === config.challenges[0]);
    setUserCode(firstChallenge?.challenge || "");
    setMessage(`🎮 ${preset.toUpperCase()} mode started! Solve ${config.challenges.length} challenges in ${config.time} minutes!`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const normalizeCode = (code: string) => {
    return code.replace(/\s+/g, '').replace(/;/g, '').trim().toLowerCase();
  };

  const checkSolution = () => {
    if (!isRunning) {
      setMessage("⚠️ Game is not active!");
      return;
    }
    
    const challenges = selectedChallenges.slice(0, numStages);
    const currentChallengeId = challenges[currentStage];
    const challenge = ALL_CHALLENGES.find(c => c.id === currentChallengeId);
    if (!challenge) return;
    
    const normalized = normalizeCode(userCode);
    const expected = normalizeCode(challenge.solution);

    if (normalized.includes(expected) || expected.includes(normalized)) {
      setMessage(`✅ Stage ${currentStage + 1}/${challenges.length} complete!`);
      setAttemptCount(0);
      setShowHint(false);
      
      if (currentStage === challenges.length - 1) {
        const timeTaken = startTime - timeLeft;
        setCompletedTime(timeTaken);
        setGameWon(true);
        setIsRunning(false);
        setGameMode('completed');
        setMessage(`🎉 You escaped! Time: ${formatTime(timeTaken)}`);
        generateHTML(challenges.length, timeTaken);
      } else {
        setTimeout(() => {
          const nextStage = currentStage + 1;
          setCurrentStage(nextStage);
          const nextChallengeId = challenges[nextStage];
          const nextChallenge = ALL_CHALLENGES.find(c => c.id === nextChallengeId);
          setUserCode(nextChallenge?.challenge || "");
          setMessage(`🔓 Stage ${nextStage + 1} unlocked!`);
        }, 1500);
      }
    } else {
      setAttemptCount(prev => prev + 1);
      
      if (attemptCount + 1 >= 3) {
        setMessage(`⏭️ 3 attempts used! Moving to next stage...`);
        setAttemptCount(0);
        setShowHint(false);
        
        setTimeout(() => {
          if (currentStage < challenges.length - 1) {
            const nextStage = currentStage + 1;
            setCurrentStage(nextStage);
            const nextChallengeId = challenges[nextStage];
            const nextChallenge = ALL_CHALLENGES.find(c => c.id === nextChallengeId);
            setUserCode(nextChallenge?.challenge || "");
            setMessage(`Stage ${nextStage + 1} started (previous skipped)`);
          } else {
            const timeTaken = startTime - timeLeft;
            setCompletedTime(timeTaken);
            setGameWon(true);
            setIsRunning(false);
            setGameMode('completed');
            setMessage(`Game complete! Time: ${formatTime(timeTaken)} (some stages skipped)`);
            generateHTML(challenges.length, timeTaken);
          }
        }, 1500);
      } else {
        setMessage(`❌ Not quite! Attempt ${attemptCount + 1}/3 - Try again or use hint!`);
      }
    }
  };

  const generateHTML = (stages: number, time: number) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Escape Room Result - Student 22206653</title>
  <style>
    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; background: rgba(0,0,0,0.3); padding: 40px; border-radius: 20px; }
    h1 { font-size: 3em; text-align: center; margin: 0 0 20px 0; }
    .stats { display: flex; justify-content: space-around; margin: 30px 0; }
    .stat { text-align: center; }
    .stat-value { font-size: 3em; font-weight: bold; color: #4ade80; }
    .badge { background: #4ade80; color: black; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 10px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏆 Escape Room Complete!</h1>
    <div style="text-align: center;">
      <span class="badge">Student: 22206653</span>
      <span class="badge">${difficulty.toUpperCase()} Mode</span>
    </div>
    <div class="stats">
      <div class="stat">
        <div>Stages</div>
        <div class="stat-value">${stages}</div>
      </div>
      <div class="stat">
        <div>Time</div>
        <div class="stat-value">${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}</div>
      </div>
    </div>
    <p style="text-align: center; font-size: 1.5em;">Congratulations on escaping!</p>
  </div>
</body>
</html>`;
    setGeneratedHTML(html);
  };

  const saveToDatabase = async () => {
    if (!gameWon) {
      setMessage("❌ Complete the game first before saving!");
      return;
    }
    if (savedId) {
      setMessage("⚠️ Already saved to database!");
      return;
    }
    
    setIsSaving(true);
    setMessage("💾 Saving to database...");
    
    try {
      const response = await fetch('/api/escape-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Escape Room - ${difficulty.toUpperCase()} - ${new Date().toLocaleDateString()}`,
          htmlContent: generatedHTML,
          timeSpent: completedTime,
          stagesCompleted: numStages,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const shortId = data.id.substring(0, 8);
        setSavedId(data.id);
        setMessage(`✅ Successfully saved!\n📁 Record ID: ${shortId}...\n⏱️ Time: ${completedTime}s | 📝 Stages: ${numStages}`);
      } else {
        const errorData = await response.json();
        setMessage(`❌ Failed to save: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage("❌ Database connection error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetGame = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setGameMode('setup');
    setGameWon(false);
    setCurrentStage(0);
    setTimeLeft(0);
    setStartTime(0);
    setMessage("");
    setUserCode("");
    setGeneratedHTML("");
    setAttemptCount(0);
    setShowHint(false);
    setSavedId("");
    setCompletedTime(0);
  };

  const getThemeColors = () => {
    const themes = {
      dark: { bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', accent: '#667eea' },
      blue: { bg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', accent: '#60a5fa' },
      purple: { bg: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)', accent: '#c084fc' },
      green: { bg: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)', accent: '#34d399' },
    };
    return themes[backgroundTheme as keyof typeof themes] || themes.dark;
  };

  const theme = getThemeColors();

  if (gameMode === 'setup') {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, padding: '40px', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '3em', marginBottom: '10px', textShadow: '0 0 20px rgba(102, 126, 234, 0.5)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '15px' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Escape Room Challenge
            </h1>
            <p style={{ fontSize: '1.2em', opacity: 0.9 }}>Student: 22206653 | Customize Your Game</p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '15px', marginBottom: '30px', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
            <h2 style={{ marginTop: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '10px' }}>
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
              Quick Start (Presets)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <button onClick={() => startPresetGame('easy')} style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', color: '#000', padding: '20px', border: 'none', borderRadius: '10px', fontSize: '1.1em', fontWeight: 'bold', cursor: 'pointer' }}>
                Easy<br/><span style={{ fontSize: '0.9em', opacity: 0.8 }}>15min | 2 stages</span>
              </button>
              <button onClick={() => startPresetGame('medium')} style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#000', padding: '20px', border: 'none', borderRadius: '10px', fontSize: '1.1em', fontWeight: 'bold', cursor: 'pointer' }}>
                Medium<br/><span style={{ fontSize: '0.9em', opacity: 0.8 }}>10min | 4 stages</span>
              </button>
              <button onClick={() => startPresetGame('hard')} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', padding: '20px', border: 'none', borderRadius: '10px', fontSize: '1.1em', fontWeight: 'bold', cursor: 'pointer' }}>
                Hard<br/><span style={{ fontSize: '0.9em', opacity: 0.8 }}>8min | 6 stages</span>
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '15px', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
            <h2 style={{ marginTop: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '10px' }}>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M1 12h6m6 0h6M4.8 4.8l4.2 4.2m0 6l-4.2 4.2"/>
              </svg>
              Custom Game Setup
            </h2>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '1.1em' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <circle cx="12" cy="13" r="9"/>
                  <path d="M12 7v6l4 2"/>
                </svg>
                Timer: {customTime} minutes
              </label>
              <input type="range" min="1" max="30" value={customTime} onChange={(e) => setCustomTime(Number(e.target.value))} style={{ width: '100%', height: '8px' }} />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '1.1em' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                Number of Stages: {numStages}
              </label>
              <input type="range" min="1" max="10" value={numStages} onChange={(e) => setNumStages(Number(e.target.value))} style={{ width: '100%', height: '8px' }} />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '1.1em' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                Background Theme
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['dark', 'blue', 'purple', 'green'].map(t => (
                  <button key={t} onClick={() => setBackgroundTheme(t)} style={{ padding: '10px 20px', background: backgroundTheme === t ? theme.accent : 'rgba(255,255,255,0.1)', color: '#fff', border: '2px solid ' + (backgroundTheme === t ? theme.accent : 'transparent'), borderRadius: '8px', cursor: 'pointer', textTransform: 'capitalize' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '1.1em' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Select Challenges (Choose {numStages})
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', maxHeight: '300px', overflowY: 'auto', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                {ALL_CHALLENGES.map(challenge => (
                  <div key={challenge.id} onClick={() => toggleChallenge(challenge.id)} style={{ padding: '15px', background: selectedChallenges.includes(challenge.id) ? theme.accent : 'rgba(255,255,255,0.05)', border: '2px solid ' + (selectedChallenges.includes(challenge.id) ? theme.accent : 'transparent'), borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{challenge.title}</div>
                    <div style={{ fontSize: '0.85em', opacity: 0.8 }}>{challenge.description}</div>
                    <div style={{ fontSize: '0.75em', marginTop: '5px', opacity: 0.6 }}>#{challenge.category}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.9em', opacity: 0.7 }}>Selected: {selectedChallenges.length} | Need: {numStages}</div>
            </div>

            {message && <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.2)', border: '2px solid #ef4444', borderRadius: '8px', marginBottom: '20px' }}>{message}</div>}

            <button onClick={startCustomGame} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, ' + theme.accent + ' 0%, ' + theme.accent + ' 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1.2em', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '10px' }}>
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
              Start Custom Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'playing') {
    const challenges = selectedChallenges.slice(0, numStages);
    const currentChallengeId = challenges[currentStage];
    const challenge = ALL_CHALLENGES.find(c => c.id === currentChallengeId);

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url(https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', padding: '20px', color: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'rgba(0,0,0,0.7)', borderRadius: '20px', padding: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(102, 126, 234, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2em' }}>Escape Room</h1>
              <p style={{ margin: '5px 0', opacity: 0.8 }}>Stage {currentStage + 1}/{challenges.length}</p>
            </div>
            <button onClick={resetGame} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Quit</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '2.5em', color: timeLeft < 60 ? '#ef4444' : '#4ade80', fontWeight: 'bold', padding: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '15px', marginBottom: '20px' }}>
            <TimerIcon />
            {formatTime(timeLeft)}
          </div>

          {message && <div style={{ padding: '15px', background: 'rgba(102, 126, 234, 0.2)', border: '2px solid #667eea', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>{message}</div>}

          {challenge && (
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '25px', borderRadius: '15px' }}>
              <h2 style={{ color: '#667eea' }}>{challenge.title}</h2>
              <p style={{ opacity: 0.9, marginBottom: '20px' }}>{challenge.description}</p>
              
              <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} placeholder="Write your code here..." style={{ width: '100%', minHeight: '200px', background: 'rgba(0,0,0,0.7)', color: '#4ade80', border: '2px solid #667eea', borderRadius: '10px', padding: '15px', fontFamily: 'monospace', fontSize: '14px' }} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={checkSolution} disabled={!isRunning} style={{ flex: 1, padding: '12px 30px', background: isRunning ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' : '#6b7280', color: isRunning ? '#000' : '#9ca3af', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isRunning ? 'pointer' : 'not-allowed' }}>Submit Answer ({attemptCount}/3)</button>
                <button onClick={() => setShowHint(!showHint)} style={{ padding: '12px 20px', background: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24', border: '2px solid #fbbf24', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HintIcon /> {showHint ? 'Hide' : 'Hint'}
                </button>
              </div>

              {showHint && <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(251, 191, 36, 0.2)', border: '2px solid #fbbf24', borderRadius: '8px' }}>💡 <strong>Hint:</strong> {challenge.hint}</div>}

              <div style={{ marginTop: '20px', display: 'flex', gap: '5px' }}>
                {challenges.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: '8px', background: i < currentStage ? '#4ade80' : i === currentStage ? '#fbbf24' : 'rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, padding: '20px', color: '#fff' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'rgba(0,0,0,0.4)', borderRadius: '20px', padding: '30px', textAlign: 'center', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
        <h1 style={{ fontSize: '3em', marginBottom: '20px', textShadow: '0 0 20px rgba(102, 126, 234, 0.5)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '15px' }}>
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
          </svg>
          You Escaped!
        </h1>
        <p style={{ fontSize: '1.5em', marginBottom: '30px' }}>Time: {formatTime(completedTime)} | Stages: {numStages}</p>
        
        {message && (
          <div style={{ padding: '15px', background: message.includes('✅') ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)', border: '2px solid ' + (message.includes('✅') ? '#4ade80' : '#ef4444'), borderRadius: '8px', marginBottom: '20px', whiteSpace: 'pre-line', textAlign: 'left' }}>
            {message}
          </div>
        )}

        {savedId && (
          <div style={{ background: 'rgba(74, 222, 128, 0.2)', border: '2px solid #4ade80', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '10px' }}>✅ Successfully Saved to Database!</div>
            <div style={{ fontSize: '0.95em', opacity: 0.9 }}>
              <div style={{ marginBottom: '8px' }}><strong>📁 Full Record ID:</strong></div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9em', wordBreak: 'break-all' }}>{savedId}</div>
              <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><strong>⏱️ Time:</strong> {formatTime(completedTime)}</div>
                <div><strong>📝 Stages:</strong> {numStages}</div>
                <div><strong>🎮 Difficulty:</strong> {difficulty.toUpperCase()}</div>
                <div><strong>📅 Date:</strong> {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}
        
        {generatedHTML && (
          <div style={{ textAlign: 'left', marginTop: '30px' }}>
            <h2>Generated HTML</h2>
            <textarea value={generatedHTML} readOnly style={{ width: '100%', minHeight: '300px', background: 'rgba(0,0,0,0.5)', color: '#4ade80', border: '2px solid #667eea', borderRadius: '10px', padding: '15px', fontFamily: 'monospace', fontSize: '12px' }} />
            
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigator.clipboard.writeText(generatedHTML)} style={{ padding: '12px 30px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy HTML
              </button>
              <button onClick={saveToDatabase} disabled={!!savedId || isSaving} style={{ padding: '12px 30px', background: savedId || isSaving ? '#6b7280' : '#4ade80', color: savedId || isSaving ? '#9ca3af' : '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: savedId || isSaving ? 'not-allowed' : 'pointer', boxShadow: savedId || isSaving ? 'none' : '0 4px 15px rgba(74, 222, 128, 0.3)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                {isSaving ? 'Saving...' : savedId ? 'Saved' : 'Save to DB'}
              </button>
              <button onClick={resetGame} style={{ padding: '12px 30px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                New Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}