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
    new TagGroupEntry(STR_TagGroups.Network)
        .SetDescription(
`
The Network group contains scopes for the replication system, instance streaming,
join flow, packet processing, and bandwidth management.
These scopes fire on the main thread (replication step)
and on network worker threads (packet deserialization, HTTP).

## Replication Pipeline (MegaReplicator)

The MegaReplicator orchestrates all replication work each frame. These scopes run sequentially within the network step.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Force World Assemble")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Forces all pending physics assemblies to be assembled before replication.**

Ensures the physics world is in a consistent state before replicating positions and velocities to clients.

**Performance notes:** Normally fast. Can spike after large batches of part additions.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("PrepopulateMRDs")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Pre-populates MegaReplicator Descriptors for new instances that need replication.**

Sets up the replication metadata for newly-created instances so they can be sent to clients.

**Performance notes:** Cost proportional to new instances per frame.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RaiseCompleteness")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Propagates completeness state through the instance hierarchy — determines what clients can see.**

Completeness tracks which portions of the instance tree are fully replicated to a client. This scope propagates "complete" marks up the tree.

**Performance notes:** Can be expensive during initial join when large hierarchies become complete.

**Labels:** \`"Completeness expected raised X/Y"\` — shows how many instances had completeness raised vs total.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Updating Mega World Extents")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Updates the spatial bounds of the replicated world for streaming calculations.**

Recalculates the bounding box of all streamable content to help the streaming solver determine what to send.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Prepare Physics Rep Assembly List Sync")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Synchronizes the physics replication assembly list with the current world state.**

Ensures the list of physics assemblies that need replication matches what actually exists in the physics world.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SharedQCleanUp")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Cleans up the shared replication queue — removes completed or expired items.**

Garbage-collects items from the shared data queue that have been sent to all relevant clients.

**Performance notes:** Normally fast. Can accumulate work if many items expire simultaneously.

**Labels:** \`"SharedQueue: X (will clean up: Y)"\` and \`"Eligible Cleanup Items breakdown"\` — shows queue size and cleanup volume.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Deferred MotorAngles update")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Applies previously received, deferred Motor6D angle updates to the physics world (receive side).**

Runs in the physics receive job: iterates the deferred motor-angle entries and writes them onto each assembly's physics state. This is a receive-side application step, not a send-side batching step.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("GenerateJDIv2")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Generates Join Data Items v2 — prepares replication data for the join snapshot.**

Creates the data packets that form the initial state snapshot sent to newly-joining clients.

**Performance notes:** Expensive during player joins. Cost proportional to world size.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Detect Join-Batchable Replicators")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Identifies replicators that can be batched together during join for efficiency.**

Groups related replication items that can be sent in a single batch rather than individually.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Prebuild join cache")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Pre-builds cached data for the join snapshot to speed up subsequent joins.**

Caches serialized data that doesn't change between joins so it doesn't need re-serialization.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("ISR Update Timestamp Offsets")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Updates Instance State Replicator timestamp offsets for clock synchronization.**

Adjusts timestamps to account for clock differences between server and clients.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Dispatch ISR Prep And Send")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Dispatches the ISR (Instance State Replicator) preparation and sending phase.**

The ISR handles fine-grained property replication. This scope prepares and sends property updates.

**Performance notes:** Cost proportional to the number of dirty properties this frame.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Update and allocate bandwidth")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Allocates available network bandwidth to replicators based on priority.**

Distributes the frame's bandwidth budget across all pending replication items, prioritizing important data.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Replicator Status Checks")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Checks replicator connection health — detects disconnects and timeout conditions.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Assign Network Object Priorities")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Assigns priorities to network objects based on distance, relevance, and importance.**

Determines which objects get bandwidth first based on their proximity to players, visibility, and game importance.

**Performance notes:** O(replicated objects). Can be expensive in large worlds.
`
        )
)

// LR Pull Manager Notify / LR Pull Manager Generate
builder.AddTagToken(
    new TagTokenEntry("LR Pull Manager Notify")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Large Replicator pull manager — notifies and generates large data transfers.**

Handles the "pull" protocol for large objects that are requested by clients rather than pushed by the server.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("LR Pull Manager Generate")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("LR Pull Manager Notify")
)

builder.AddTagToken(
    new TagTokenEntry("Dispatch Data Senders")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Dispatches all data sender tasks — sends queued replication data to clients.**

The main data sending phase. Iterates over all connected clients and sends their pending replication data. Sends property changes, remote event invocations, Humanoid state changes, animation state changes, and replication of new instances.

**Performance notes:** Cost = (connected players) × (data per player). The primary network bandwidth consumer.

**What game creators can do:**
- Reduce the number of replicated changes to the data model

**Labels:** \`"Connected Players : X"\` refers to the total number of players who finished joining the game, and \`"Pending Players : X"\` refers to the total number of players currently joining the game. These are frame-level Network labels emitted once per network step, not inside this scope.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Send clusters")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Sends terrain data to clients.**

Serializes and sends terrain voxel data that clients need but don't have yet.

**Performance notes:** Expensive when players move into new terrain areas that haven't been streamed yet.

**What game creators can do:**
- Reduce the amount or size of terrain changes
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Cluster: insufficient buffer to send")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Diagnostic scope — fires when a cluster's data exceeds the send buffer.**

Indicates that terrain data is too large for the current buffer allocation.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Dispatch PhysicsSenders and TouchSenders")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Sends physics state updates (positions, velocities) and touch events to clients.**

The physics replication sending phase. Sends CFrame/Velocity data for moving objects. This will soon be deprecated as Roblox transitions to use \`ISRSendStep\` to replicate physics data.

**Performance notes:** Cost proportional to moving physics objects × connected clients.

**What game creators can do:**
- Reduce the amount of moving objects and/or touches
`
        )
)

// CompletenessPropagation / CompletenessFinalization / CompletenessUpdateExpectedChildren
builder.AddTagToken(
    new TagTokenEntry("CompletenessPropagation")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Multi-phase completeness state propagation and finalization.**

Propagates the completeness state through the instance tree and finalizes it for this frame.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("CompletenessFinalization")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("CompletenessPropagation")
)
builder.AddTagToken(
    new TagTokenEntry("CompletenessUpdateExpectedChildren")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("CompletenessPropagation")
)

builder.AddTagToken(
    new TagTokenEntry("Preserialize network streams")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Pre-serializes network data streams — encodes data ahead of the send phase.**

Serializes replication data into the wire format before the actual network send. This allows serialization to happen separately from I/O.

**Performance notes:** CPU-bound serialization work. Cost proportional to data volume.

**Labels:** \`"Items to preserialize : X"\` — shows the work volume.
`
        )
)

// Data Senders / Send Item
builder.AddTagToken(
    new TagTokenEntry("Data Senders")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Sends individual replication items to a specific client.**

Per-item, per-client send operation.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Send Item")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Data Senders")
)

// Sending Globals / Sending Network Schema
builder.AddTagToken(
    new TagTokenEntry("Sending Globals")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Two distinct join-flow scopes: \`Sending Globals\` sends global setup data to a newly-joining client; \`Sending Network Schema\` sends the serialization schema.**

Part of the join flow. \`Sending Network Schema\` transmits only the serialization schema (so the client can decode future messages), while \`Sending Globals\` transmits initial global setup data — the two are separate operations.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Sending Network Schema")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Sending Globals")
)

builder.AddTagToken(
    new TagTokenEntry("Dispatch StreamJob")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Dispatches the streaming job — determines what to stream in/out based on player position.**

The main streaming orchestrator. Calculates which instances should be streamed to or from each client based on their focus position and streaming radius.

**Performance notes:** Cost depends on world size and streaming density. Runs every frame on the server.

**What game creators can do:**
- Lower \`Workspace.StreamingTargetRadius\` — the main lever for streaming workload (\`StreamingMinRadius\` is the always-loaded floor that never streams out, so lowering it mainly reduces resident content rather than this dispatch cost)
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("StreamJob")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**The actual streaming computation — priority-based instance streaming decisions.**

Computes streaming priorities and makes send/remove decisions for each client's stream region.

**Performance notes:** Can be expensive in large worlds with many streamable instances.

**What game creators can do:**
- Set appropriate \`StreamingMinRadius\` and \`StreamingTargetRadius\` on Workspace
- Use \`ModelStreamingMode\` to control per-model streaming behavior
- Reduce the total number of instances in the workspace
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("StreamingSolverV2")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**The streaming solver — spatial computation for which instances are in range.**

Uses spatial data structures to efficiently determine which instances fall within each player's streaming radius.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("InstanceObjectManager")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Manages instance lifecycle for streaming — creates/destroys instances as they stream in/out.**

Handles the actual creation and teardown of instances on the client as they enter or leave the streaming radius.
`
        )
)

// Replication Foci Streaming / Foci and Set Changes / Refresh Tracked Location
builder.AddTagToken(
    new TagTokenEntry("Replication Foci Streaming")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Manages streaming focus points — where each client is "looking" for streaming purposes.**

Updates the spatial positions that define each client's area of interest.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Foci and Set Changes")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Replication Foci Streaming")
)
builder.AddTagToken(
    new TagTokenEntry("Refresh Tracked Location")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Replication Foci Streaming")
)

// StreamingObserver processBatchedSetMoves / StreamingObserver sets change
builder.AddTagToken(
    new TagTokenEntry("StreamingObserver processBatchedSetMoves")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Processes batched set membership changes in the streaming observer.**

Handles instances moving between streaming sets (e.g., entering/leaving a client's radius).

**Performance notes:** Server-side. Cost scales with how many instances move across streaming regions and how often instances are created or destroyed.

**What game creators can do:**
- Reduce the number of parts that continuously move across large distances (fast projectiles, vehicles) — each region crossing is work here.
- Weld moving parts into a single assembly so they move as one unit rather than many.
- Reduce runtime instance creation/destruction churn.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("StreamingObserver sets change")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("StreamingObserver processBatchedSetMoves")
)

builder.AddTagToken(
    new TagTokenEntry("Collect Parts For Min Area")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Collects parts that are within the minimum streaming area (always loaded).**

Identifies parts that must always be present regardless of streaming radius.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Prefetch Gather From Uncollected Regions")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Prefetches data from regions that haven't been collected yet for proactive streaming.**
`
        )
)

// Replication Foci GC / GC Loop / Process Deferred GC
builder.AddTagToken(
    new TagTokenEntry("Replication Foci GC")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Garbage-collects stale replication data — removes objects that are no longer relevant.**

Cleans up replication state for instances that have been destroyed or streamed out.

**Performance notes:** Normally fast. Can spike after large batch removals.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("GC Loop")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Replication Foci GC")
)
builder.AddTagToken(
    new TagTokenEntry("Process Deferred GC")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Replication Foci GC")
)

// Part/Model Removals / Foci Removals / Model Removals / Container Removals
builder.AddTagToken(
    new TagTokenEntry("Part/Model Removals")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Processes pending removal of parts, models, and containers from the replication system.**

Batch-removes instances that are no longer relevant to any client.

**Performance notes:** Cost scales with how many instances stream out at once — driven by instance density and by players moving far/fast (which streams large regions out).

**What game creators can do:**
- Reduce instance density so fewer instances stream out per move.
- Avoid very fast or very long player movement/teleports, which stream large regions out (and back in) at once.
- Use \`Model.ModelStreamingMode\` (e.g. Atomic / Persistent) to control how a model streams as a unit.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Foci Removals")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Part/Model Removals")
)
builder.AddTagToken(
    new TagTokenEntry("Model Removals")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Part/Model Removals")
)
builder.AddTagToken(
    new TagTokenEntry("Container Removals")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Part/Model Removals")
)

// GC Version Tracking / DeallocateInstanceVersionsAsync / DecayInstanceSyncMap
builder.AddTagToken(
    new TagTokenEntry("GC Version Tracking")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Manages version tracking for GC'd instances and cleans up synchronization maps.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("DeallocateInstanceVersionsAsync")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("GC Version Tracking")
)
builder.AddTagToken(
    new TagTokenEntry("DecayInstanceSyncMap")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("GC Version Tracking")
)

// Join Snapshot / Server Join Snapshot
builder.AddTagToken(
    new TagTokenEntry("Join Snapshot")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Captures the current world state as a snapshot for a joining player.**

Creates the initial state snapshot that will be sent to a newly-joining client. Contains all instances not subject to Streaming system.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Server Join Snapshot")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Join Snapshot")
)

builder.AddTagToken(
    new TagTokenEntry("GameLoad")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Client-side join-completion handler — fires when the top replication container's 'finished' tag arrives, marking initial game data fully received.**

Records join timing/telemetry, updates join state, signals that the DataModel is loaded, and marks the game as loaded. The initial join snapshot is deserialized and instances are created earlier, not in this scope.

**Performance notes:** Determines load time. Cost = snapshot size.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Container Queue")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Processes the container queue during join — creates instance hierarchies in order.**

Ensures instances are created in the correct parent-child order during the join snapshot application.
`
        )
)

// Performing player install / Install Remote Player
builder.AddTagToken(
    new TagTokenEntry("Performing player install")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Server-side scope for setting up a new player's Player Instance.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Install Remote Player")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Performing player install")
)

builder.AddTagToken(
    new TagTokenEntry("Getting Replication Cache and Queue JDI")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Retrieves cached replication data and queues Join Data Items for the new player.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RakNetUpdate")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Processes incoming and outgoing network packets — the transport layer tick.**

The low-level network update that sends queued outgoing packets and processes received packets. Runs on the network thread.

**Performance notes:** Cost depends on packet volume. High bandwidth usage increases this scope's duration.

**What game creators can do:**
- Reduce network traffic so there are fewer/smaller packets to process — send fewer and smaller replicated updates, lower the rate of frequently-firing \`RemoteEvent\`s, and reduce the number of network-owned moving parts.
`
        )
)

// deserializeItem / deserializeClientItem
builder.AddTagToken(
    new TagTokenEntry("deserializeItem")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Deserializes individual replication items from the network bitstream.**

Decodes received network data back into instance property changes, creations, and deletions. (\`decompressBitStream\` is a separate step that zstd-decompresses a compressed bitstream before these deserialize it.)

**Performance notes:** CPU-bound deserialization. Cost proportional to received data volume.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("deserializeClientItem")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("deserializeItem")
)

builder.AddTagToken(
    new TagTokenEntry("Tag deserialized")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Reads a replication flow-control tag item from the stream (e.g. join-milestone markers).**

Decodes an internal replication control tag (not a CollectionService tag); for the join-completion tag, it records join timing and marks that join is complete.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SettingInstanceAlive")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Marks replication-data instances as alive and complete for a replicator during the join flow.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("asyncHttpQueueOnHeartbeat")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Processes the legacy async HTTP request queue.**

Handles a legacy HTTP system; asset requests go through AssetProvider rather than this scope.

**Performance notes:** If many HTTP responses arrive simultaneously, processing them can take time.
`
        )
)

// contentProviderOnHeartbeat / cacheableContentProviderOnHeartbeat
builder.AddTagToken(
    new TagTokenEntry("contentProviderOnHeartbeat")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Processes content provider asset loading — handles asset request completion.**

Updates the ContentProvider state machine: checks for completed downloads, fires loaded callbacks, and starts new requests. (This describes \`contentProviderOnHeartbeat\`; \`cacheableContentProviderOnHeartbeat\` only performs LRU-cache maintenance for cacheable content.)

**Performance notes:** Busy when preloaded content is being processed; preloading more content can increase this heartbeat work while those preloads are active.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("cacheableContentProviderOnHeartbeat")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("contentProviderOnHeartbeat")
)

// HttpRequestAsync / HttpClientReq / HttpClientTC
builder.AddTagToken(
    new TagTokenEntry("HttpRequestAsync")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Individual HTTP request processing scopes.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("HttpClientReq")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("HttpRequestAsync")
)
builder.AddTagToken(
    new TagTokenEntry("HttpClientTC")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("HttpRequestAsync")
)

builder.AddTagToken(
    new TagTokenEntry("HttpHandleCacheAsyncWriter")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Writes HTTP response data to RbxStorage asynchronously for caching.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("WsClient::workerThreadProcess")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**WebSocket client worker thread — processes incoming WebSocket messages.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("ParallelPhysicsReceive")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Processes received physics state in parallel — applies server physics corrections.**

Deserializes and applies physics state updates from the server (positions, velocities, CFrames).

**Performance notes:** Cost proportional to the number of physics objects receiving updates.
`
        )
)

// InputReplicator::sendInputs / InputReplicator::receiveInputs
builder.AddTagToken(
    new TagTokenEntry("InputReplicator::sendInputs")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Sends local player inputs to the server / receives remote player inputs from the server.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("InputReplicator::receiveInputs")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("InputReplicator::sendInputs")
)

// Sort Priorities / Further Prioritization
builder.AddTagToken(
    new TagTokenEntry("Sort Priorities")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Sorts and refines physics-assembly send priorities for the physics state replication sender.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Further Prioritization")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Sort Priorities")
)

// Network Quality Checks / NetworkQualityResponder
builder.AddTagToken(
    new TagTokenEntry("Network Quality Checks")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Monitors network connection quality and responds to quality-of-service queries.**

Performs periodic per-connection quality checks and maintenance.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("NetworkQualityResponder")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Network Quality Checks")
)

builder.AddTagToken(
    new TagTokenEntry("ISRFinalizeStep")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Finalizes the ISR send step — resets the per-frame change tracking after all replicators have sent.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("IsrPartialSortMetrics")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Collects metrics about ISR partial sorting performance.**
`
        )
)

// GroupManager / SetManager
builder.AddTagToken(
    new TagTokenEntry("GroupManager")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Manages replication groups and sets — organizes instances into replication units.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("SetManager")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("GroupManager")
)

// Game Services Reporting / GetJobStats
builder.AddTagToken(
    new TagTokenEntry("Game Services Reporting")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Reports game service status and collects job statistics for diagnostics.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("GetJobStats")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Game Services Reporting")
)

// Network Quality Checks / Disconnect Cleanup
builder.AddTagToken(
    new TagTokenEntry("Network Quality Checks")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Handles disconnection cleanup — removes all replication state for a disconnected client.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Disconnect Cleanup")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("Network Quality Checks")
)

builder.AddTagToken(
    new TagTokenEntry("updateMemoryStats")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Updates network memory usage statistics for telemetry.**
`
        )
)

// GenerateDataBlobsCacheable / GenerateDataBlobsNotCacheable / GenerateDataBlobsCharacterModelRoots / GenerateDataBlobsParts
builder.AddTagToken(
    new TagTokenEntry("GenerateDataBlobsCacheable")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Generates serialized data blobs for different categories of replication data.**

Separates replication data into cacheable (static) and non-cacheable (dynamic) categories for efficient serialization.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("GenerateDataBlobsNotCacheable")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("GenerateDataBlobsCacheable")
)
builder.AddTagToken(
    new TagTokenEntry("GenerateDataBlobsCharacterModelRoots")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("GenerateDataBlobsCacheable")
)
builder.AddTagToken(
    new TagTokenEntry("GenerateDataBlobsParts")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("GenerateDataBlobsCacheable")
)

builder.AddTagToken(
    new TagTokenEntry("Packet Processing")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
- \`processPacket\` — processes a single received packet
- \`deserializePacket\` — deserializes one packet from the bitstream. Low-level packet processing that prepares for **Replicator ProcessPackets**. Advice: send fewer or smaller updates.
- \`deserializeBufferedPackets\` — deserializes all buffered packets

**What game creators can do:** These scale with how much replicated data the client receives. Reduce it by sending fewer and smaller replicated updates, coalescing frequent property changes, using \`RemoteEvent\`s sparingly for high-rate data, and using instance streaming to keep fewer instances active.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("ISR Details")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
- \`ISR::preProcessFramePropertyChanges\` — pre-processes property changes before filtering
- \`ISR::stepFilterAndApplyPropertyChanges\` — filters and applies property changes for replication
- \`Physics Send\` / \`Physics Send Touches\` — sends physics state and touch events
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Tracker Data")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
- \`Collect TrackerData\` / \`Deferred TrackerData update\` / \`Preserialize TrackerData\` — collects, defers, and pre-serializes tracker data for face/body tracking replication. (\`Gather Post Join\` is a separate instance-streaming step — it collects instance sets that must be sent after a player joins — not tracker data.)
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Streaming Details")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
- \`Streaming Invalidated Caches\` — invalidates streaming caches after topology changes
- \`Resolve Metadata\` — resolves deferred replication data and queues newly streamed instances to be added to the replication set
- \`UpdateDecayabilityToSyncMap\` — updates instance decay eligibility
`
        )
)


export default {}
