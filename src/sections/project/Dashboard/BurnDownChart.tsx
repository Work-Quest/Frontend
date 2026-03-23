import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { LineChart } from '@mui/x-charts/LineChart';

type BurnDownDataPoint = {
  date: string;
  remainingTasks: number;
};

type BurnDownChartProps = {
  burnDownData: BurnDownDataPoint[];
  totalTasks: number;
};

export const BurnDownChart: React.FC<BurnDownChartProps> = ({ burnDownData, totalTasks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const update = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      if (w > 0) setChartWidth(w);
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const chartHeight = useMemo(() => {
    if (chartWidth <= 0) return 280;
    return Math.min(480, Math.max(200, Math.round(chartWidth * 0.55)));
  }, [chartWidth]);

  const chartMargin = useMemo(() => {
    const narrow = chartWidth > 0 && chartWidth < 420;
    return {
      left: narrow ? 10 : 16,
      right: narrow ? 12 : 28,
      top: 16,
      bottom: narrow ? 36 : 44,
    };
  }, [chartWidth]);

  const axisTickFontSize = chartWidth > 0 && chartWidth < 380 ? 10 : 12;

  const chartData = useMemo(() => {
    return burnDownData.map((point, index) => ({
      day: index + 1,
      date: point.date,
      remainingTasks: point.remainingTasks,
    }));
  }, [burnDownData]);

  const maxY = useMemo(() => {
    return totalTasks > 0 ? totalTasks : 60;
  }, [totalTasks]);

  const xAxisData = useMemo(() => {
    return chartData.map((d) => d.day);
  }, [chartData]);

  const remainingTasksData = useMemo(() => {
    return chartData.map((d) => d.remainingTasks);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="w-full min-h-[200px] sm:min-h-[280px] flex items-center justify-center text-muted-foreground px-2">
        No data available
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full min-w-0 max-w-full">
      {chartWidth <= 0 ? (
        <div
          className="min-h-[220px] sm:min-h-[280px] w-full rounded-lg bg-brown/[0.06]"
          aria-hidden
        />
      ) : (
        <div className="w-full overflow-x-auto min-h-[220px] sm:min-h-[280px] flex justify-center sm:justify-start">
          <LineChart
            width={chartWidth}
            height={chartHeight}
            margin={chartMargin}
            xAxis={[
              {
                data: xAxisData,
                scaleType: 'linear',
                label: 'Day',
              },
            ]}
            yAxis={[
              {
                min: 0,
                max: maxY,
                label: chartWidth < 360 ? 'Tasks' : 'Remaining Tasks',
              },
            ]}
            series={[
              {
                data: remainingTasksData,
                label: 'Remaining Tasks',
                color: '#ff995a',
                showMark: true,
              },
            ]}
            grid={{ vertical: true, horizontal: true }}
            sx={{
              '& .MuiChartsAxis-root': {
                stroke: '#3D3730',
              },
              '& .MuiChartsAxis-tick': {
                stroke: '#3D3730',
              },
              '& .MuiChartsAxis-tickLabel': {
                fill: '#3D3730',
                fontSize: axisTickFontSize,
              },
              '& .MuiChartsAxis-label': {
                fill: '#3D3730',
                fontSize: chartWidth < 380 ? 11 : 12,
              },
              '& .MuiChartsGrid-root': {
                stroke: '#e5e7eb',
                strokeDasharray: '3 3',
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
