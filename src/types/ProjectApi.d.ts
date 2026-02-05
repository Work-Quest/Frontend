export type BatchDeleteResponse = {
  deleted_projects: string[]
  failed_projects: {
    project_id: string
    error: string
  }[]
}





