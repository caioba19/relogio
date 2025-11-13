import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  state: "stopped" | "running" | "paused";
  mode: "pomodoro" | "shortBreak" | "longBreak";
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const ActionButton = ({
  state,
  mode,
  onStart,
  onPause,
  onResume,
  onReset,
}: ActionButtonProps) => {
  const getModeColor = () => {
    switch (mode) {
      case "pomodoro":
        return "bg-pomodoro hover:bg-pomodoro/90 text-pomodoro-foreground";
      case "shortBreak":
      case "longBreak":
        return "bg-break hover:bg-break/90 text-break-foreground";
      default:
        return "";
    }
  };

  const renderButton = () => {
    switch (state) {
      case "stopped":
        return (
          <Button
            onClick={onStart}
            size="lg"
            className={`w-full max-w-xs h-16 text-xl font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${getModeColor()}`}
          >
            COMEÇAR
          </Button>
        );
      case "running":
        return (
          <Button
            onClick={onPause}
            size="lg"
            variant="outline"
            className="w-full max-w-xs h-16 text-xl font-semibold rounded-2xl border-2 transition-all duration-300 hover:bg-muted"
          >
            PAUSAR
          </Button>
        );
      case "paused":
        return (
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              onClick={onResume}
              size="lg"
              className={`w-full h-16 text-xl font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${getModeColor()}`}
            >
              CONTINUAR
            </Button>
            <Button
              onClick={onReset}
              size="sm"
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              RESETAR
            </Button>
          </div>
        );
    }
  };

  return <div className="flex justify-center mt-8">{renderButton()}</div>;
};
