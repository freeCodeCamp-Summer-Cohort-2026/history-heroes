import { useId } from 'react'
import type {
  ActivityRendererProps,
  DropdownSelectAnswer,
  DropdownSelectContent,
} from './types'

export default function DropdownSelectRenderer({
  content,
  answer,
  onAnswerChange,
  disabled,
}: ActivityRendererProps<DropdownSelectContent, DropdownSelectAnswer>) {
  const selectId = useId()

  return (
    <div className="space-y-3">
      <label htmlFor={selectId}>{content.prompt}</label>

      <select
        id={selectId}
        className="select w-full"
        value={answer.selectedOptionId ?? ''}
        disabled={disabled}
        onChange={(event) => {
          onAnswerChange({
            selectedOptionId: event.target.value || null,
          })
        }}
      >
        <option value="">Select an option</option>

        {content.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
