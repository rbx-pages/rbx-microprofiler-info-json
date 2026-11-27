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
    new TagGroupEntry(STR_TagGroups.Network)
        .SetDescription(
`
The Network group contains scopes for the replication system, instance streaming,
join flow, packet processing, and bandwidth management.
These scopes fire on the main thread (replication step)
and on network worker threads (packet deserialization, HTTP).

## Replication Pipeline (MegaReplicator)

The MegaReplicator orchestrates all replication work each frame. These scopes run sequentially within the network step.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Data Senders")
        .WithGroup(STR_TagGroups.Network)
        .WithColor(DecimalToRgb(14381275))
        .SetDescription(
`
Sends individual replication items to a specific client.

Per-item, per-client send operation.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Send Item")
        .WithGroup(STR_TagGroups.Network)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Data Senders")
)


export default {}
