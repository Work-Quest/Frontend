"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import Header from "../Header"
import { Button } from "@/components/ui/button"
import ReviewTaskModal from "./ReviewTaskModal"
import type { ReviewHistoryEntry, ReviewTaskData, ReviewTaskProps } from "./types"
import { get } from "@/Api"

type UserReportResponse = {
  id: string
  report: {
    report_id: string
    task: {
      task_id: string
      task_name: string
    }
    description: string
    created_at: string
  }
  reviewer: {
    project_member_id: string
    username: string
  }
  receiver: {
    project_member_id: string
    username: string
  }
}

const ReviewTask: React.FC<ReviewTaskProps> = ({
  projectId,
  doneTasks,
  myProjectMemberId,
  onSupportApplied,
}) => {
  const [modalOpen, setModalOpen] = useState(false)

  const [reviewHistory, setReviewHistory] = useState<UserReportResponse[]>([])

  const refreshReviewHistory = useCallback(async () => {
    if (!projectId) return
    try {
      const rows = await get<UserReportResponse[]>(
        `/api/project/${projectId}/review/get_all_review/`,
      )
      setReviewHistory(Array.isArray(rows) ? rows : [])
    } catch (e) {
      // Best-effort: keep UI usable even if history fails.
      console.error(e)
    }
  }, [projectId])

  useEffect(() => {
    refreshReviewHistory()
  }, [refreshReviewHistory])

  const reviewedTaskIdsByMe = useMemo(() => {
    const set = new Set<string>()
    if (!myProjectMemberId) return set
    for (const r of reviewHistory) {
      if (String(r.reviewer?.project_member_id) !== String(myProjectMemberId)) continue
      const tid = r.report?.task?.task_id
      if (tid) set.add(String(tid))
    }
    return set
  }, [reviewHistory, myProjectMemberId])

  const eligibleDoneTasks = useMemo(() => {
    const meId = myProjectMemberId ? String(myProjectMemberId) : null
    return (doneTasks ?? []).filter((t) => {
      // Rule: assignee cannot review their own task (hide in UI)
      if (meId && Array.isArray(t.assignees) && t.assignees.map(String).includes(meId)) return false
      // Rule: one review per task per reviewer (hide in UI)
      if (reviewedTaskIdsByMe.has(String(t.id))) return false
      return true
    })
  }, [doneTasks, myProjectMemberId, reviewedTaskIdsByMe])

  const data: ReviewTaskData = useMemo(() => {
    const latest = eligibleDoneTasks.slice(0, 3)
    const others = eligibleDoneTasks.slice(3)

    const toLog = (t: ReviewTaskProps["doneTasks"][number]) => ({
      id: String(t.id),
      title: t.title,
      participants: (t.assigneesName?.length ? t.assigneesName : t.assignees).map(String),
      // Task doesn't currently contain completed_at, so use "now" as a stable fallback for UI.
      timestamp: new Date().toISOString(),
    })

    const history: ReviewHistoryEntry[] = (reviewHistory ?? []).map((r) => ({
      id: String(r.id),
      title: r.report?.task?.task_name ?? "Task review",
      reviewer: r.reviewer?.username,
      participants: [r.receiver?.username].filter(Boolean) as string[],
      timestamp: r.report?.created_at ?? new Date().toISOString(),
      comment: r.report?.description ?? "",
    }))

    return {
      latestLogs: latest.map(toLog),
      otherLogsOptions: others.map(toLog),
      history,
    }
  }, [eligibleDoneTasks, reviewHistory])

  return (
    <div className="w-full pr-3 self-stretch bg-offWhite inline-flex flex-col justify-start items-start font-baloo2">
      <Header
        bgColor="bg-brown"
        textColor="!text-offWhite"
        text="Review Task"
      />
      <Button
        variant="shadow"
        className="w-full !bg-brown !text-offWhite my-4 font-baloo2"
        onClick={() => setModalOpen(true)}
      >
        Review
      </Button>
      <ReviewTaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={data}
        projectId={projectId ?? null}
        onSupportApplied={onSupportApplied}
      />
    </div>
  )
}

export default ReviewTask
