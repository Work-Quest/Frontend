export type Project = {
    ProjectID: string;
    OwnerID: string;
    OwnerName: string;
    ProjectName: string;
    CreatedAt: string; // ISO timestamp
    DeadLine: string;  // ISO timestamp
    TotalTask: number;
    CompletedTasks: number;
    Status: "Working" | "Done";
  };