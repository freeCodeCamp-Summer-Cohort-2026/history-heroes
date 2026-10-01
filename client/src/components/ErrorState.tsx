type ErrorStateProps = {
  message: string
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div role="alert" className="alert alert-error">
      <p>{message}</p>
    </div>
  )
}
