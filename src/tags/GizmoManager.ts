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
    new TagGroupEntry(STR_TagGroups.GizmoManager)
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
