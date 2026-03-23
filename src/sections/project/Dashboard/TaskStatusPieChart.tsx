import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
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
  backlog: "#D3D3D3",
  todo: "#FFBB68",
  inProgress: "#F76652",
  done: "#2EBF49",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const update = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      if (w > 0) setBoxWidth(w);
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pieSize = useMemo(() => {
    if (boxWidth <= 0) return 160;
    const capped = Math.min(boxWidth - 8, 240);
    return Math.max(120, capped);
  }, [boxWidth]);

  const pieGeometry = useMemo(() => {
    const r = pieSize / 2;
    return {
      cx: r,
      cy: r,
      innerRadius: Math.round(pieSize * 0.3125),
      outerRadius: Math.round(pieSize * 0.4375),
    };
  }, [pieSize]);

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
      <div
        ref={containerRef}
        className="flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] w-full min-w-0 text-muted-foreground px-1"
      >
        No data available
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center w-full min-w-0 max-w-full gap-2 py-1"
    >
      {boxWidth <= 0 ? (
        <div
          className="rounded-full bg-brown/[0.06] shrink-0"
          style={{ width: pieSize, height: pieSize }}
          aria-hidden
        />
      ) : (
        <PieChart
          series={[
            {
              data: data,
              innerRadius: pieGeometry.innerRadius,
              outerRadius: pieGeometry.outerRadius,
              paddingAngle: 2,
              cornerRadius: 0,
              startAngle: -90,
              endAngle: 270,
              cx: pieGeometry.cx,
              cy: pieGeometry.cy,
            },
          ]}
          width={pieSize}
          height={pieSize}
          colors={data.map((item) => item.color)}
          sx={{
            '& .MuiPieArc-root': {
              stroke: 'none',
            },
            maxWidth: '100%',
          }}
        />
      )}
      <div className="mt-1 flex flex-wrap gap-2 justify-center w-full px-1">
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
