interface AchievementProps {
    tags: string[]
}

function TagList({ tags }: AchievementProps) {
    return (
        <div className="flex flex-row flex-wrap gap-2">
            {tags.map((tag, index) => (
                <p key={index} className="tag-name">{tag}</p>
            ))}
        </div>
    )
}

export default function Achievement({ tags }: AchievementProps) {
    return (
        <div className="flex flex-col gap-2 p-4">
            <h2 className="">Achievements</h2>
            <TagList tags={tags} />
        </div>
    )
}
