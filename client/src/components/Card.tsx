/**
 * A generic styled div that can be used to wrap some content with no extra semantic meaning.
 */
export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="card border border-base-300 bg-base-100 w-full sm:w-auto">
      <div className="card-body gap-3 sm:gap-4 p-4 sm:p-6">{children}</div>
    </div>
  )
}
