"use client"

import React, { useState } from "react"
import Header from "../Header"
import { Button } from "@/components/ui/button"
import { ReviewTaskModal } from "./ReviewTaskModal"
import { MOCK_REVIEW_TASK_DATA } from "./data"
import type { ReviewTaskData, ReviewTaskProps } from "./types"

const ReviewTask: React.FC<ReviewTaskProps> = ({ data: dataFromProps }) => {
  const [modalOpen, setModalOpen] = useState(false)

  // Single place to switch from mock to API: use props when provided, else mock.
  const data: ReviewTaskData = dataFromProps ?? MOCK_REVIEW_TASK_DATA

  return (
    <div className="w-full pr-3 self-stretch bg-offWhite inline-flex flex-col justify-start items-start font-['Baloo_2']">
      <Header
        bgColor="bg-brown"
        textColor="!text-offWhite"
        text="Review Task"
      />
      <Button
        variant="shadow"
        className="w-full !bg-brown !text-offWhite my-4 font-['Baloo_2']"
        onClick={() => setModalOpen(true)}
      >
        Review
      </Button>
      <ReviewTaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={data}
      />
    </div>
  )
}

export default ReviewTask
