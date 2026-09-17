import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import ScrollToTop from '../ScrollToTop'

test('scrolls to the top when the page changes', async () => {
  const scrollSpy = vi.spyOn(window, 'scrollTo')

  render(
    <MemoryRouter initialEntries={['/']}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Link to="/next">Go to the next page</Link>} />
        <Route path="/next" element={<p>Next page</p>} />
      </Routes>
    </MemoryRouter>,
  )

  scrollSpy.mockClear()
  fireEvent.click(screen.getByText('Go to the next page'))
  await screen.findByText('Next page')

  expect(scrollSpy).toHaveBeenCalledWith(0, 0)
})
