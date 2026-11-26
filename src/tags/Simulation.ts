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
    new TagGroupEntry(STR_TagGroups.Simulation)
        .SetDescription(
`
The Simulation group contains scopes for the **Server Authority** simulation system (opt-in).
Under Server Authority the server is the source of truth: the client simulates its own inputs slightly ahead of the server
(client-side prediction) and rolls back and re-simulates when the server's authoritative state differs from the prediction.
These scopes appear on the client when a game has the Server Authority beta feature enabled.
(\`AuroraService\`/\`Aurora*\` is the internal name for this system, so the scope strings carry that prefix.)
`
        )
)


export default {}
