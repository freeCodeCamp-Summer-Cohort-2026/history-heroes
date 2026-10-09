export type ActivityType = 'ordering' | 'matching' | 'true-false'
export type ActivityItem = { id: string; label: string }
export type OrderingContent = { items: ActivityItem[] }
export type TrueFalseContent = { statement: string }

export type MatchingContent = {
  left: ActivityItem[]
  right: ActivityItem[]
}

export type TrueFalseAnswer = { value: boolean | null }

export type OrderingAnswer = {
  itemOrder: string[]
}

export type MatchingAnswer = {
  pairs: {
    left: string
    right: string
  }[]
}

export type TrueFalseActivity = {
  id: string
  type: 'true-false'
  title: string
  checkStatement: string
  content: TrueFalseContent
  successCriteria: {
    correctAnswer: boolean
  }
}

export type OrderingActivity = {
  id: string
  type: 'ordering'
  title: string
  checkStatement: string
  content: OrderingContent
  successCriteria: {
    correctOrder: string[]
  }
}
export type MatchingActivity = {
  id: string
  type: 'matching'
  title: string
  checkStatement: string
  content: MatchingContent
  successCriteria: {
    pairs: {
      left: string
      right: string
    }[]
  }
}

export type Activity = OrderingActivity | MatchingActivity | TrueFalseActivity

export type ActivityAnswer = OrderingAnswer | MatchingAnswer | TrueFalseAnswer

export type ActivityWorkspaceSubmissionState =
  'unsubmitted' | 'correct' | 'not-yet'

export type ActivityResult = ActivityWorkspaceSubmissionState

export type ActivityRendererProps<TContent, TAnswer> = {
  content: TContent
  answer: TAnswer
  onAnswerChange: (answer: TAnswer) => void
  disabled: boolean
}
