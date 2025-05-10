interface WorkloadChartProps {
  work_load_per_day: string;
}

const WorkloadChart = ({ work_load_per_day }: WorkloadChartProps) => {
  return (
    <div className="mb-4">
      <p className="!text-md !font-bold mb-1">Last 30 Days Daily Workload</p>
      <div className="flex items-center gap-1">
        <p className="!text-sm !text-lightBrown">Month Ago</p>
        {JSON.parse(work_load_per_day)
          .slice(-30)
          .map((load: number, i: number) => (
            <div 
              key={i} 
              className="h-8 w-full bg-blue-500 rounded"
              style={{ 
                height: `${load * 8}px`,
                opacity: 0.6 + (load / 20)
              }}
              title={`Day ${i + 1}: ${load} units`}
            />
          ))}
        <p className="!text-sm !text-lightBrown">End-Day</p>
      </div>
    </div>
  );
};

export default WorkloadChart;