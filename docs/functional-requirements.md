# Functional Requirements

This document outlines the functional requirements of `history-heroes`. It is roughly organized by database entity. The term "lesson" _replaces_ Hikari's use of "tutorial" in the core issues.

**Note: All numbers in brackets are references to Hikari's user stories as GitHub issue numbers.**

## General

1. The learner is identified by a stable account so their progress can be attributed to them. Core uses a seeded development learner resolved by the server; there is no login flow. Real authentication is tracked in [#71](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/71) and is out of scope for Core. [[#16](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/16)]
2. The learner's completed lessons and labs are saved to their account. The learner may resume progress in any module at the point of their last completed lesson/lab. [[#16](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/16)]
3. All modules will be visible as a list from one page (whether that is a dedicated modules page, or a home page).
4. All modules will be accessible and completable in any order. No module will be a prerequisite for any other module. [[#1](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/1)]
5. The learner must be able to choose a module based on its time period or theme. [[#1](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/1)]

## Modules

1. The learner must be able to view the contents of an individual module.
2. Each module will contain data regarding its subject matter (period, theme, etc.). [[#1](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/1)]
3. Each module will contain one or more lessons. A module may also contain one lab.
4. Each module's lessons will be progressive, i.e. the learner must complete them in a specific order. [[#2](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/2)]
   - The learner cannot access any given lesson until its preceding lesson is completed (partial or incomplete work does not count). The only exception is the first lesson of a module, which is initially available for the learner to complete.
   - Completed lessons will remain available for the learner to review.
5. When the learner views the contents of a module, there must be an indicator of where the learner is in the sequence.

## Lessons

1. Each lesson will contain both (1) text content which is passively read, and (2) one or more activities which are interactively completed by the learner. [[#3](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/3)]
2. Each lesson's activities will be embedded in the same page as the lesson's text content. Navigating to a lesson's activity may require no action except scrolling the page. [[#5](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/5), [#6](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/6)]
3. Each lesson's activities must be completed in a predefined order tied to the lesson.
4. Each lesson will be completable. When a learner completes a lesson, they will be given options to move to the next lesson in the module, or to exit to viewing the overall module's contents.

## Labs

1. Each lab will only require facts already covered in a prior lesson within its parent module. [[#13](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/13)]
2. Each lab will contain one or more activities.
3. Each lab will be considered complete when all of its activities are completed.
4. A module will contain at most one lab. A module with no lab is valid, but at least one module must contain a lab, since Core requires completed labs to be saved and restored.
5. A module's lab comes after all of that module's lessons. Labs and lessons do not share an ordering sequence, and a lab does not carry an order index.

## Activities

1. Each activity must include success criteria.
2. Each activity must include a description of its task/goal and how its items can be used, e.g. "Arrange the events in chronological order on this timeline." The description must never supply a step-by-step list of instructions, e.g. "Click and drag the US Constitution to the second slot in the timeline." [[#12](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/12)]
3. When the learner attempts to complete an activity, the activity will show a plain-language statement of what it checks (its "check statement"). This statement will be shown regardless of whether the learner's attempt is successful. [[#8](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/8)]
4. When the learner attempts to complete an activity, the activity must (at least) use colors and feedback text to convey whether or not the learner has met the activity's success criteria. [[#11](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/11)]
5. An activity's feedback text will meet two requirements [[#9](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/9)]:
   - It will specifically address the error the learner made, e.g. "The Pyramids of Giza are not in China," rather than a generic "Correct" or "Incorrect."
   - It must not instruct the learner exactly what to do. (For example, feedback text of "Match the Pyramids of Giza with Egypt" would break this requirement.)
6. Learner must interact with activity (e.g.: arrange, match, place) inside an interactive workspace. Example: activity contains events (represented as cards) to put on a timeline UI → learner clicks and drags each event into order. [[#3](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/3), [#5](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/5)]
7. The interactive workspace of each activity must include immediate UI effects triggered by interaction, e.g. a card representing an event may snap into place on a timeline interface when the learner clicks and drags it to a spot on the timeline. Such interactivity must not cause the learner to leave or reload the page. (Such interactivity does not need to include correctness evaluation.) [[#6](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/6)]
8. Each activity's interface must include a mechanism for the learner to attempt to complete the activity, which will trigger a correctness evaluation.

## Response Shapes

These are the agreed shapes for the API. Client work can be built against them as fixtures while the matching API issue is still in progress.

Collections return a bare array rather than a wrapped object, matching `GET /api/v1/modules` as it ships today. Unknown ids return a 404.

All ids are kebab-case slugs, matching the existing seed files.

### Modules

`GET /api/v1/modules`

```json
[
  {
    "id": "seven-wonders",
    "title": "The Seven Wonders of the Ancient World",
    "description": "A module on the seven wonders of the ancient world.",
    "period": "Ancient World",
    "theme": "Architecture and Engineering",
    "order": 1
  }
]
```

`period` and `theme` are added to the entity by [#50](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/50) and populated by [#102](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/102). Until both land the endpoint returns the other four fields only.

### Lessons

`GET /api/v1/modules/:moduleId/lessons`

Returns every lesson in the module in ascending `orderIndex` order. A module with no lessons will return an empty array.

```json
[
  {
    "id": "great-pyramid",
    "moduleId": "seven-wonders",
    "title": "The Great Pyramid of Giza",
    "description": "A lesson on the Great Pyramid of Giza",
    "orderIndex": 1,
    "contents": "markdown string",
    "activityIds": ["order-pyramid-build-stages"]
  }
]
```

[#51](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/51) named `id`, `moduleId`, `title`, and `orderIndex` as the minimum. `description`, `contents`, and `activityIds` are included in that same response, so there is no separate single-lesson endpoint. A page rendering one lesson finds it in this array by id.

`orderIndex` is unique within a module and runs unbroken from 1.

### Lesson Activities

`GET /api/v1/lessons/:lessonId/activities`

Returns the lesson's activities in the order given by that lesson's `activityIds`. The shape is the authored activity shape from [#53](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/53), passed through unchanged.

```json
[
  {
    "id": "order-pyramid-build-stages",
    "type": "ordering",
    "title": "Put the building stages in order",
    "checkStatement": "This checks if you put the four building stages in the order they actually happened",
    "content": {
      "items": [{ "id": "flatten-the-ground", "label": "Flatten the ground" }]
    },
    "successCriteria": { "correctOrder": ["flatten-the-ground"] }
  }
]
```

`successCriteria` is included in the response and the client evaluates the submission, consistent with [#64](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/64) scoping evaluation as client work. Preventing a learner from reading the answer out of the network tab is out of scope for Core.

### Labs

`GET /api/v1/modules/:moduleId/lab`

Returns that module's lab. A 404 means either the module id is unknown or that module has no lab.

```json
{
  "id": "seven-wonders-lab",
  "moduleId": "seven-wonders",
  "title": "The Seven Wonders Timeline",
  "description": "A lab covering the whole seven wonders module.",
  "activityIds": ["order-all-seven-wonders"]
}
```

`GET /api/v1/labs/:labId/activities`

Returns the lab's activities in `activityIds` order, in exactly the same shape as lesson activities. [#53](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/53) already requires the authored activity format to be reusable for labs.

### Authored Lab Seed Data

Authored labs live in `server/data/seeds/initial-labs.json`, shaped `{ "labs": [ ... ] }`, consistent with the modules and activities seed files.

Activity ids are unique across the whole curriculum, and an activity belongs to exactly one lesson or one lab, never both.

## Content Author (Stretch)

Note: the authored _format_ for success criteria is Core and is specified in [#53](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/53). Only the content author's _interface_ is Stretch.

1. The content author will be able to create and log into their account.
2. The content author will be able to create modules, lessons, labs, and activities.
3. The same interface which the content author uses to create a new lesson must also allow the content author to define success criteria for the new lesson. [[#20](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/issues/20)]

## Open Questions

- Is there a way for learners to mark lesson(s) as complete and unlock the following one(s) without going through the lesson from start to finish?
