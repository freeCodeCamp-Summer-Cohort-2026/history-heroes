import type {
  TrueFalseContent,
  TrueFalseAnswer,
  ActivityRendererProps,
} from './types'

export default function TrueFalseRenderer({
  content,
  answer,
  onAnswerChange,
  disabled,
}: ActivityRendererProps<TrueFalseContent, TrueFalseAnswer>) {
  return (
    <fieldset className="space-y-3">
      <legend>{content.statement}</legend>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="true-false"
          className="radio"
          checked={answer.value === true}
          disabled={disabled}
          onChange={() => {
            onAnswerChange({ value: true })
          }}
        />
        True
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="true-false"
          className="radio"
          checked={answer.value === false}
          disabled={disabled}
          onChange={() => {
            onAnswerChange({ value: false })
          }}
        />
        False
      </label>
    </fieldset>
  )
}
