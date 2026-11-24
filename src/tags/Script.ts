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
    new TagGroupEntry(STR_TagGroups.Script)
)


builder.AddTagToken(
    new TagTokenEntry("Script_ScriptName")
        .WithDisplayName("$Script_<ScriptName>")
        .SetDescription(
`
Timers with these names indicate activity in a script. This gives profiling info about how long a script took to perform.
`
        )
)


export default {}
