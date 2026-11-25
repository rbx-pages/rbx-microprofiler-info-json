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
    new TagGroupEntry(STR_TagGroups.Render)
        .SetDescription(
`
The Render group contains scopes for the CPU-side rendering pipeline:
scene preparation, culling, draw call building, pass dispatch, post-processing setup, and presentation.
GPU-side passes are tracked separately in the GPU group.

Many scopes appear in pairs: one in "Render" (CPU submission) and one in "GPU" (GPU execution).
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::performUpdateCoordinateFrame")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
Updates dynamic scene objects, such as Dynamic Heads as part of Graphical Parts.
Can trigger \`\`SceneUpdater::preparePerformUpdateCoordinateFrame\`\`.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::preparePerformUpdateCoordinateFrame")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14408560))
        .SetDescription(
`
Dynamic Part FastCluster related, prepares to update virtual bones.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::computeLightingPrepare")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`
May reset previous lighting data, to prepare the next.

See \`\`SceneUpdater::computeLightingPerform\`\`.
`
        )
)




builder.AddTagToken(
    new TagTokenEntry("FACSRigCFrameProvider::update")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330147))
        .SetDescription(
`
Computes and updates joint transforms from FACS controls.
`
        )
)



export default {}
