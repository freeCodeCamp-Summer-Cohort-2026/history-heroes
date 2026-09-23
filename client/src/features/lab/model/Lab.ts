import type { Activity } from '../../activities/types'

export type Lab = {
  id: string
  moduleId: string
  title: string
  description: string
  activities: Activity[]
}
