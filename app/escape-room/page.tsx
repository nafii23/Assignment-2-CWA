"use client";

import { useState, useEffect, useRef } from "react";

// SVG Icons as components
const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="11" width="14" height="10" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UnlockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="11" width="14" height="10" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
  </svg>
);

const TimerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="13" r="9"/>
    <path d="M12 7v6l4 2"/>
    <path d="M9 2h6"/>
  </svg>
);

const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const HintIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const BugIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3v2M16 3v2M3 8h2M3 16h2M19 8h2M19 16h2"/>
    <path d="M8 14v-3a4 4 0 0 1 8 0v3"/>
    <rect x="8" y="14" width="8" height="7" rx="2"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const DIFFICULTY_MODES = {
  easy: {
    name: "Easy Mode",
    time: 15,
    stages: [
      {
        id: 1,
        title: "Fix Syntax",
        description: "Add missing semicolons",
        challenge: "let x = 5\nlet y = 10\nconsole.log(x + y)",
        solution: "let x = 5;\nlet y = 10;\nconsole.log(x + y);",
        hint: "Every statement needs a semicolon"
      },
      {
        id: 2,
        title: "Simple Loop",
        description: "Print numbers 1 to 5",
        challenge: "// Write a for loop here",
        solution: "for(let i=1;i<=5;i++){console.log(i);}",
        hint: "Use: for (let i = 1; i <= 5; i++)"
      }
    ]
  },
  medium: {
    name: "Medium Mode",
    time: 10,
    stages: [
      {
        id: 1,
        title: "Format Code",
        description: "Fix indentation and formatting",
        challenge: "function calculate(x,y){if(x>y){return x+y}else{return x-y}}",
        solution: "function calculate(x,y){if(x>y){return x+y;}else{return x-y;}}",
        hint: "Add spaces and semicolons"
      },
      {
        id: 2,
        title: "Debug Code",
        description: "Fix the comparison operator",
        challenge: "if (user = null) { return 'error'; }",
        solution: "if(user===null){return'error';}",
        hint: "Use === instead of ="
      },
      {
        id: 3,
        title: "Generate Numbers",
        description: "Create array 0 to 100",
        challenge: "// Write code here",
        solution: "for(let i=0;i<=100;i++){console.log(i);}",
        hint: "Loop from 0 to 100"
      },
      {
        id: 4,
        title: "Array Operation",
        description: "Filter even numbers",
        challenge: "const arr = [1,2,3,4,5,6];",
        solution: "arr.filter(n=>n%2===0)",
        hint: "Use filter with modulo"
      }
    ]
  },
  hard: {
    name: "Hard Mode",
    time: 8,
    stages: [
      {
        id: 1,
        title: "Format Code",
        description: "Fix all formatting",
        challenge: "function calculate(x,y){if(x>y){return x+y}else{return x-y}}",
        solution: "function calculate(x,y){if(x>y){return x+y;}else{return x-y;}}",
        hint: "Proper indentation"
      },
      {
        id: 2,
        title: "Debug Errors",
        description: "Fix 3 bugs",
        challenge: "function getData(id){const user=db.find(id);if(user=null){return'not found'}}",
        solution: "if(user===null)",
        hint: "Check equality operator"
      },
      {
        id: 3,
        title: "Generate Numbers",
        description: "0 to 1000",
        challenge: "// Code here",
        solution: "for(let i=0;i<=1000;i++){console.log(i);}",
        hint: "for loop 0 to 1000"
      },
      {
        id: 4,
        title: "CSV to JSON",
        description: "Convert data format",
        challenge: "// Input: name,age\\nJohn,25",
        solution: "csv.split('\\n').map(line=>line.split(','))",
        hint: "Split by newline"
      },
      {
        id: 5,
        title: "Async Function",
        description: "Create async/await",
        challenge: "// Fetch user data",
        solution: "async function fetchUser(){const data=await fetch('/api');return data.json();}",
        hint: "Use async/await"
      },
      {
        id: 6,
        title: "Error Handling",
        description: "Add try-catch",
        challenge: "function process(){JSON.parse(input);}",
        solution: "try{JSON.parse(input);}catch(e){console.error(e);}",
        hint: "Wrap in try-catch"
      }
    ]
  }
};

export default function EscapeRoom() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [message, setMessage] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [completedTime, setCompletedTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setMessage("Time's up! You're trapped forever!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const startGame = (mode: string) => {
    const modeData = DIFFICULTY_MODES[mode as keyof typeof DIFFICULTY_MODES];
    setSelectedMode(mode);
    setTimeLeft(modeData.time * 60);
    setIsRunning(true);
    setCurrentStage(0);
    setUserCode(modeData.stages[0].challenge);
    setMessage(`${modeData.name} started! Solve ${modeData.stages.length} challenges!`);
    setGameWon(false);
    setShowHint(false);
    setGeneratedHTML("");
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
    if (!selectedMode) return;
    
    const modeData = DIFFICULTY_MODES[selectedMode as keyof typeof DIFFICULTY_MODES];
    const stage = modeData.stages[currentStage];
    const normalized = normalizeCode(userCode);
    const expected = normalizeCode(stage.solution);

    if (normalized.includes(expected) || expected.includes(normalized)) {
      setMessage(`Stage ${currentStage + 1} complete!`);
      
      if (currentStage === modeData.stages.length - 1) {
        const totalTime = modeData.time * 60;
        const timeTaken = totalTime - timeLeft;
        setCompletedTime(timeTaken);
        setGameWon(true);
        setIsRunning(false);
        setMessage(`You escaped in ${formatTime(timeTaken)}!`);
        generateEscapeRoomHTML(selectedMode, modeData.stages.length, timeTaken);
      } else {
        setTimeout(() => {
          const nextStage = currentStage + 1;
          setCurrentStage(nextStage);
          setUserCode(modeData.stages[nextStage].challenge);
          setMessage(`Stage ${nextStage + 1} unlocked!`);
          setShowHint(false);
        }, 1500);
      }
    } else {
      setMessage("Not quite right. Try again or use a hint!");
    }
  };

  const saveToDatabase = async () => {
    if (!gameWon || !generatedHTML) {
      setMessage("Complete the game first!");
      return;
    }

    try {
      const response = await fetch('/api/escape-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Escape Room - ${selectedMode?.toUpperCase()} - ${new Date().toLocaleDateString()}`,
          htmlContent: generatedHTML,
          timeSpent: completedTime,
          stagesCompleted: DIFFICULTY_MODES[selectedMode as keyof typeof DIFFICULTY_MODES].stages.length,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Saved successfully! ID: ${data.id.substring(0, 8)}...`);
      }
    } catch (error) {
      setMessage("Database error");
    }
  };

  const generateEscapeRoomHTML = (mode: string, stages: number, time: number) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Escape Room - ${mode.toUpperCase()} - Student 22206653</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); min-height: 100vh; color: #fff; padding: 20px; }
    .container { max-width: 900px; margin: 0 auto; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }
    h1 { font-size: 3em; text-align: center; margin-bottom: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .badge { display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 10px 20px; border-radius: 25px; font-weight: bold; margin: 10px 5px; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0; }
    .stat-box { text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); }
    .stat-value { font-size: 2.5em; font-weight: bold; background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .celebration { text-align: center; padding: 40px; background: linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%); border-radius: 15px; margin: 20px 0; border: 2px solid #4ade80; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); opacity: 0.7; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎮 Escape Room Challenge</h1>
    <div style="text-align: center; margin-bottom: 30px;">
      <span class="badge">${mode.toUpperCase()} MODE</span>
      <span class="badge">Student: 22206653</span>
    </div>
    
    <div class="stats">
      <div class="stat-box">
        <div style="opacity: 0.8; margin-bottom: 10px;">Stages Completed</div>
        <div class="stat-value">${stages}</div>
      </div>
      <div class="stat-box">
        <div style="opacity: 0.8; margin-bottom: 10px;">Time Taken</div>
        <div class="stat-value">${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}</div>
      </div>
      <div class="stat-box">
        <div style="opacity: 0.8; margin-bottom: 10px;">Difficulty</div>
        <div class="stat-value">${mode.toUpperCase()}</div>
      </div>
    </div>

    <div class="celebration">
      <h2 style="font-size: 2.5em; margin-bottom: 20px; color: #4ade80;">🏆 Congratulations!</h2>
      <p style="font-size: 1.3em; margin: 15px 0;">You successfully escaped the ${mode} mode challenge!</p>
      <p style="font-size: 1.1em; opacity: 0.9;">All coding puzzles solved. Great work!</p>
    </div>

    <div class="footer">
      <p>Generated: ${new Date().toLocaleString()}</p>
      <p style="margin-top: 10px;">CSE3CWA Assignment 2 - La Trobe University</p>
    </div>
  </div>
</body>
</html>`;
    setGeneratedHTML(html);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHTML);
    setMessage("HTML copied to clipboard!");
  };

  const resetGame = () => {
    setSelectedMode(null);
    setIsRunning(false);
    setGameWon(false);
    setCurrentStage(0);
    setMessage("");
    setUserCode("");
    setGeneratedHTML("");
  };

  // Background SVG pattern
  const EscapeRoomBackground = () => (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.1 }}>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>
  );

  if (!selectedMode) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', padding: '40px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <EscapeRoomBackground />
        
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <LockIcon />
              <h1 style={{ fontSize: '3.5em', margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Escape Room Challenge
              </h1>
              <CodeIcon />
            </div>
            <p style={{ fontSize: '1.3em', opacity: 0.9 }}>Student: 22206653 | Choose Your Difficulty</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {Object.entries(DIFFICULTY_MODES).map(([key, mode]) => (
              <div key={key} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '40px', textAlign: 'center', border: '2px solid rgba(255,255,255,0.1)', transition: 'all 0.3s', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = key === 'easy' ? '#4ade80' : key === 'medium' ? '#fbbf24' : '#ef4444'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <div style={{ marginBottom: '20px' }}>
                  {key === 'easy' ? <UnlockIcon /> : <LockIcon />}
                </div>
                <h2 style={{ fontSize: '2em', marginBottom: '20px', color: key === 'easy' ? '#4ade80' : key === 'medium' ? '#fbbf24' : '#ef4444' }}>
                  {mode.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.2em', marginBottom: '15px', opacity: 0.9 }}>
                  <TimerIcon />
                  <span>{mode.time} minutes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.2em', marginBottom: '30px', opacity: 0.9 }}>
                  <BugIcon />
                  <span>{mode.stages.length} challenges</span>
                </div>
                <button onClick={() => startGame(key)} style={{ background: key === 'easy' ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' : key === 'medium' ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', fontSize: '1.1em', padding: '15px 40px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <PlayIcon />
                  Start Challenge
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const modeData = DIFFICULTY_MODES[selectedMode as keyof typeof DIFFICULTY_MODES];
  const stage = modeData.stages[currentStage];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', padding: '20px', color: '#eee', position: 'relative', overflow: 'hidden' }}>
      <EscapeRoomBackground />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <CodeIcon />
            <div>
              <h1 style={{ margin: '0', color: '#667eea', fontSize: '2em' }}>Escape Room</h1>
              <p style={{ color: '#aaa', margin: '5px 0', fontSize: '0.9em' }}>{modeData.name} | Student: 22206653</p>
            </div>
          </div>
          <button onClick={resetGame} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Change Mode
          </button>
        </div>

        {isRunning && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', fontSize: '2.5em', color: timeLeft < 60 ? '#ef4444' : '#4ade80', fontWeight: 'bold', margin: '20px 0', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '15px', border: `2px solid ${timeLeft < 60 ? '#ef4444' : '#4ade80'}` }}>
            <TimerIcon />
            {formatTime(timeLeft)}
          </div>
        )}

        {message && (
          <div style={{ padding: '15px', margin: '15px 0', borderRadius: '10px', fontWeight: 'bold', textAlign: 'center', background: 'rgba(102, 126, 234, 0.2)', border: '2px solid #667eea', fontSize: '1.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {gameWon ? <CheckIcon /> : message.includes('complete') ? <CheckIcon /> : <HintIcon />}
            {message}
          </div>
        )}

        {isRunning && !gameWon && (
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '15px', margin: '20px 0', border: '2px solid #667eea' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <BugIcon />
              <h2 style={{ color: '#667eea', margin: 0 }}>{stage.title}</h2>
            </div>
            <p style={{ fontSize: '16px', marginBottom: '20px', opacity: 0.9 }}>{stage.description}</p>
            <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} style={{ width: '100%', minHeight: '220px', background: 'rgba(0,0,0,0.5)', color: '#4ade80', border: '2px solid #667eea', borderRadius: '10px', padding: '15px', fontFamily: '"Courier New", monospace', fontSize: '14px', resize: 'vertical' }} spellCheck={false} />
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={checkSolution} style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', color: '#000', padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckIcon />
                Submit Answer
              </button>
              <button onClick={() => { setShowHint(!showHint); setMessage(showHint ? "" : `Hint: ${stage.hint}`); }} style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#000', padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HintIcon />
                {showHint ? 'Hide' : 'Show'} Hint
              </button>
            </div>
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Progress: Stage {currentStage + 1} of {modeData.stages.length}</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                {modeData.stages.map((_, i) => (
                  <div key={i} style={{ width: '30px', height: '8px', background: i < currentStage ? '#4ade80' : i === currentStage ? '#fbbf24' : 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameWon && generatedHTML && (
          <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '25px', borderRadius: '15px', marginTop: '20px', border: '2px solid #4ade80' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <CheckIcon />
              <h2 style={{ color: '#4ade80', margin: 0 }}>Generated HTML Output</h2>
            </div>
            <textarea value={generatedHTML} readOnly style={{ width: '100%', minHeight: '300px', background: 'rgba(0,0,0,0.5)', color: '#4ade80', border: '2px solid #4ade80', borderRadius: '10px', padding: '15px', fontFamily: '"Courier New", monospace', fontSize: '12px' }} />
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={copyToClipboard} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Copy HTML
              </button>
              <button onClick={saveToDatabase} style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', color: '#000', padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Save to Database
              </button>
              <button onClick={resetGame} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                New Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}