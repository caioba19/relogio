import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BarChart3 } from "lucide-react";

export interface Stats {
  todayCount: number;
  weekCount: number;
  totalCount: number;
}

interface StatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: Stats;
}

export const StatsModal = ({ open, onOpenChange, stats }: StatsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Estatísticas
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-muted-foreground">Pomodoros Hoje</span>
              <span className="text-3xl font-bold text-pomodoro">
                {stats.todayCount}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-muted-foreground">Total na Semana</span>
              <span className="text-3xl font-bold text-break">
                {stats.weekCount}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-muted-foreground">Total Geral</span>
              <span className="text-3xl font-bold text-foreground">
                {stats.totalCount}
              </span>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Continue focado! Cada Pomodoro completo é uma vitória. 🎯
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
