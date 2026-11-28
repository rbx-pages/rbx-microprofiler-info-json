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
    new TagTokenEntry("Replicator_ProcessPackets")
        .WithDisplayName("Replicator ProcessPackets")
        .WithGroup(STR_TagGroups.Jobs)
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


export default {}
