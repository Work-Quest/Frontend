import type { Project } from "@/types/Project";
import ProjectTabCard from "@/components/ProjectTabCard";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
   import { useState } from "react";

type ProfileTabProps = {
  data: Project[];
};

export default function ProjectTab({ data }: ProfileTabProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  

  const paginatedData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


  return (
    <div className="flex relative flex-col w-[100%] h-[100%]">
      <div className="flex h-[10%] w-full bg-darkBrown items-center rounded-t-xl rounded-b-sm justify-between px-7">
        <h3 className="!text-offWhite">Project's name</h3>
        <div className="flex justify-between w-[40%]">
          <h3 className="!text-offWhite">Status</h3>
          <h3 className="!text-offWhite">Owner</h3>
        </div>
      </div>

      <div className="flex flex-col py-3 gap-3 flex-1 overflow-auto">
        {paginatedData.map((i) => (
          <ProjectTabCard key={i.ProjectID} project={i} />
        ))}
      </div>

      <div className="absolute bottom-0 h-[10%] w-full bg-darkBrown rounded-b-xl rounded-t-sm flex items-center justify-end">
        <Pagination className="ml-[60%]">
            <PaginationContent>
                <PaginationItem className="!text-offWhite rounded-md">
                <PaginationPrevious
                    href={`#${page-1}`}
                    onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                    }}
                />
                </PaginationItem>

                {/* page numbers */}
                {totalPages > 3 ? (
                // show only 3 nearby page
                Array.from({ length: 3 }, (_, index) => {
                    let pageNumber;
                    if (page <= 2) {
                        pageNumber = index + 1;
                    } else if (page >= totalPages - 1) {
                        pageNumber = totalPages - 2 + index;
                    } else {
                        pageNumber = page - 1 + index;
                    }
                    pageNumber = Math.min(Math.max(pageNumber, 1), totalPages);
                    return (
                    <PaginationItem key={pageNumber}>
                        <PaginationLink
                        href={`#${pageNumber}`}
                        isActive={page === pageNumber}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber);
                        }}
                        >
                        {pageNumber}
                        </PaginationLink>
                    </PaginationItem>
                    );
                })
                ) : (
                // show all page if  page < 3
                Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    return (
                    <PaginationItem key={pageNumber}>
                        <PaginationLink
                        href={`#${pageNumber}`}
                        isActive={page === pageNumber}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber);
                        }}
                        >
                        {pageNumber}
                        </PaginationLink>
                    </PaginationItem>
                    );
                })
                )}
                {totalPages > 3 && page < totalPages - 2 && (
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                )}

                <PaginationItem className="!text-offWhite rounded-md">
                <PaginationNext
                    href={`#${page+1}`}
                    onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                    }}
                />
                </PaginationItem>
            </PaginationContent>
            </Pagination>
      </div>
    </div>
  );
}
