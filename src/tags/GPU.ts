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
    new TagGroupEntry(STR_TagGroups.GPU)
      .SetDescription(
`
All scopes in this file are **hardware GPU-timed** — they measure actual GPU execution time using hardware queries,
not CPU submission time. They appear on the GPU timeline in the profiler.

Many GPU scopes have a corresponding "Render" group scope that measures the CPU-side cost of submitting the same work.
When you see both in a capture, the Render scope shows how long the CPU spent preparing/submitting commands,
and the GPU scope shows how long the GPU spent executing them.
`
      )
)

/*builder.AddTagToken(
    new TagTokenEntry("NAME")
        .WithGroup(STR_TagGroups.Systems)
        .WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .SetDescription(
`

`
        )
)*/


export default {}
