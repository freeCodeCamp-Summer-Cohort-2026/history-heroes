# Functional Requirements

This document outlines the functional requirements of `history-heroes`. It is roughly organized by database entity. The terms "lesson" and "tutorial" are interchangeable.

**Note: All numbers in brackets are references to Hikari's user stories as GitHub issue numbers.**

## Overall

- The learner will be able to create and log into their account, which will save their progress in the modules. [#16]
- The learner will be able to pause and resume progress in any module or lesson. [#16]
- All modules will be visible as a list from one page (whether that is a dedicated modules page, or a home page).
- All modules will be accessible and completable in any order. No module will be a prerequisite for any other module. [#1]
- The learner must be able to choose a module based on its time period or theme. [#1]

## Modules

- The learner must be able to view the contents of an individual module.
- Each module will contain data regarding its subject matter (period, theme, etc.). [#1]
- Each module will contain one or more tutorials and one or more labs.
- Each module's tutorials and labs will be progressive, i.e. the learner must complete them in a specific order. [#2]
- When the learner views the contents of a module, there must be an indicator of where the learner is in the sequence.

## Lessons

- Each tutorial will contain both (1) text content which is passively read, and (2) one or more activities which are interactively completed by the learner. [#3]
- Each tutorial's activities will be embedded in the same page as the tutorial's text content. Navigating to a tutorial's activity may require no action except scrolling the page. [#5, #6]
- Each tutorial's activities must be completed in a predefined order tied to the lesson.
- User reaches final lesson → clicks on "continue" button → user is taken to next lesson/lab in the module

## Lab

- Each lab will only require facts already covered in a prior tutorial within its parent module. [#13]
- Each lab will contain one or more activities.
- Each lab will be considered complete when all of its activities are completed.

## Activity

- Each activity must include completion criteria.
- Each activity must include a description of its task/goal and how its items can be used, e.g. "Arrange the events in chronological order on this timeline." The description must never supply a step-by-step list of instructions, e.g. "Click and drag the US Constitution to the second slot in the timeline." [#8, #12]
- When a learner either (1) is in the process of completing an activity or (2) has made an attempt at completing it (possibly depending on its implementation), the activity should (at least) use colors and feedback text to convey whether or not the learner has has met the activity's completion criteria. [#11]
- An activity's feedback text will meet two requirements [#9]:
  - It will specifically address the error the learner made, e.g. "The Pyramids of Giza are not in China," rather than a generic "Correct" or "Incorrect."
  - It must not instruct the learner exactly what to do. (For example, feedback text of "Match the Pyramids of Giza with Egypt" would break this requirement.)
- Learner must interact with activity (e.g.: arrange, match, place) inside an interactive workspace. Example: Activity contains events (represented as cards) to put on a timeline UI → learner clicks and drags each event into order → learner clicks "check answer" button [#3, #5]
- Activity must offer immediate feedback upon learner's input (e.g.: learner reads instruction to order the available events → clicks on an event and place it on the timeline → if correct, event snaps into place. If incorrect, event goes back to default position.) This must not cause the learner to leave or reload the page. [#3, #6]

## Open Questions

- Can learners skip ahead?
- Can learners return to earlier tutorials?
- What counts as completing a tutorial?
- How is the next tutorial identified?
- Must the workspace support controls other than dragging?
- Is there only one activity per module or is it one per lesson?
- Is there only one lab per module?
