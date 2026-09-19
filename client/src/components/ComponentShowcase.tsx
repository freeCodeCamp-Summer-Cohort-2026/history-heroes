/* This is just a page to test all the components, it is not needed for the project, just handy for now */

import Button from './Button'
import FeedbackState from './FeedbackState'
import LessonListItem from './LessonListItem'
import ModuleCard from './ModuleCard'
import FilterChips from './FilterChips'
import ProgressIndicator from './ProgressIndicator'
import type { Lesson } from '../features/lesson/model/Lesson'

const showcaseLessons: Record<string, Lesson> = {
  locked: {
    id: 'lesson-1',
    moduleId: 'module-1',
    title: 'Locked lesson',
    description: 'You must complete the previous lesson first.',
    orderIndex: 1,
    contents: '',
    activityIds: [],
  },
  unlocked: {
    id: 'lesson-2',
    moduleId: 'module-1',
    title: 'Unlocked lesson',
    description: 'Ready to start learning.',
    orderIndex: 2,
    contents: '',
    activityIds: [],
  },
  completed: {
    id: 'lesson-3',
    moduleId: 'module-1',
    title: 'Completed lesson',
    description: "You've finished this lesson.",
    orderIndex: 3,
    contents: '',
    activityIds: [],
  },
}

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

      {/* Filter Chips */}
      <section className="space-y-4">
        <h2 className="text-heading">Filter chips</h2>
        <FilterChips
          options={['All', 'Ancient', 'Middle Ages']}
          selected="All"
          onSelect={(opt) => console.log(opt)}
        />
      </section>

      {/* Progress Indicator */}
      <section className="space-y-4">
        <h2 className="text-heading">Progress indicator</h2>
        <div className="space-y-2">
          <ProgressIndicator current={1} total={3} label="Lesson" />
          <ProgressIndicator current={2} total={3} label="Activity" />
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
          <LessonListItem lesson={showcaseLessons.locked} state="locked" />
          <LessonListItem lesson={showcaseLessons.unlocked} state="unlocked" />
          <LessonListItem
            lesson={showcaseLessons.completed}
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
            checked="We checked whether all three events were placed in chronological order."
            successMessage="Your answer matches the expected result."
          />
          <FeedbackState
            type="not-yet"
            checked="We checked whether all three events were placed in chronological order."
            expected="Events should go from earliest to latest."
            yours="The first two events are out of order."
            actionLabel="Try again"
            onAction={() => console.log('Try again clicked')}
          />
        </div>
      </section>
    </main>
  )
}
