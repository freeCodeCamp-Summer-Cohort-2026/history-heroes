/* This is just a page to test all the components, it is not needed for the project, just handy for now*/

import Button from './Button'
import FeedbackState from './FeedbackState'
import LessonListItem from './LessonListItem'
import ModuleCard from './ModuleCard'

export default function ComponentShowcase() {
  return (
    <main className="space-y-10 p-6">
      <section>
        <h1 className="text-display">Component showcase</h1>
        <p className="mt-2 text-body">
          Visual testing for the History Heroes shared components.
        </p>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-heading">Buttons</h2>

        <div className="flex flex-wrap gap-4">
          <Button>Primary button</Button>
          <Button variant="secondary">Secondary button</Button>
        </div>
      </section>

      {/* Module cards */}
      <section className="space-y-4">
        <h2 className="text-heading">Module cards</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            title="Seven Wonders"
            description="Discover the wonders of the ancient world."
          />

          <ModuleCard
            title="Ancient Rome"
            description="Explore daily life, politics and culture in Rome."
          />
        </div>
      </section>

      {/* Lesson list */}
      <section className="space-y-4">
        <h2 className="text-heading">Lesson list items</h2>

        <div className="space-y-3">
          <LessonListItem
            title="Locked lesson"
            description="You must complete the previous lesson first."
            state="locked"
          />

          <LessonListItem
            title="Unlocked lesson"
            description="Ready to start learning."
            state="unlocked"
          />

          <LessonListItem
            title="Completed lesson"
            description="You've finished this lesson."
            state="completed"
          />
        </div>
      </section>

      {/* Feedback */}
      <section className="space-y-4">
        <h2 className="text-heading">Feedback states</h2>

        <div className="space-y-4">
          <FeedbackState
            type="correct"
            message="Your answer matches the expected order."
          />

          <FeedbackState
            type="not-yet"
            message="The first two events are out of order."
            actionLabel="Try again"
          />
        </div>
      </section>
    </main>
  )
}
