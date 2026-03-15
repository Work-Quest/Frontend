import BadgeContainer from '@/components/BadgeContainer'

const AchievementsMockData = {
  bossesDefeated: [
    {
      id: 'boss1',
      bossName: 'Flame King',
      img: 'https://placehold.co/600x600',
      defeated: true,
    },
    {
      id: 'boss2',
      bossName: 'Abyss Serpent',
      img: 'https://placehold.co/600x600',
      defeated: true,
    },
    {
      id: 'boss3',
      bossName: 'Dark Lord',
      img: 'https://placehold.co/600x600',
      defeated: true,
    },
  ],
}

export default function BossDefeated() {
  const badges = AchievementsMockData.bossesDefeated.map((boss) => ({
    image: boss.img,
    name: boss.bossName,
    description: boss.bossName,
    locked: !boss.defeated,
  }))

  return (
    <>
      <BadgeContainer
        title="Bosses Defeated"
        badges={badges}
        buttonText="View All Bosses Defeated"
      />
    </>
  )
}
