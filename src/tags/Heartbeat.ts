import builderHelper, {STR_TagGroups} from "../utils/builderHelper"

const TagDataClasses = builderHelper.TagDataClasses
const TagDataBuilder = builderHelper.TagDataBuilder

const TagTokenEntry = TagDataClasses.TagTokenEntry
const TagGroupEntry = TagDataClasses.TagGroupEntry
const TagLabel = TagDataClasses.TagLabel

const DecimalToRgb = builderHelper.DecimalToRgb
const makeLabelName = TagDataBuilder.makeLabelName

const builder = builderHelper.currentBuilder

// ---

builder.AddTagGroup(
    new TagGroupEntry(STR_TagGroups.Heartbeat)
        .SetDescription(
`
The Heartbeat group contains scopes for the per-frame heartbeat step — it fires RunService.Heartbeat
callbacks once per frame on the main thread.
Heartbeat is one of several per-frame steps run by the task scheduler;
physics, rendering, and scripts are separate steps documented in their own groups.
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("heartbeatInternal")
        .WithGroup(STR_TagGroups.Heartbeat)
        .WithColor(DecimalToRgb(6266783))
        .SetDescription(
`Fires the internal heartbeat signal to all engine systems that subscribe to the per-frame heartbeat.
This is the engine-internal heartbeat that notifies services like ProximityPromptService, PointsService,
and other engine subsystems that a new frame has begun. It passes wall time, game time, and delta values to all connected listeners.

Nesting: Top-level scope on the main thread. All service onHeartbeat callbacks run inside this scope.

Performance notes: This is the aggregate of every engine service subscribed to the per-frame heartbeat,
so a wide scope usually means one nested callback dominates — drill into the per-service scopes
(e.g. proximityPromptOnHeartbeat) to find it.
Some of this cost scales with your experience's content: for example, the number of active
ProximityPrompts drives proximityPromptOnHeartbeat
(see that scope for how to reduce it).

**What game creators can do:**
Expand it and reduce the content driving the widest child (for example, fewer active ProximityPrompts reduces proximityPromptOnHeartbeat). Note this is engine-service work —
your own per-frame script code shows up under RunService.Heartbeat, not here.`
        )
)



builder.AddTagToken(
    new TagTokenEntry("proximityPromptOnHeartbeat")
        .WithGroup(STR_TagGroups.Heartbeat)
        .WithColor(DecimalToRgb(9180951))
        .SetDescription(
`Each frame, this scope iterates over all active ProximityPrompt instances, checks player distance,
performs line-of-sight raycasts, and determines which prompts should be displayed.
It handles the "best fit" selection when multiple prompts compete for screen space.

**Nesting:** Fires inside heartbeatInternal as a heartbeat subscriber.

**Performance notes:** Cost scales with the number of active ProximityPrompt instances in the workspace.
Each prompt requires distance checks, and visible prompts require raycasts for line-of-sight verification.

**What game creators can do:**
- Reduce the number of ProximityPrompt instances in the workspace
- Set RequiresLineOfSight = false on prompts that don't need it (eliminates raycasts)
- Decrease MaxActivationDistance thresholds to reduce the pool of candidates
- Disable prompts that are far from any player`
        )
)


export default {}
