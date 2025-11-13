interface ModeSelectorProps {
  currentMode: "pomodoro" | "shortBreak" | "longBreak";
  onModeChange: (mode: "pomodoro" | "shortBreak" | "longBreak") => void;
  disabled: boolean;
}

export const ModeSelector = ({ currentMode, onModeChange, disabled }: ModeSelectorProps) => {
  const modes = [
    { id: "pomodoro" as const, label: "Pomodoro" },
    { id: "shortBreak" as const, label: "Pausa Curta" },
    { id: "longBreak" as const, label: "Pausa Longa" },
  ];

  return (
    <div className="flex gap-2 justify-center mb-12">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => !disabled && onModeChange(mode.id)}
          disabled={disabled}
          className={`
            px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300
            ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-muted"}
            ${
              currentMode === mode.id
                ? "bg-card shadow-sm border-b-2 border-foreground"
                : "text-muted-foreground"
            }
          `}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};
