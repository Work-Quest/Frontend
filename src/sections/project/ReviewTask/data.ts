import type { ReviewTaskData } from "./types"

/**
 * Mock data for Review Task modal.
 * Replace with API call later, e.g.:
 *   const data = useReviewTaskData(projectId) ?? MOCK_REVIEW_TASK_DATA;
 */
export const MOCK_REVIEW_TASK_DATA: ReviewTaskData = {
  latestLogs: [
    {
      id: "log-1",
      title: "Setup Django",
      participants: ["John", "Janny"],
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: "log-2",
      title: "Implement Login Page",
      participants: ["John", "Amy"],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "log-3",
      title: "Create models",
      participants: ["John", "Janny"],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ],
  otherLogsOptions: [
    {
      id: "other-1",
      title: "Setup TailwindCSS",
      participants: ["Nano", "Janny"],
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "other-2",
      title: "Setup React",
      participants: ["Tonnam", "Amy"],
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  history: [
    {
      id: "hist-1",
      title: "Implement Signup Page",
      participants: ["Nano", "Amy"],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      comment:
        "They did an excellent job completing everything not only on time but with great attention to detail. The code quality was impressive.",
    },
    {
      id: "hist-2",
      title: "Set up node",
      participants: ["Tonnam", "Amy"],
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      comment:
        "I'm really impressed with how smoothly everything was handled. Communication was clear and the deliverable exceeded expectations.",
    },
    {
      id: "hist-3",
      title: "Design Landing Page",
      participants: ["Harmony", "Alex"],
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      comment:
        "The design process was seamless, with outstanding collaboration. The final result was exactly what we needed.",
    },
  ],
}
