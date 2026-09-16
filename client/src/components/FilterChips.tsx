type FilterChipsProps = {
  options: string[]
  selected: string
  onSelect: (option: string) => void
}

export default function FilterChips({
  options,
  selected,
  onSelect,
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`btn btn-sm w-full sm:w-auto ${
            selected === option ? 'btn-primary' : 'btn-outline btn-secondary'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
