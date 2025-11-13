import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export interface Settings {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
  autoStart: boolean;
  alarmSound: string;
}

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export const SettingsModal = ({
  open,
  onOpenChange,
  settings,
  onSave,
}: SettingsModalProps) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Configurações</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="pomodoro">Pomodoro (minutos)</Label>
            <Input
              id="pomodoro"
              type="number"
              min="1"
              max="60"
              value={localSettings.pomodoroDuration}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  pomodoroDuration: parseInt(e.target.value) || 25,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortBreak">Pausa Curta (minutos)</Label>
            <Input
              id="shortBreak"
              type="number"
              min="1"
              max="30"
              value={localSettings.shortBreakDuration}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  shortBreakDuration: parseInt(e.target.value) || 5,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longBreak">Pausa Longa (minutos)</Label>
            <Input
              id="longBreak"
              type="number"
              min="1"
              max="60"
              value={localSettings.longBreakDuration}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  longBreakDuration: parseInt(e.target.value) || 15,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cycles">Pomodoros por ciclo</Label>
            <Input
              id="cycles"
              type="number"
              min="1"
              max="10"
              value={localSettings.cyclesBeforeLongBreak}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  cyclesBeforeLongBreak: parseInt(e.target.value) || 4,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoStart">Auto-Start</Label>
            <Switch
              id="autoStart"
              checked={localSettings.autoStart}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, autoStart: checked })
              }
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
