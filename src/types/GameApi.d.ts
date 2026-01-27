export type BossData = {
  project_boss_id: string
  project: string
  boss: string
  boss_name: string
  boss_image: string
  hp: number
  max_hp: number
  status: string
}

export type SetupBossResponse = {
  message: string
  boss: BossData
}


