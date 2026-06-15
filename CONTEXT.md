# Pool Tracker

A self-hosted, single-user mobile web app for tracking pool water chemistry, chemical additions, and maintenance sessions.

## Language

**Test Log**:
A recorded set of water chemistry readings taken at a point in time, covering up to six parameters.
_Avoid_: water test, test result, chemistry reading

**Chemical Log**:
A recorded chemical addition — the substance, amount, and unit applied to the pool.
_Avoid_: chemical addition, chemical entry, dosing record

**Maintenance Log**:
A recorded maintenance session — the date and the set of activities performed.
_Avoid_: maintenance visit, maintenance record, service log

**Pool Profile**:
The owner-configured facts about the pool: volume, type, and ideal parameter ranges.
_Avoid_: pool settings, pool config, pool setup

**Parameter**:
A single water chemistry metric tracked by the app (e.g., pH, free chlorine, total alkalinity, cyanuric acid, calcium hardness, total dissolved solids).
_Avoid_: reading, value, metric, measurement

**Ideal Range**:
The owner-configured minimum and maximum acceptable values for a parameter, stored in the Pool Profile.
_Avoid_: target range, safe range, normal range

**Recommendation**:
An auto-generated plain-language action suggestion produced when a parameter falls outside its Ideal Range.
_Avoid_: suggestion, alert, advice, tip

**Pool Type**:
The sanitization system of the pool: Chlorine or Salt. Determines which parameters are shown and tracked.
_Avoid_: pool system, sanitizer type

**Dashboard**:
The primary screen — shows the most recent Test Log's parameter values alongside their status and Recommendations.
_Avoid_: home screen, main screen, overview
