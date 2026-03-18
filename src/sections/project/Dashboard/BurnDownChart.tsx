import React, { useMemo } from "react";
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
  // Transform data to include day numbers
  const chartData = useMemo(() => {
    return burnDownData.map((point, index) => ({
      day: index + 1,
      date: point.date,
      remainingTasks: point.remainingTasks,
    }));
  }, [burnDownData]);

  // Use total number of tasks as max for Y-axis
  const maxY = useMemo(() => {
    return totalTasks > 0 ? totalTasks : 60;
  }, [totalTasks]);

  // Prepare data for MUI charts
  const xAxisData = useMemo(() => {
    return chartData.map((d) => d.day);
  }, [chartData]);

  const remainingTasksData = useMemo(() => {
    return chartData.map((d) => d.remainingTasks);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <LineChart
        width={800}
        height={450}
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
            label: 'Remaining Tasks',
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
            fontSize: '12px',
          },
          '& .MuiChartsGrid-root': {
            stroke: '#e5e7eb',
            strokeDasharray: '3 3',
          },
        }}
      />
    </div>
  );
};
