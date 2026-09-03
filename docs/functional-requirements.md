# Functional Requirements

## Overall
 - The learner will be able to create and log into their account, which will save their progress in the modules. Issue #16
 - All modules will be visible either (1) directly from the Home/Dashboard page, or (2) a dedicated Modules page, which would be accessible from the Home/Dashboard page.
 - All modules will be accessible and completable in any order. No module will be a prerequisite for any other module. Issue #1

## Modules
 - The learner must be able to view the contents of an individual module.
 - Each module will contain one or more tutorials and one or more labs. 
 - Each module's tutorials and labs will be progressive, i.e. the learner completes them in a specific order. Issue #2
 - When the learner views the contents of a module, there must be an indicator of where the learner is in the sequence.

### Lessons
 - Each tutorial will contain both (1) text content which is passively read, and (2) one or more activities which are interactively completed by the learner. Issue #3
 - Each tutorial's activities will be embedded in the same page as the tutorial's text content. Navigating to a tutorial's activity may require no action except scrolling the page. Issues #5, #6
 - Each tutorial's activities must be completed in a predefined order tied to the lesson.
- User reaches final lesson → clicks on "continue" button → user is taken to next lesson/lab in the module

### Lab (challenge)
 - Each lab will contain one or more activities.
 - Each lab will be considered complete when all of its activities are completed.

### Activity (proposed, needs review)
- Each activity must include completion criteria.
- User reads instruction "order the events" and the available events → clicks and drag each event into order → user clicks "check answer" button [Addresses issues #3 and #5]
- If one or more position(s) is incorrect  → shows red "X" mark besides wrong answer(s) + a pop-up saying "try again" → user rearranges answer [Addresses issue #11]
- If all answers correct  → pop-up saying "correct"  → user clicks on "next" button → user is taken to next lesson

## Open Questions
- Is each wonder a different lesson?
- Is there only one tutorial per module or is it one per lesson? 
- Is there only one lab per module?
