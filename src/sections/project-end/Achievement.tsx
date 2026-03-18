interface AchievementProps {
  tags: string[]
  loading?: boolean
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {tags.map((tag, index) => (
        <p key={index} className="tag-name">{tag}</p>
      ))}
    </div>
  )
}

export default function Achievement({ tags, loading }: AchievementProps) {
  const isEmpty = !loading && tags.length === 0

  return (
    <div className="flex flex-col gap-2 p-4">
      <h2 className="">Achievements</h2>
      {loading && (
        <p className="text-brown/70 text-sm font-['Baloo_2']">Loading achievements...</p>
      )}
      {isEmpty && (
        <p className="text-brown/70 text-sm font-['Baloo_2']">
          No achievements unlocked in this project yet.
        </p>
      )}
      {!loading && !isEmpty && <TagList tags={tags} />}
    </div>
  )
}
