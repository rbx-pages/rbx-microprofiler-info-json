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


}
