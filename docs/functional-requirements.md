# Functional Requirements

This document outlines the functional requirements of `history-heroes`. It is roughly organized by database entity. The term "lesson" *replaces* Hikari's use of "tutorial" in the core issues.

**Note: All numbers in brackets are references to Hikari's user stories as GitHub issue numbers.**

## General

1. The learner will be able to create and log into their account. [#16]
2. The learner's completed lessons and labs are saved to their account. The learner may resume progress in any module at the point of their last completed lesson/lab. [#16]
3. All modules will be visible as a list from one page (whether that is a dedicated modules page, or a home page).
4. All modules will be accessible and completable in any order. No module will be a prerequisite for any other module. [#1]
5. The learner must be able to choose a module based on its time period or theme. [#1]

## Modules

1. The learner must be able to view the contents of an individual module.
2. Each module will contain data regarding its subject matter (period, theme, etc.). [#1]
3. Each module will contain one or more lessons and one or more labs.
4. Each module's lessons will be progressive, i.e. the learner must complete them in a specific order. [#2]
5. When the learner views the contents of a module, there must be an indicator of where the learner is in the sequence.

## Lessons

1. Each lesson will contain both (1) text content which is passively read, and (2) one or more activities which are interactively completed by the learner. [#3]
2. Each lesson's activities will be embedded in the same page as the lesson's text content. Navigating to a lesson's activity may require no action except scrolling the page. [#5, #6]
3. Each lesson's activities must be completed in a predefined order tied to the lesson.
4. Each lesson will be completable. When a learner completes a lesson, they will be given options to move to the next lesson in the module, or to exit to viewing the overall module's contents.

## Lab

1. Each lab will only require facts already covered in a prior lesson within its parent module. [#13]
2. Each lab will contain one or more activities.
3. Each lab will be considered complete when all of its activities are completed.

## Activity

1. Each activity must include completion criteria.
2. Each activity must include a description of its task/goal and how its items can be used, e.g. "Arrange the events in chronological order on this timeline." The description must never supply a step-by-step list of instructions, e.g. "Click and drag the US Constitution to the second slot in the timeline." [#12]
3. When the learner attempts to complete an activity, the activity will show a plain-language statement of what it checks (its "check statement"). This statement will be shown regardless of whether the learner's attempt is successful. [#8]
4. When the learner attempts to complete an activity, the activity must (at least) use colors and feedback text to convey whether or not the learner has met the activity's completion criteria. [#11]
5. An activity's feedback text will meet two requirements [#9]:
  - It will specifically address the error the learner made, e.g. "The Pyramids of Giza are not in China," rather than a generic "Correct" or "Incorrect."
  - It must not instruct the learner exactly what to do. (For example, feedback text of "Match the Pyramids of Giza with Egypt" would break this requirement.)
6. Learner must interact with activity (e.g.: arrange, match, place) inside an interactive workspace. Example: activity contains events (represented as cards) to put on a timeline UI → learner clicks and drags each event into order. [#3, #5]
7. The interactive workspace of each activity must include immediate UI effects triggered by interaction, e.g. a card representing an event may snap into place on a timeline interface when the learner clicks and drags it to a spot on the timeline. Such interactivity must not cause the learner to leave or reload the page. (Such interactivity does not need to include correctness evaluation.) [#6]
8. Each activity's interface must include a mechanism for the learner to attempt to complete the activity, which will trigger a correctness evaluation.

## Content Author (Stretch)

1. The content author will be able to create and log into their account.
2. The content author will be able to create modules, lessons, labs, and activities.
3. The same interface which the content author uses to create a new lesson must also allow the content author to define success criteria for the new lesson. [#20]

## Open Questions

- Are a module's labs progressive alongside its lessons, or will labs follow a different structure?
- Can learners skip ahead?
- Can learners return to earlier lessons?
- What counts as completing a lesson?
- How is the next lesson identified?
- What characteristics should an activity's check statement possess?
- Must the workspace support controls other than dragging?
- Is there only one lab per module?
- Can the content author directly define success criteria for new activities tied to lessons (or labs)?
