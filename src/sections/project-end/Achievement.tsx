import { Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AchievementProps {
  tags: string[]
  loading?: boolean
  onSeeAll?: () => void
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center -mt-2 rounded-full bg-[#70BEFF] !text-white px-3 py-0.5 text-xs font-medium font-baloo2 border border-[#70BEFF]/40"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default function Achievement({ tags, loading, onSeeAll }: AchievementProps) {
  const isEmpty = !loading && tags.length === 0

  return (
    <section className="h-full rounded-2xl bg-white border border-brown/10 shadow-sm p-5 md:p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1 min-h-0">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cream">
          <Trophy className="w-8 h-8 text-orange" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0 space-y-3 min-h-0">
          <h2 className="!text-xl !font-bold !text-darkBrown font-baloo2">Achievements</h2>
          {loading && (
            <p className="text-lightBrown text-sm font-baloo2">Loading achievements…</p>
          )}
          {isEmpty && (
            <p className="text-lightBrown text-sm font-baloo2">
              No achievements unlocked in this project yet.
            </p>
          )}
          {!loading && !isEmpty && <TagList tags={tags} />}
        </div>
      </div>
      {!loading && !isEmpty && (
        <Button
          type="button"
          variant="default"
          className="mt-4 pt-5 w-full border-2 border-orange text-orange hover:bg-orange/10 font-baloo2 font-semibold rounded-xl h-11"
          onClick={onSeeAll}
        >
          See all
        </Button>
      )}
    </section>
  )
}
