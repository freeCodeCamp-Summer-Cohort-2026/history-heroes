import { useEffect } from 'react'

function App() {
  // this is just an example to verify the network call through the vite dev server proxy is working.
  useEffect(() => {
    fetch('/api/v1/hello-world')
      .then(async (response) => {
        const data = await response.text()
        console.log(
          'get hello world request, if you see this, the server is running/working!',
          {
            status: response.status,
            statusText: response.statusText,
            data,
          },
        )
      })
      .catch((error: unknown) => {
        console.error('error calling hello-world example', error)
      })
  }, [])

  return (
    <main>
      <div>
        <button
          type="button"
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-primary"
        >
          Hello world button!
        </button>
      </div>
    </main>
  )
}

export default App
