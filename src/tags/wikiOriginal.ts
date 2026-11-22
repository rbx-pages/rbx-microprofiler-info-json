import builderHelper, {STR_TagGroups, STR_SearchTags} from "../utils/builderHelper"

const TagDataClasses = builderHelper.TagDataClasses
const TagDataBuilder = builderHelper.TagDataBuilder

const TagTokenEntry = TagDataClasses.TagTokenEntry
const TagGroupEntry = TagDataClasses.TagGroupEntry
const TagLabel = TagDataClasses.TagLabel

const DecimalToRgb = builderHelper.DecimalToRgb

const builder = builderHelper.currentBuilder

// --

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
