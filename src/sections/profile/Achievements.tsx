import BadgeContainer from "@/components/BadgeContainer"

const AchievementsMockData = {
  achievements: [
    {
      id: "achievement1",
      name: "Master Explorer",
      img: "https://placehold.co/600x600",
      description: "Explore 100 different locations.",
    },
    {
      id: "achievement2",
      name: "Treasure Hunter",
      img: "https://placehold.co/600x600",
      description: "Collect 50 unique treasures.",
    },
    {
      id: "achievement3",
      name: "Monster Slayer",
      img: "https://placehold.co/600x600",
      description: "Defeat 200 monsters.",
    },
    {
      id: "achievement4",
      name: "Champion of the Arena",
      img: "https://placehold.co/600x600",
      description: "Win 10 arena battles.",
    },
    {
      id: "achievement5",
      name: "Crafting Master",
      img: "https://placehold.co/600x600",
      description: "Craft 100 unique items.",
    },
    {
      id: "achievement6",
      name: "Legendary Collector",
      img: "https://placehold.co/600x600",
      description: "Collect all legendary items.",
    },
  ],
}

export default function Achievements() {
  return (
    <>
      <BadgeContainer
        title="Achievements"
        badges={[
          ...AchievementsMockData.achievements.map((achievement) => achievement.img),
        ]}
        buttonText="View All Achievements"
      />
    </>
  )
}