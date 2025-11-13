interface CycleCounterProps {
  currentCycle: number;
  totalCycles: number;
}

export const CycleCounter = ({ currentCycle, totalCycles }: CycleCounterProps) => {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {Array.from({ length: totalCycles }).map((_, index) => (
          <div
            key={index}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${index < currentCycle ? "bg-pomodoro scale-110" : "bg-muted"}
            `}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Ciclo {currentCycle} de {totalCycles}
      </p>
    </div>
  );
};
