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
    new TagGroupEntry(STR_TagGroups.UI)
        .SetDescription(
`
The UI group contains scopes for GUI layout, styling, text rendering, tweening,
input hit-testing, localization, and UI data structure maintenance.
UI work runs primarily on the main thread during the Prepare phase of rendering.
`
        )
)


// Layout


export default {}
