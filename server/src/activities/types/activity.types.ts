// TODO: these types will probably be moved to some DTO folder once there is an endpoint
export type ActivityType = 'ordering' | 'matching' | 'true-false';

export interface OrderingContent {
  items: Array<{
    id: string;
    label: string;
  }>;
}

export interface OrderingSuccessCriteria {
  correctOrder: string[];
}

export interface MatchingContentItem {
  id: string;
  label: string;
}

export interface MatchingContent {
  left: MatchingContentItem[];
  right: MatchingContentItem[];
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingSuccessCriteria {
  pairs: MatchingPair[];
}

export interface TrueFalseContent {
  statement: string;
}

export interface TrueFalseSuccessCriteria {
  correctAnswer: boolean;
}

export type ActivityContent =
  OrderingContent | MatchingContent | TrueFalseContent;

export type ActivitySuccessCriteria =
  OrderingSuccessCriteria | MatchingSuccessCriteria | TrueFalseSuccessCriteria;
