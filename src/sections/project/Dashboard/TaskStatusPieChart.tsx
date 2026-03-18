import React, { useMemo } from "react";
import { PieChart } from '@mui/x-charts/PieChart';

type TaskStatusCounts = {
  backlog: number;
  todo: number;
  inProgress: number;
  done: number;
};

type TaskStatusPieChartProps = {
  taskStatusCounts: TaskStatusCounts;
};

const COLORS = {
  backlog: "#D3D3D3", // light gray
  todo: "#FFBB68", // light orange
  inProgress: "#F76652", // coral red
  done: "#2EBF49", // green
};

const STATUS_LABELS = {
  backlog: "Backlog",
  todo: "Todo",
  inProgress: "In Progress",
  done: "Done",
};

export const TaskStatusPieChart: React.FC<TaskStatusPieChartProps> = ({
  taskStatusCounts,
}) => {
  const data = useMemo(() => {
    return [
      { id: 0, value: taskStatusCounts.backlog, label: STATUS_LABELS.backlog, color: COLORS.backlog },
      { id: 1, value: taskStatusCounts.todo, label: STATUS_LABELS.todo, color: COLORS.todo },
      { id: 2, value: taskStatusCounts.inProgress, label: STATUS_LABELS.inProgress, color: COLORS.inProgress },
      { id: 3, value: taskStatusCounts.done, label: STATUS_LABELS.done, color: COLORS.done },
    ].filter((item) => item.value > 0);
  }, [taskStatusCounts]);

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] w-full text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[200px] w-full">
      <PieChart
        series={[
          {
            data: data,
            innerRadius: 50,
            outerRadius: 70,
            paddingAngle: 2,
            cornerRadius: 0,
            startAngle: -90,
            endAngle: 270,
            cx: 80,
            cy: 80,
          },
        ]}
        width={160}
        height={160}
        colors={data.map((item) => item.color)}
        sx={{
          '& .MuiPieArc-root': {
            stroke: 'none',
          },
        }}
      />
      {/* Custom legend */}
      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-1 text-xs"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-darkBrown">
              {item.label}: {item.value} ({(item.value / total * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
