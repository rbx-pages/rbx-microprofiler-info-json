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
    new TagGroupEntry(STR_TagGroups.Qt)
        .SetDescription("Qt, mostly Roblox Studio")
)

builder.AddTagLabel(
    new TagLabel(makeLabelName("Qt_Event_label"))
)

builder.AddTagToken(
    new TagTokenEntry("Qt_Event")
        .WithDisplayName("$Event")
        .WithGroup(STR_TagGroups.Qt)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`Qt Events.
They only appear in Roblox Studio and they come with labels that appear to describe their event.`
        )
        .AddLabel(makeLabelName("Qt_Event_label"))
)

builder.AddTagToken(
    new TagTokenEntry("Event_::RenderViewUpdate")
        .AsAliasOf("Qt_Event")
)



builder.AddTagToken(
    new TagTokenEntry("PrepareStandalone")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`Should have something to do with a Plugin that is in the Standalone DataModel
Is found within Event_::RenderViewUpdate`
        )
)


export default {}
