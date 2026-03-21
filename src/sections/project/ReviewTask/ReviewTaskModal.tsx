'use client'

import React, { useState, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import type { ReviewLogEntry, ReviewHistoryEntry, ReviewTaskData } from './types'
import toast from 'react-hot-toast'
import { post } from '@/Api'
import { useGame } from '@/hook/useGame'

const COMMENT_PREVIEW_LEN = 90

type ReviewTaskModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Single source: pass API data here later; when null/undefined use mock. */
  data: ReviewTaskData
  projectId: string | null
  onSupportApplied?: (receiverProjectMemberIds: string[]) => void
}

type ReviewReportResponseRow = {
  id: string
  report: {
    report_id: string
  }
  receiver: {
    project_member_id: string
  }
}

const ReviewTaskModal: React.FC<ReviewTaskModalProps> = ({
  open,
  onOpenChange,
  data,
  projectId,
  onSupportApplied,
}) => {
  const { latestLogs, otherLogsOptions, history } = data

  const defaultLatestSelectedId = latestLogs[1]?.id ?? latestLogs[0]?.id ?? ''

  // Extract unique usernames from otherLogsOptions participants
  const uniqueUsernames = useMemo(() => {
    const usernameSet = new Set<string>()
    otherLogsOptions.forEach((log) => {
      log.participants.forEach((name) => usernameSet.add(name))
    })
    return Array.from(usernameSet).sort()
  }, [otherLogsOptions])

  const [selectedSource, setSelectedSource] = useState<'latest' | 'other'>('latest')
  const [selectedLogId, setSelectedLogId] = useState<string>(defaultLatestSelectedId)
  const [selectedUsername, setSelectedUsername] = useState<string>('')
  const [reviewText, setReviewText] = useState('')
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { playerSupport } = useGame(projectId ?? undefined)

  // Filter logs by selected username
  const filteredLogsByUsername = useMemo(() => {
    if (!selectedUsername) return []
    return otherLogsOptions.filter((log) => log.participants.includes(selectedUsername))
  }, [otherLogsOptions, selectedUsername])

  const handleSelectLatestLog = (id: string) => {
    setSelectedSource('latest')
    setSelectedLogId(id)
    setSelectedUsername('')
  }

  const handleSelectUsername = (username: string) => {
    setSelectedSource('other')
    setSelectedUsername(username)
    // Set the first log for this username as selected
    const firstLog = otherLogsOptions.find((log) => log.participants.includes(username))
    if (firstLog) {
      setSelectedLogId(firstLog.id)
    }
  }

  const handleSubmitReview = async () => {
    if (!projectId) return
    if (!selectedLogId || !reviewText.trim()) return
    if (submitting) return

    const allLogs = [...latestLogs, ...otherLogsOptions]
    const targetLog = allLogs.find((log) => log.id === selectedLogId)
    if (!targetLog) return

    setSubmitting(true)
    try {
      // 1) Create review report (enforces no-self-review + one-per-task-per-reviewer in backend)
      const created = await post<
        { task_id: string; description: string },
        ReviewReportResponseRow[]
      >(`/api/project/${projectId}/review/report/`, {
        task_id: String(targetLog.id),
        description: reviewText.trim(),
      })

      const reportId = created?.[0]?.report?.report_id
      if (!reportId) throw new Error('Review created but report_id is missing')

      // 2) Trigger support (buff/effect/item) for the review receivers
      const supportRes = await playerSupport(projectId, { report_id: String(reportId) })
      const receiverIds =
        supportRes?.result?.applied
          ?.map((a) => ('receiver_id' in a && a.receiver_id ? String(a.receiver_id) : null))
          .filter((id): id is string => id !== null) ?? []

      // 3) Close modal and notify parent to animate receivers
      setReviewText('')
      onOpenChange(false)
      onSupportApplied?.(receiverIds)
      toast.success('Review submitted\nThanks—your teammates got a boost from your feedback.')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to submit review'
      toast.error(`Couldn't submit review\n${msg}`)
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="normal"
        showCloseButton
        className="!w-[66.666vw] !min-w-[320px] !max-w-[95vw] h-[80vh] min-h-[420px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col font-baloo2"
      >
        <div className="flex flex-col flex-1 min-h-0 rounded-lg overflow-hidden bg-offWhite/90">
          <DialogTitle className="sr-only">Review Task</DialogTitle>
          <div className="flex items-center justify-between px-6 py-4 border-b border-darkBrown/10 shrink-0">
            <h2 className="text-2xl font-bold text-darkBrown font-baloo2">Review Task</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1 min-h-0">
            {/* Left: 3 Latest Logs + or + Other Logs */}
            <div className="flex flex-col min-h-0 overflow-hidden">
              <div className="shrink-0 px-6 pt-6 pb-3">
                <h3 className="!text-xl !font-medium text-darkBrown font-baloo2">
                  3 Latest Logs
                </h3>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
                <ScrollArea className="h-full">
                  <div className="flex flex-col gap-3 mb-4">
                    {latestLogs.map((log) => {
                      const isSelectedLatest =
                        selectedSource === 'latest' && selectedLogId === log.id
                      return (
                        <LatestLogCard
                          key={log.id}
                          log={log}
                          isHighlighted={isSelectedLatest}
                          reviewValue={isSelectedLatest ? reviewText : undefined}
                          onReviewChange={isSelectedLatest ? setReviewText : undefined}
                          onSelect={() => handleSelectLatestLog(log.id)}
                        />
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 my-2">
                    <div className="flex-1 h-px bg-darkBrown/20" />
                    <span className="text-darkBrown/70 text-sm font-baloo2">or</span>
                    <div className="flex-1 h-px bg-darkBrown/20" />
                  </div>

                  <h3 className="!text-xl !font-medium text-darkBrown mt-4 mb-2 font-baloo2">
                    Other Logs
                  </h3>
                  <Select value={selectedUsername} onValueChange={handleSelectUsername}>
                    <SelectTrigger className="w-full border-darkBrown/20 text-darkBrown bg-white font-baloo2">
                      <SelectValue placeholder="Select by username" />
                    </SelectTrigger>
                    <SelectContent className="font-baloo2">
                      {uniqueUsernames.map((username) => (
                        <SelectItem key={username} value={username}>
                          {username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedSource === 'other' && selectedUsername && (
                    <div className="mt-3 space-y-3">
                      {filteredLogsByUsername.length === 0 ? (
                        <p className="text-darkBrown/70 text-sm text-center py-4 font-baloo2">
                          No logs found for {selectedUsername}
                        </p>
                      ) : (
                        filteredLogsByUsername.map((log) => {
                          const isSelected = selectedLogId === log.id
                          return (
                            <LatestLogCard
                              key={log.id}
                              log={log}
                              isHighlighted={isSelected}
                              reviewValue={isSelected ? reviewText : undefined}
                              onReviewChange={isSelected ? setReviewText : undefined}
                              onSelect={() => {
                                setSelectedLogId(log.id)
                              }}
                            />
                          )
                        })
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>

            {/* Right: History */}
            <div className="flex flex-col min-h-0 overflow-hidden bg-cream/40">
              <h3 className="!text-xl !font-medium text-darkBrown shrink-0 px-6 py-4 font-baloo2">
                History
              </h3>
              <div className="flex-1 min-h-0 overflow-hidden px-4 pb-4">
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-2">
                    {history.map((entry) => (
                      <HistoryCard
                        key={entry.id}
                        entry={entry}
                        isExpanded={expandedHistoryId === entry.id}
                        onToggleExpand={() =>
                          setExpandedHistoryId((id) => (id === entry.id ? null : entry.id))
                        }
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-darkBrown/10 shrink-0">
            <Button
              variant="orange"
              className="px-6 font-baloo2"
              disabled={!projectId || submitting || !selectedLogId || !reviewText.trim()}
              onClick={handleSubmitReview}
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default ReviewTaskModal

function LatestLogCard({
  log,
  isHighlighted,
  reviewValue,
  onReviewChange,
  onSelect,
}: {
  log: ReviewLogEntry
  isHighlighted: boolean
  reviewValue?: string
  onReviewChange?: (v: string) => void
  onSelect?: () => void
}) {
  const timeAgo = formatDistanceToNow(new Date(log.timestamp), {
    addSuffix: true,
  })

  return (
    <div
      className={`rounded-lg border p-4 flex flex-col gap-2 font-baloo2 cursor-pointer ${
        isHighlighted ? 'bg-orange/10 border-orange/30' : 'bg-white/80 border-darkBrown/5'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-bold text-darkBrown text-base">{log.title}</span>
        <span className="text-darkBrown/70 text-sm shrink-0">{timeAgo}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {log.participants.map((name, i) => (
          <span
            key={`${log.id}-${i}`}
            className="tag tag-name !text-sm px-2 py-0.5 !rounded-sm font-baloo2 !bg-orange"
          >
            {name}
          </span>
        ))}
      </div>
      {isHighlighted && (
        <Textarea
          placeholder="Review your friend..."
          value={reviewValue ?? ''}
          onChange={(e) => onReviewChange?.(e.target.value)}
          className="mt-2 border-orange/50 bg-white font-baloo2 text-darkBrown placeholder:text-darkBrown/50"
          rows={2}
        />
      )}
    </div>
  )
}

function HistoryCard({
  entry,
  isExpanded,
  onToggleExpand,
}: {
  entry: ReviewHistoryEntry
  isExpanded: boolean
  onToggleExpand: () => void
}) {
  const timeAgo = formatDistanceToNow(new Date(entry.timestamp), {
    addSuffix: true,
  })
  const needsTruncate = entry.comment.length > COMMENT_PREVIEW_LEN
  const displayComment =
    needsTruncate && !isExpanded
      ? entry.comment.slice(0, COMMENT_PREVIEW_LEN) + '...'
      : entry.comment

  return (
    <div className="rounded-lg bg-offWhite border border-lightBrown/10 p-4 flex flex-col gap-2 font-baloo2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-bold text-darkBrown text-base">{entry.title}</span>
        <span className="text-darkBrown/70 text-sm shrink-0">{timeAgo}</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-between gap-2">
        <div className="flex items-center justify-end gap-2">
          {entry.participants.map((name, i) => (
            <span
              key={`${entry.id}-${i}`}
              className="tag tag-name !text-sm px-2 py-0.5 !rounded-sm font-baloo2 !bg-orange"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          review by
          <span className="tag tag-name !text-sm px-2 py-0.5 !rounded-sm font-baloo2 !bg-green">
            {entry.reviewer}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 bg-orange/10 p-2 rounded-lg">
        <p className="text-darkBrown/90 text-sm">
          {displayComment}
          {needsTruncate && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="!ml-1 !text-darkBrown !underline hover:!text-blue-800 font-baloo2 !bg-transparent !border-none !p-0 !m-0"
            >
              {isExpanded ? 'see less' : 'see more'}
            </button>
          )}
        </p>
      </div>
    </div>
  )
}
