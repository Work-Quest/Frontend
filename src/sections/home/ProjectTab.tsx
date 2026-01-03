"use client"

import type { Project } from "@/types/Project"
import ProjectTabCard from "@/components/ProjectTabCard"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState, useEffect } from "react"
import { IoAddCircle } from "react-icons/io5"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"
import ProjectCreateForm from "@/components/ProjectCreateForm"

type ProjectTabProps = {
  data: Project[]
  onFilterChange: (filters: FilterState) => void
  onCreateProject: (data: {
    project_name: string
    deadline: string
  }) => Promise<void>
}

export interface FilterState {
  status: string | null
  owner: string | null
}

export default function ProjectTab({ data, onFilterChange, onCreateProject }: ProjectTabProps) {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    owner: null,
  })
  const [itemsPerPage, setItemsPerPage] = useState(4)

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const cardHeight = 72
      const fixedElementsHeight = 300
      const availableHeight = window.innerHeight - 140 - 60 - 80 - fixedElementsHeight
      const calculatedItems = Math.max(3, Math.ceil(availableHeight / cardHeight))
      setItemsPerPage(calculatedItems)
    }

    calculateItemsPerPage()
    window.addEventListener("resize", calculateItemsPerPage)
    return () => window.removeEventListener("resize", calculateItemsPerPage)
  }, [])

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    onFilterChange(newFilters)
    setPage(1)
  }

  const uniqueStatuses = Array.from(new Set(data.map((project) => project.status)))
  const uniqueOwners = Array.from(new Set(data.map((project) => project.owner_name)))

  const updateStatusFilter = (status: string | null) => {
    handleFilterChange({ ...filters, status })
  }

  const updateOwnerFilter = (owner: string | null) => {
    handleFilterChange({ ...filters, owner })
  }

  const clearAllFilters = () => {
    handleFilterChange({ status: null, owner: null })
  }

  const hasActiveFilters = filters.status || filters.owner

  return (
    <div className="flex gap-4 h-full">
      {/* Filter Section - Left */}
      <div className="w-1/4 h-full">
        <div className="bg-white rounded-lg border-2 border-veryLightBrown h-full flex flex-col">
          {/* Filter Header */}
          <div className="h-12 bg-lightBrown rounded-t-lg flex items-center justify-center flex-shrink-0">
            <Filter className="w-4 h-4 text-offWhite mr-2" />
            <h3 className="!text-offWhite !font-bold">Filters</h3>
          </div>

          {/* Filter Content */}
          <div className="flex-1 p-4 overflow-auto min-h-0">
            <div className="space-y-6">
              {/* Clear All Button */}
              {hasActiveFilters && (
                <Button
                  onClick={clearAllFilters}
                  size="sm"
                  className="w-full text-orange border-orange hover:bg-orange"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}

              {/* Status Filter */}
              <div>
                <p className="!text-brown !font-bold mb-3 text-sm uppercase tracking-wide">Status</p>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    onClick={() => updateStatusFilter(null)}
                    className={`w-full justify-start ${
                      filters.status === null
                        ? "bg-orange text-brown"
                        : "text-brown border-lightBrown hover:bg-orange/10"
                    }`}
                  >
                    All Status
                  </Button>
                  {uniqueStatuses.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      onClick={() => updateStatusFilter(status)}
                      className={`w-full justify-start ${
                        filters.status === status
                          ? "bg-orange text-lightBrown hover:bg-orange/90"
                          : "text-brown border-lightBrown hover:bg-orange/10"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            status === "Done" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                        {status}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Owner Filter */}
              <div>
                <p className="!text-brown !font-bold mb-3 text-sm uppercase tracking-wide">Owner</p>
                <Select value={filters.owner || ""} onValueChange={(value) => updateOwnerFilter(value || null)}>
                  <SelectTrigger className="w-full !bg-offWhite !border-veryLightBrown !border-2 text-brown focus:!outline-none active:!border-lightBrown !font-['Baloo_2']">
                    <SelectValue placeholder="All Owners" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    {uniqueOwners.map((owner) => (
                      <SelectItem key={owner} value={owner}>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-orange/20 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-orange">{owner.charAt(0).toUpperCase()}</span>
                          </div>
                          {owner}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div>
                  <h4 className="!text-brown !font-bold mb-3 text-sm uppercase tracking-wide">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.status && (
                      <Badge variant="secondary" className="bg-orange/20 text-orange">
                        Status: {filters.status}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateStatusFilter(null)} />
                      </Badge>
                    )}
                    {filters.owner && (
                      <Badge variant="secondary" className="bg-orange/20 text-orange">
                        Owner: {filters.owner}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => updateOwnerFilter(null)} />
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Results Count */}
              <div className="pt-4 border-t border-veryLightBrown">
                <p className="text-sm text-brown/70">
                  You have <span className="font-semibold text-brown">{data.length}</span> projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Project List - Right */}
      <div className="flex flex-col w-3/4 h-full">
        <div className="flex flex-col h-full bg-white rounded-lg border-2 border-veryLightBrown">
          {/* Header */}
          <div className="flex h-12 w-full bg-veryLightBrown items-center rounded-t-lg justify-between px-4 flex-shrink-0">
            <p className="!text-brown !font-extrabold">Project's name</p>
            <div className="flex justify-between w-[40%]">
              <p className="!text-brown !font-extrabold">Status</p>
              <p className="!text-brown !font-extrabold">Owner</p>
            </div>
          </div>

          {/* Add New Project */}
          <ProjectCreateForm onCreateProject={onCreateProject} />
          {/* Project List */}
          <div className="flex flex-col px-4 gap-2 flex-1 overflow-auto min-h-0">
            {paginatedData.length > 0 ? (
              paginatedData.map((project) => (
                <div key={project.project_id} className="h-16 flex-shrink-0">
                  <ProjectTabCard project={project} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-brown/60">
                <Filter className="w-12 h-12 mb-4 text-brown/30" />
                <p className="text-lg font-medium">No projects found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="h-12 w-full bg-veryLightBrown rounded-b-lg flex items-center justify-between px-4 flex-shrink-0">
              <Pagination>
                <PaginationContent>
                  <PaginationItem className="!text-brown">
                    <PaginationPrevious
                      href={`#${page - 1}`}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page - 1)
                      }}
                    />
                  </PaginationItem>

                  {totalPages > 3
                    ? Array.from({ length: 3 }, (_, index) => {
                        let pageNumber
                        if (page <= 2) {
                          pageNumber = index + 1
                        } else if (page >= totalPages - 1) {
                          pageNumber = totalPages - 2 + index
                        } else {
                          pageNumber = page - 1 + index
                        }
                        pageNumber = Math.min(Math.max(pageNumber, 1), totalPages)
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href={`#${pageNumber}`}
                              isActive={page === pageNumber}
                              onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(pageNumber)
                              }}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })
                    : Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href={`#${pageNumber}`}
                              isActive={page === pageNumber}
                              onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(pageNumber)
                              }}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                  <PaginationItem className="!text-brown">
                    <PaginationNext
                      href={`#${page + 1}`}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page + 1)
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
