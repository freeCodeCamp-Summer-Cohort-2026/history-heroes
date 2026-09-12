export type ActivityType = 'ordering' | 'matching'

export type ActivityItem = { id: string; label: string }

export type OrderingContent = { items: ActivityItem[] }
export type MatchingContent = { left: ActivityItem[]; right: ActivityItem[] }

export type OrderingAnswer = { itemOrder: string[] }
export type MatchingAnswer = { pairs: { left: string; right: string }[] }

export type Activity =
  | {
      id: string
      type: 'ordering'
      title: string
      checkStatement: string
      content: OrderingContent
      successCriteria: { correctOrder: string[] }
    }
  | {
      id: string
      type: 'matching'
      title: string
      checkStatement: string
      content: MatchingContent
      successCriteria: { pairs: { left: string; right: string }[] }
    }

export type ActivityAnswer = OrderingAnswer | MatchingAnswer

export type ActivityResult = 'unsubmitted' | 'correct' | 'not-yet'

export type ActivityRendererProps<TContent, TAnswer> = {
  content: TContent
  answer: TAnswer
  onAnswerChange: (answer: TAnswer) => void
  disabled: boolean
}
