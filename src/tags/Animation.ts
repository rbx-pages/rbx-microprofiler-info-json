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
    new TagGroupEntry(STR_TagGroups.Animation)
        .SetDescription(
`The Animation group contains scopes related to skeletal animation playback, retargeting, inverse kinematics,
and the animation graph system. These scopes fire during the physics/simulation step at the fixed rate (typically 60 Hz).


The following scopes in the Physics group orchestrate animation at the frame level:
- \`stepAnimationPrepare\` — prepares animation state for the current step
- \`stepAnimation\` — runs all Animator instances (parallel or serial)
- \`stepIK\` — runs IK solvers after animation
`
        )
)




builder.AddTagToken(
    new TagTokenEntry("IkControlManager::update")
        .WithGroup(STR_TagGroups.Animation)
        .WithColor(DecimalToRgb(5855659))
        .SetDescription(
`
Updates all IkControl instances — runs inverse kinematics for each active IK chain.

Iterates over all active IkControl objects and solves their IK chains.
IK is solved after forward kinematics (animation) to apply procedural constraints.

**Nesting:** Called inside \`stepIK\` at the frame level.

**Performance notes:** Cost = O(IK controls × chain length × iterations). Expensive with:
- Many active IkControl instances
- Long IK chains (many bones)
- High iteration counts

**What game creators can do:**
- Limit the number of active IkControl instances
- Disable IK on characters that are far from the camera
- Use shorter IK chains when possible
- Reduce \`IkControl.SmoothTime\` to converge faster with fewer iterations
`
        )
)


export default {}
