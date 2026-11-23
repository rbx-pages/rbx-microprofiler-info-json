import builderHelper, {STR_TagGroups, STR_SearchTags} from "../utils/builderHelper"

const TagDataClasses = builderHelper.TagDataClasses
const TagDataBuilder = builderHelper.TagDataBuilder

const TagTokenEntry = TagDataClasses.TagTokenEntry
const TagGroupEntry = TagDataClasses.TagGroupEntry
const TagLabel = TagDataClasses.TagLabel

const DecimalToRgb = builderHelper.DecimalToRgb

const builder = builderHelper.currentBuilder

// --

builder.AddTagGroup(
    new TagGroupEntry("Sleep")
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
When threads aren't actively performing tasks, they enter a sleep state, with tags to indicate how long the thread was sleeping.
At any given time, it's extremely common for most worker threads to be in a sleep state.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("sleep")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Sleep)
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
When threads aren't actively performing tasks, they enter a sleep state, with tags to indicate how long the thread was sleeping.
At any given time, it's extremely common for most worker threads to be in a sleep state.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Navigation::rasterizeTile")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.OverflowGroup)
        .WithColor(DecimalToRgb(5205839))
        .SetDescription(
`
Updates navigation tiles needed for a pathfinding request,
usually followed by computePath which requires those tiles be up-to-date.
Follows **NavigationJob/preprocess** on the main thread.

### Advice
Reduce the number of pathfinding tile invalidations,
as this causes those paths to need recomputing.
This is caused by non-navigable parts moving.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Navigation::computePath")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.OverflowGroup)
        .WithColor(DecimalToRgb(14390128))
        .SetDescription(
`
Calculates paths, typically after **rasterizeTile**.

### Advice
Reduce the number and world extents of \`\`Path:ComputeAsync()\`\` calls.
Try reusing paths for multiple agents if they are expected to start/end from approximately similar locations.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Navigation::getPrimitivesOverlapping")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.OverflowGroup)
        .WithColor(DecimalToRgb(6266783))
        .SetDescription(
`
Collects the world geometry for each pathfinding tile and schedules the rasterization tasks to be executed by the pathfinding thread.

### Advice
Reduce the part count.
`
        )
)


{

builder.AddTagToken(
    new TagTokenEntry("gameStepped")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(12088115))
        .SetDescription(
`
Processing of game-specific objects such as Humanoids, Animations and heartbeat callbacks.

### Advice
See gameStepped labels below.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("stepHumanoid")
        .WithDisplayName("gameStepped/stepHumanoid")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(11904578))
        .SetDescription(
`
\`\`Humanoid\`\` state changes and movement.

### Advice
Reduce the amount of \`\`Humanoids\`\` or disable \`\`Humanoid\`\` states on NPCs that don't need them, 
such as \`\`Climbing\`\` or \`\`Swimming\`\`.
Reduce callbacks to \`\`Humanoid.StateChanged\`\` or state changes such as Running or Died.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("stepAnimation")
        .WithDisplayName("gameStepped/stepAnimation")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(2330147))
        .SetDescription(
`
Animators will step forward in currently playing animations.

### Advice
Reduce the amount of \`\`Animators\`\` or animated joints to lower the workload of this step.
Reduce number of callbacks to animation events such as \`\`AnimationTrack.KeyframeReached\`\` or \`\`AnimationTrack.Ended\`\`
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RunService.Stepped")
        .WithDisplayName("gameStepped/RunService.Stepped")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(7029286))
        .SetDescription(
`
Runs functions connected to the \`\`RunService.Stepped\`\` event.

### Advice
Reduce the amount or workload of functions connected to this event.
Consider delaying or replacing expensive calculations or spreading computation across multiple frames.
`
        )
)


}



{


builder.AddTagToken(
    new TagTokenEntry("Sound")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(16744192))
        .SetDescription(
`
Processes acoustic simulation and updates sounds in active playback.

### Advice
See **Sound** labels below.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Sound/stepInstances")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Sound)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Updates the volume of active sounds in the workspace.

### Advice
Reduce the amount of sounds in active playback.
`
        )
)

}


{


builder.AddTagToken(
    new TagTokenEntry("Net_PacketReceive")
        .WithDisplayName("Net PacketReceive")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
Receives network packets. If many objects or events are being replicated, this step takes longer.

### Advice
Replicate fewer objects or events.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Replicator_ProcessPackets")
        .WithDisplayName("Replicator ProcessPackets")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`
Processes contents of network packets, such as motion, event invocations and property changes.

### Advice
Reduce the number or size of objects being replicated, or do this in incremental steps.
May increase if map size increases, as larger maps tend to have more overall activity.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Dispatch_Physics_Senders_and_TouchSenders")
        .WithDisplayName("Allocate Bandwidth and Run Senders/Dispatch Physics Senders and TouchSenders")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Network)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Sends data about activity in the game.

### Advice
Reduce the amount of moving objects and/or touches. See following sections.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Dispatch_StreamJob")
        .WithDisplayName("Allocate Bandwidth and Run Senders/Dispatch StreamJob")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Network)
        .WithColor(DecimalToRgb(16723791))
        .SetDescription(
`
Sends corresponding specific regions to specific clients in the streaming feature.

### Advice
Reduce the minimum and target streaming radii.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Dispatch_Data_Senders")
        .WithDisplayName("Allocate Bandwidth and Run Senders/Dispatch Data Senders")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Network)
        .WithColor(DecimalToRgb(12088115))
        .SetDescription(
`
Sends property changes, remote event invocations, \`\`Humanoid\`\` state changes,
animation state changes, and replication of new instances.

### Advice
Reduce the number of replicated changes to the data model.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Replicator_SendCluster")
        .WithDisplayName("Replicator SendCluster")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.NotExamined
        ])
        .SetDescription(
`
Sends Terrain data to clients.

### Advice
Reduce the amount or size of terrain changes.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("ModelCompleteness_Mega_Job")
        .WithDisplayName("ModelCompleteness Mega Job")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.NotExamined
        ])
        .SetDescription(
`
Server only: completeness is an internal concept. When models are completely sent, model completeness events are sent.

### Advice
Add or remove fewer instances.
`
        )
)



builder.AddTagLabel(
    new TagLabel(TagDataBuilder._labelPrefix + "deserializeByteTracker")
        .SetDescription(
`
Format: \`\`ID: <ID> (X bytes remaining)\`\`
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("deserializePacket")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined
        ])
        .WithGroup(STR_TagGroups.Network)
        .WithColor(DecimalToRgb(5205839))
        .SetDescription(
`
Low-level network packet processing. Prepares for **Replicator/ProcessPackets**.

### Advice
Send fewer or smaller updates.
`
        )
        .AddLabel(TagDataBuilder._labelPrefix + "deserializeByteTracker")
)

}
