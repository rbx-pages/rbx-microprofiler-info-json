import builderHelper, {STR_TagGroups, STR_SearchTags} from "../utils/builderHelper"

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
    new TagGroupEntry(STR_TagGroups.Jobs)
        .SetDescription(
`
The Jobs group contains scopes for all TaskScheduler jobs.
Each job appears as a profiler scope whenever it runs, and the scope covers the job's entire per-frame execution.

Jobs appear in the profiler with the format: **\`\`JobName(Priority;ArbiterName)\`\`** — e.g., \`\`Simulation(Simulation;LuaApp)\`\`.
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("TS::Step")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5205839))
        .SetDescription(
`
One step of the TaskScheduler — selects and dispatches the next ready job.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("TS::JobStep")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(12088115))
        .SetDescription(
`
Executes one job's step() function — the inner scope of actual job work.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("TS::JobWait")
        .WithGroup(STR_TagGroups.Jobs)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
A job is waiting for a condition (blocked by tryJobAgain mechanism).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("TS::ArbiterStep")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(10079282))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Steps the arbiter — manages job ordering within one DataModel context.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("TS::Reschedule")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5205839))
        .SetDescription(
`
**Reschedules a job that has more work remaining.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("TS::GC")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(16744192))
        .SetDescription(
`
TaskScheduler garbage collection — removes completed or dead jobs.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Heartbeat")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(9315107))
        .SetDescription(
`
The per-frame heartbeat job — runs all heartbeat subscribers and RunService.Heartbeat callbacks.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Simulation")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(6266783))
        .SetDescription(
`
The physics simulation job — steps humanoids, animation, physics solver at fixed rate.

**Performance notes:** An umbrella for the fixed-rate step — its width is the sum of the physics solve,
humanoid stepping, and animation it runs.

**What game creators can do:**
- Reduce the number of moving physics bodies and constraints, and let bodies sleep when at rest.
- Reduce the number of actively-simulated \`Humanoid\`s and simultaneously-playing animations.
- Expand the scope to see whether physics, humanoids, or animation dominates, then target that.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RenderJob")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
**The main rendering job — executes the full render pipeline (Perform phase).**

**Performance notes:** An umbrella for the whole render pipeline — its width is the sum of its passes
(scene render, geometry updates, post-effects, GPU waits).

**What game creators can do:** Expand it and target the widest child pass — e.g. the \`Scene\` render, \`updateRenderQueue\`,
or a GPU wait (\`waitOnGpu\` / \`waitUntilCompleted\`, which indicate a GPU-bound frame). Each of those entries has its own levers.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("PreRenderJob")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(2321294))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
The pre-render job — runs the render step ahead of the main render job (and updates VR state on VR platforms).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SimpleRenderStepJob")
        .WithGroup(STR_TagGroups.Jobs)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
A render-step job used in headless / minimal rendering contexts. Calls the same render step as the main render jobs.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("InputDispatch")
        .WithGroup(STR_TagGroups.Jobs)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Dispatches input events — processes keyboard, mouse, touch, and gamepad input.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("LuaGc")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
Runs the Luau garbage collector as a scheduled job.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("WaitingHybridScriptsJob")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
Resumes scripts waiting on \`Instance:WaitForChild()\` or \`task.wait()\`.

Usually runs ~30 times per second. It has an execution-time budget,
so a heavy backlog of waiting scripts is spread across multiple runs.

**What game creators can do:**
- Reduce the number of waiting scripts, or shorten long computations before a script yields
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Allocate Bandwidth and Run Senders")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(32767))
        .SetDescription(
`
Allocates network bandwidth budget and sends replication data to clients.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Replicator_ProcessPackets")
        .WithDisplayName("Replicator ProcessPackets")
        .WithGroup(STR_TagGroups.Network)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`
Processes received network packets — deserializes incoming replication data.

Processes contents of network packets, such as motion, event invocations and property changes.

**What game creators can do:**
- Reduce the number or size of objects being replicated, or do this in incremental steps.
May increase if map size increases.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Replicator SendData")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5855659))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Sends queued instance and property data to connected clients.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Replicator StreamData")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5855659))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Streams instances to/from clients based on proximity.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Replicator GC Job")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(2321294))
        .SetDescription(
`
**Manages instance-streaming region lifecycle on the client — pauses, expands, and garbage-collects streamed regions
based on the character's position.**
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("MegaReplicatorTaskQueue")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
**Server-side replication task queues. \`MegaReplicatorTaskQueue\` runs the per-frame work of sending
replicated state out to connected clients — property changes, physics and touch updates, instance streaming,
and the initial snapshot sent to joining players; \`MegaReplicatorPPRTaskQueue\` processes incoming physics updates in parallel.
Both run on the server, so a wide block here is server frame time, not the client's.**

The work is spread across worker threads and is fundamentally per-connected-player: for each client the server serializes that
client's share of changed state. It gets wide when there is simply a lot to replicate. If it is wide, expand it —
the widest child phase (sending property changes, sending physics/touch updates, instance streaming, or a joining player's snapshot)
points to which cause below dominates.

**Performance notes:** Cost scales roughly with (connected players) × (amount of state changing per player each frame).
Player joins add a bursty spike, since a large slice of the world is serialized for the joining client.

**What game creators can do:**
- Reduce how many properties change each frame on replicated instances — avoid rewriting properties every frame;
batch or throttle updates, and change only what truly needs to replicate.
- Reduce the number of moving, network-simulated parts and unnecessary touch events; anchor parts that don't need to move.
- In large or dense worlds, lower \`Workspace.StreamingTargetRadius\` and reduce the total instance count so less is
streamed to each player.
- Spread player joins out over time where possible — join bursts are the most expensive moments.
- Fewer simultaneously connected players is the single biggest lever, since every phase scales per player.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("MegaReplicatorPPRTaskQueue")
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(32767))
        .AsAliasOf("MegaReplicatorTaskQueue")
)


export default {}
