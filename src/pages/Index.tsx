import { useState, useEffect, useRef } from "react";
import { Settings, BarChart3 } from "lucide-react";
import { TimerDisplay } from "@/components/timer/TimerDisplay";
import { ModeSelector } from "@/components/timer/ModeSelector";
import { ActionButton } from "@/components/timer/ActionButton";
import { CycleCounter } from "@/components/timer/CycleCounter";
import { SettingsModal, Settings as SettingsType } from "@/components/modals/SettingsModal";
import { StatsModal, Stats } from "@/components/modals/StatsModal";
import { toast } from "sonner";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";
type TimerState = "stopped" | "running" | "paused";

const DEFAULT_SETTINGS: SettingsType = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
  autoStart: false,
  alarmSound: "bell",
};

const Index = () => {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [state, setState] = useState<TimerState>("stopped");
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<Stats>({ todayCount: 0, weekCount: 0, totalCount: 0 });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings and stats from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("focototal-settings");
    const savedStats = localStorage.getItem("focototal-stats");
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setMinutes(parsed.pomodoroDuration);
    }
    
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save settings to localStorage
  const handleSaveSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
    localStorage.setItem("focototal-settings", JSON.stringify(newSettings));
    
    // Update timer if stopped
    if (state === "stopped") {
      switch (mode) {
        case "pomodoro":
          setMinutes(newSettings.pomodoroDuration);
          break;
        case "shortBreak":
          setMinutes(newSettings.shortBreakDuration);
          break;
        case "longBreak":
          setMinutes(newSettings.longBreakDuration);
          break;
      }
      setSeconds(0);
    }
    
    toast.success("Configurações salvas!");
  };

  // Update browser tab title
  useEffect(() => {
    if (state === "running") {
      document.title = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} - FocoTotal`;
    } else {
      document.title = "FocoTotal - Timer Pomodoro";
    }
  }, [minutes, seconds, state]);

  // Timer logic
  useEffect(() => {
    if (state === "running") {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            setMinutes((prevMin) => {
              if (prevMin === 0) {
                // Timer finished
                handleTimerComplete();
                return 0;
              }
              return prevMin - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state]);

  const playAlarm = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleTimerComplete = () => {
    setState("stopped");
    playAlarm();

    // Update stats if Pomodoro completed
    if (mode === "pomodoro") {
      const newStats = {
        todayCount: stats.todayCount + 1,
        weekCount: stats.weekCount + 1,
        totalCount: stats.totalCount + 1,
      };
      setStats(newStats);
      localStorage.setItem("focototal-stats", JSON.stringify(newStats));
      
      const newCycle = currentCycle + 1;
      setCurrentCycle(newCycle);

      // Check if it's time for long break
      if (newCycle >= settings.cyclesBeforeLongBreak) {
        toast.success("Pomodoro completo! Hora da pausa longa!");
        switchMode("longBreak");
        setCurrentCycle(0);
      } else {
        toast.success("Pomodoro completo! Hora da pausa curta!");
        switchMode("shortBreak");
      }
    } else {
      // Break completed, switch to Pomodoro
      toast.success("Pausa completa! Hora de focar!");
      switchMode("pomodoro");
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    let duration = 0;
    
    switch (newMode) {
      case "pomodoro":
        duration = settings.pomodoroDuration;
        break;
      case "shortBreak":
        duration = settings.shortBreakDuration;
        break;
      case "longBreak":
        duration = settings.longBreakDuration;
        break;
    }
    
    setMinutes(duration);
    setSeconds(0);

    if (settings.autoStart) {
      setState("running");
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
    if (state === "stopped") {
      switchMode(newMode);
    }
  };

  const handleStart = () => {
    setState("running");
  };

  const handlePause = () => {
    setState("paused");
  };

  const handleResume = () => {
    setState("running");
  };

  const handleReset = () => {
    setState("stopped");
    let duration = 0;
    
    switch (mode) {
      case "pomodoro":
        duration = settings.pomodoroDuration;
        break;
      case "shortBreak":
        duration = settings.shortBreakDuration;
        break;
      case "longBreak":
        duration = settings.longBreakDuration;
        break;
    }
    
    setMinutes(duration);
    setSeconds(0);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold">FocoTotal</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setStatsOpen(true)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Estatísticas"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Configurações"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mode Selector */}
        <ModeSelector
          currentMode={mode}
          onModeChange={handleModeChange}
          disabled={state !== "stopped"}
        />

        {/* Timer Display */}
        <div className="flex justify-center mb-8">
          <TimerDisplay minutes={minutes} seconds={seconds} mode={mode} />
        </div>

        {/* Action Button */}
        <ActionButton
          state={state}
          mode={mode}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
        />

        {/* Cycle Counter */}
        {mode === "pomodoro" && (
          <CycleCounter
            currentCycle={currentCycle}
            totalCycles={settings.cyclesBeforeLongBreak}
          />
        )}
      </div>

      {/* Modals */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
      />
      <StatsModal open={statsOpen} onOpenChange={setStatsOpen} stats={stats} />
    </div>
  );
};

export default Index;
