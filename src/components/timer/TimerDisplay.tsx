interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  mode: "pomodoro" | "shortBreak" | "longBreak";
}

export const TimerDisplay = ({ minutes, seconds, mode }: TimerDisplayProps) => {
  const formatTime = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getModeColor = () => {
    switch (mode) {
      case "pomodoro":
        return "text-pomodoro";
      case "shortBreak":
      case "longBreak":
        return "text-break";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className={`text-[120px] md:text-[140px] font-bold tracking-tight transition-colors duration-300 ${getModeColor()}`}>
      {formatTime(minutes, seconds)}
    </div>
  );
};
