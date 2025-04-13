import ProjectDetailCard from "@/sections/project/ProjectDetailCard/ProjectDetailCard";
import DamageLog from "@/sections/project/DamageLog/DamageLog";
import ReviewTask from "@/sections/project/ReviewTask";
import { KanbanBoard } from '@/sections/project/KanbanBoard/KanbanBoard';
import { useKanbanBoard } from "@/sections/project/KanbanBoard/useKanbanBoard";
import { Tasks } from "@/sections/project/KanbanBoard/types";

// dummy data
const initialTasks: Tasks = {
  backlog: [
    { id: 'task-1', title: 'Design database schema', priority: 'High', iteration: 'Sprint 1', assignees: ['Alice', 'You'], status: 'backlog' },
    { id: 'task-2', title: 'Research API requirements', priority: 'Medium', iteration: 'Sprint 1', assignees: ['Bob'], status: 'backlog' },
  ],
  todo: [
    { id: 'task-3', title: 'Setup project repository', priority: 'Low', iteration: 'Sprint 1', assignees: ['You'], status: 'todo' },
    { id: 'task-4', title: 'Create component structure', priority: 'Medium', iteration: 'Sprint 1', assignees: ['Charlie', 'Alice'], status: 'todo' },
  ],
  inProgress: [
    { id: 'task-5', title: 'Implement authentication', priority: 'Low', iteration: 'Sprint 2', assignees: ['You', 'David'], status: 'inProgress' },
  ],
  done: [
    { id: 'task-6', title: 'Project setup', priority: 'Low', iteration: 'Sprint 1', assignees: ['Bob'], status: 'done' },
  ],
};

export default function Project() {
  const {
    tasks,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    findActiveTask,
    handleAddTask,
    handleDeleteTask,
  } = useKanbanBoard(initialTasks);

  return (
    <div className="flex bg-cream overflow-hidden">
      <div className="w-[500px] h-full flex-shrink-0 bg-offWhite flex flex-col overflow-y-auto">
        <ProjectDetailCard
          // dummy data
          hpData={{
            boss: { current: 50, max: 100 },
            player: { current: 80, max: 100 },
          }}
          projectData={{
            deadline: "2023-12-31",
            daysLeft: 30,
            estimatedTime: 10,
          }}
        />

        <DamageLog
          // dummy data
          logs={[
            {
              id: "1",
              action: "Setup Django",
              timestamp: "2023-05-15T10:00:00Z",
              damageValue: 1234,
              participants: ["John", "Janny"],
              comment: "Good job!",
            },
            {
              id: "2",
              action: "Setup TailwindCSS",
              timestamp: "2024-05-15T10:00:00Z",
              damageValue: -127,
              participants: ["John", "Nano"],
              comment: "Late!",
            },
          ]}
        />

        <ReviewTask />
      </div>

      <div className="flex-1 h-full flex flex-col bg-offWhite min-w-0 overflow-hidden">
        <div className="h-[250px] flex-shrink-0 border-b border-gray-400 flex items-center justify-center text-gray-500 text-sm">
          Boss Fight Placeholder
        </div>
        
        <div className="flex-1 min-h-0 overflow-hidden">
          <KanbanBoard 
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            activeId={activeId}
            findActiveTask={findActiveTask}
          />
        </div>
      </div>
    </div>
  );
}
