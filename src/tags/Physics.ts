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
    new TagGroupEntry(STR_TagGroups.Physics)
        .SetDescription(
`
The Physics group contains scopes for the entire physics simulation pipeline: frame orchestration, world stepping,
collision detection, constraint solving, sleep management, interpolation, and per-body computations.
These scopes fire on the main thread (and worker threads for parallel phases) at the fixed physics rate (60 Hz by default).
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("gameFixedStepped")
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .WithGroup(STR_TagGroups.Physics)
        .SetDescription(
`
Top-level fixed-rate simulation frame — orchestrates humanoids, animation, scripts, and physics at 60 Hz.

This is the outermost scope for the fixed-rate simulation step.
It sequences: PreAnimation scripts → humanoid step → animation → Stepped scripts → IK → PreSimulation scripts → world step → PostSimulation scripts.
Multiple sub-steps may execute per render frame if the physics rate exceeds the render rate.

**Performance notes:** If this scope is wide,
identify which nested phase dominates.
Common culprits: worldStep (complex physics), stepAnimation (many characters), or script callbacks
(RunService.PreSimulation doing heavy work).
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("gameFixedStepped")
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .WithGroup(STR_TagGroups.Physics)
        .SetDescription(
`
Top-level fixed-rate simulation frame — orchestrates humanoids, animation, scripts, and physics at 60 Hz.

This is the outermost scope for the fixed-rate simulation step.
It sequences: PreAnimation scripts → humanoid step → animation → Stepped scripts → IK → PreSimulation scripts → world step → PostSimulation scripts.
Multiple sub-steps may execute per render frame if the physics rate exceeds the render rate.

**Performance notes:** If this scope is wide,
identify which nested phase dominates.
Common culprits: worldStep (complex physics), stepAnimation (many characters), or script callbacks
(RunService.PreSimulation doing heavy work).
`
        )
)


// gameStepped


builder.AddTagToken(
    new TagTokenEntry("physicsSteppedTotal")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5205839))
        .SetDescription(
`
The complete physics step including pre/post work (ISR sync, interpolation, callbacks).

Wraps the entire physics step from start to finish, including instance state replicator synchronization,
the actual world step, and post-step notifications.

**Performance notes:** This is the "total physics bill" per frame. If consistently above budget,
the scene has too much physics work.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RunService.PreAnimation")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10040013))
        .SetDescription(
`
Fires the \`\`RunService.PreAnimation\`\` Lua event — runs before animation stepping.

Script callbacks connected to \`\`RunService.PreAnimation:Connect()\`\` execute here.
Intended for game logic that must run before animation evaluation.

**Performance notes:** Cost = game script work. Keep callbacks lightweight.
`
        )
)



// RunService.Stepped


builder.AddTagToken(
    new TagTokenEntry("RunService.PreSimulation")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(7396243))
        .SetDescription(
`
Fires the \`\`RunService.PreSimulation\`\` Lua event — runs before physics solving.

Script callbacks for game logic that must execute before the physics world step (e.g., applying forces, setting velocities).

**Performance notes:** Expensive Lua work here directly delays the physics step.
Common for custom character controllers and force application.

**What game creators can do:**
- Minimize work in PreSimulation callbacks
- Cache values instead of recomputing every frame
- Avoid raycasts or spatial queries here
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RunService.PostSimulation")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10079282))
        .SetDescription(
`
Fires the \`\`RunService.PostSimulation\`\` Lua event — runs after physics solving.

Script callbacks for game logic that reads physics results (e.g., checking velocities, detecting collisions).

**Performance notes:** Same as PreSimulation — keep callbacks fast.
`
        )
)


// stepHumanoid


const label_numHumanoidStepped = makeLabelName("numHumanoidStepped")

builder.AddTagLabel(
    new TagLabel(label_numHumanoidStepped)
        .SetDescription("Number of Stepped Humanoids: {n}")
)

builder.AddTagToken(
    new TagTokenEntry("HumanoidParallelManager::stepAll")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`
**Parallel dispatch of all Humanoid steps — distributes work across worker threads.**

Coordinates parallel humanoid stepping with sub-phases for wake-up, force updates, collision toggles, and synchronization.

**Nesting:** Contains: wakeUpHumanoid, forceUpdate, setPartCanCollide, syncQueue, clear.
`
        )
        .AddLabel(label_numHumanoidStepped)
)


builder.AddTagToken(
    new TagTokenEntry("HumanoidParallelManager::stepAll::wakeUpHumanoid")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`Wakes (or prevents sleep of) local humanoids each step —
those owned by the local player, or locally simulating and not in a ragdoll/physics state (legacy physics path only).`
        )
)
builder.AddTagToken(
    new TagTokenEntry("HumanoidParallelManager::stepAll::forceUpdate")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5855659))
        .SetDescription(
`Computes and applies movement forces for all active humanoids.`
        )
)
builder.AddTagToken(
    new TagTokenEntry("HumanoidParallelManager::stepAll::setPartCanCollide")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10040013))
        .SetDescription(
`Updates collision state for humanoid body parts (e.g., disable collision during certain states).`
        )
)
builder.AddTagToken(
    new TagTokenEntry("HumanoidParallelManager::stepAll::syncQueue")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`Synchronizes parallel humanoid results back to the main thread.`
        )
)
builder.AddTagToken(
    new TagTokenEntry("HumanoidParallelManager::stepAll::clear")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(11904578))
        .SetDescription(
`Sizes the per-worker collision-map buffers for the parallel humanoid step (runs before the parallel work, not after).`
        )
)


builder.AddTagToken(
    new TagTokenEntry("HumanoidParallelManager::updateHumanoidOverlaps")
        .WithGroup(STR_TagGroups.Physics)
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Detects overlapping player Humanoids using a sweep-and-prune AABB (optionally OBB) test and tracks how long each pair has overlapped.

**Performance notes:** Cost increases significantly with many humanoids in close proximity.
Expensive with many characters in close proximity.

**What game creators can do:**
- Avoid spawning many NPCs in the same location
- Spread NPC spawn points apart
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("HumanoidState::doAutoJump")
        .WithGroup(STR_TagGroups.Physics)
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Evaluates auto-jump conditions — raycasts ahead of the humanoid to detect obstacles that trigger automatic jumping.**

**Performance notes:** Two raycasts per humanoid per frame when auto-jump is enabled
(a torso-height ray and a jump-height ray ahead of the character).
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("Humanoid::computeForce")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(2321294))
        .SetDescription(
`
Computes movement forces for all humanoid connectors in the physics kernel this step.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("humanoidPlatformsMovement")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
Corrects a character's position when it is standing on a moving platform that is owned or simulated by another peer,
compensating for network-induced inaccuracies.
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("stepAnimationPrepare")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Fires the preparation signal just before animation evaluation, letting subscribers update their inputs before poses are computed.
`
        )
)



// stepAnimation



/**
 *   - Humanoid Animators: 2
  - Total Animators: 2
  - Unthrottled Animators: 2
 */

const label_numHumanoidAnimators = makeLabelName("label_numHumanoidAnimators")
const label_totalAnimators = makeLabelName("label_totalAnimators")
const label_unthrottledAnimators = makeLabelName("label_unthrottledAnimators")

builder.AddGenericTagEntries([
    new TagLabel(label_numHumanoidAnimators)
        .SetDescription("Humanoid Animators: {n}"),
    new TagLabel(label_totalAnimators)
        .SetDescription("Total Animators: {n}"),
    new TagLabel(label_unthrottledAnimators)
        .SetDescription("Unthrottled Animators: {n}"),
])


builder.AddTagToken(
    new TagTokenEntry("AnimatorParallelManager::stepAll")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(8855416))
        .SetDescription(
`
Parallel dispatch of all Animator step operations across worker threads.
`
        )
        .AddLabel(label_numHumanoidAnimators)
        .AddLabel(label_totalAnimators)
        .AddLabel(label_unthrottledAnimators)
)



builder.AddTagToken(
    new TagTokenEntry("stepIK")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13382297))
        .SetDescription(
`
Runs inverse kinematics solvers after animation evaluation.

Solves all active IkControl instances. Runs after FK animation so IK can override/adjust joint positions.

**Performance notes:** See IkControlManager::update for details.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("stepLegacy")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9315107))
        .SetDescription(
`
Fires the internal per-frame step signal for engine objects that step each frame (Humanoid, BodyGyro, and similar).
This is not Lua script stepping — scripts connected
to \`RunService.Stepped\` are served under the separate \`RunService.Stepped\` scope.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("stepLegacyControllers")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(8855416))
        .SetDescription(
`
Steps legacy body movers (BodyVelocity, BodyForce, BodyGyro, etc.).

Updates all legacy body mover constraints. Modern constraint-based movers
(VectorForce, LinearVelocity, AlignOrientation) are the recommended alternative.

**Performance notes:** Cost proportional to the number of active legacy body movers.

**What game creators can do:**
- Migrate from BodyVelocity/BodyForce/BodyGyro to VectorForce/LinearVelocity/AlignOrientation
- Remove body movers from parts that don't need them
`
        )
)



const label_throttledCount = makeLabelName("throttledCount")
const label_timestepId = makeLabelName("timestepId")
const label_timestepCycleId = makeLabelName("timestepCycleId")

builder.AddGenericTagEntries([
    new TagLabel(label_throttledCount)
        .SetDescription("Throttled: {n}"),
    new TagLabel(label_timestepId)
        .SetDescription("Timestep ID: <id>"),
    new TagLabel(label_timestepCycleId)
        .SetDescription("timestepCycleId: <id>"),
])


builder.AddTagToken(
    new TagTokenEntry("worldStep")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13382297))
        .SetDescription(
`
One full physics world step — the core simulation tick including broadphase, contacts, and solving.

The main physics step. Broadly: midphase and contact generation (narrowphase), sleep management,
joint stepping, constraint solving, and finally a broadphase update to prepare the next step.

**Performance notes:** This is the core physics cost.
Wide worldStep means the scene is physics-heavy. Look at nested scopes to identify bottleneck (broadphase, contacts, or solver).

**What game creators can do:**
- Reduce part count in the workspace
- Anchor parts that don't need to move
- Use simpler collision fidelity (Box instead of Default/Hull/Decomposition)
- Reduce the number of unanchored assemblies
- Set NetworkOwnership appropriately so server doesn't simulate everything
`
        )
        .AddLabel(label_throttledCount)
        .AddLabel(label_timestepId)
        .AddLabel(label_timestepCycleId)
)


// Kernel::stepWorld

// Kernel::stepWorldThrottled


// updateBroadphase


builder.AddTagToken(
    new TagTokenEntry("adaptiveUpdateBroadphase")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(16723791))
        .SetDescription(
`
Updates the spatial acceleration structure for collision detection (grid hierarchy).

Maintains the broadphase spatial data structure used to quickly find potentially colliding pairs.
Moves objects in the grid when they move in the world.

**Performance notes:** Cost proportional to the number of moving assemblies. Anchored parts have zero cost.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("BroadPhase and primitiveMovementCallbackCollect")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10040013))
        .SetDescription(
`
Processes the results of the completed parallel broadphase update and fires primitive movement callbacks.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("BroadPhaseIslandReprocess")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(65407))
        .SetDescription(
`
Reprocesses broadphase islands when topology changes (parts added/removed).
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("doBroadPhaseIslandAssemblyFilter")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14381275))
        .SetDescription(
`
Filters assemblies for broadphase island assignment based on movement and spatial proximity.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("doBroadPhaseParallel MT Work")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(12088115))
        .SetDescription(
`
Parallel broadphase work distributed across worker threads.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("postParallelBroadphase")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`
Post-processing after parallel broadphase — merges results from worker threads.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("postParallelBroadphase")
        .WithGroup(STR_TagGroups.Physics)
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Expands the Ik dragger's simulation set by walking contacts outward from
the dragged primitives to pull in additional primitives that must be included in the drag solve.
`
        )
)


const label_stepMidPhase_report = makeLabelName("stepMidPhase_report")
builder.AddGenericTagEntries([
    new TagLabel(label_stepMidPhase_report)
        .SetDescription(
`
hashToPair Map Size: {n}<br/>
dirty midphase collections: {n}<br/>
num pairs collided: {n}
`
        ),
])
builder.AddTagToken(
    new TagTokenEntry("stepMidPhase")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14381275))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Mid-phase collision detection — spatial traversal for potential contact pairs within overlapping bounds.

Narrows down broadphase pairs using spatial acceleration structures to find specific geometry pairs that may be in contact.

**Performance notes:** Expensive with complex MeshPart collision geometry (high triangle count).

**What game creators can do:**
- Use simpler CollisionFidelity (Box, Hull) instead of Default or PreciseConvexDecomposition
- Reduce mesh complexity for parts that collide frequently
`
        )
        .AddLabel(label_stepMidPhase_report)
)


const label_processMidPhaseStepResults_report = makeLabelName("processMidPhaseStepResults_report")
builder.AddGenericTagEntries([
    new TagLabel(label_processMidPhaseStepResults_report)
        .SetDescription(
`
# New Result Pairs: {n}<br/>
# Removed Result Pairs: {n}<br/>
Num Collections: {n}
`
        ),
])
builder.AddTagToken(
    new TagTokenEntry("MidPhase processMidPhaseStepResults")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14381275))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Processes results from parallel midphase work — notifies callbacks for assembly/terrain pairs that were added or removed this step.
`
        )
        .AddLabel(label_processMidPhaseStepResults_report)
)


// stepContacts


builder.AddTagToken(
    new TagTokenEntry("stepContactsAsyncPrepare")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`
Builds the list of contacts to be processed asynchronously and flags their bodies for interpolation updates.
`
        )
)



const label_filteredAssemblies = makeLabelName("filteredAssemblies")
const label_unfilteredAssemblies = makeLabelName("unfilteredAssemblies")
builder.AddGenericTagEntries([
    new TagLabel(label_filteredAssemblies)
        .SetDescription("filtered assemblies: {n}"),
    new TagLabel(label_unfilteredAssemblies)
        .SetDescription("unfiltered assemblies: {n}")
])

builder.AddTagToken(
    new TagTokenEntry("applyJointTransforms")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14381275))
        .SetDescription(
`
Applies kinematic joint transformations to moving assemblies and updates their primitive positions in parallel.
`
        )
        .AddLabel(label_filteredAssemblies)
        .AddLabel(label_unfilteredAssemblies)
)


const label_assembledPrimitives = makeLabelName("assembledPrimitives")
builder.AddTagLabel(
    new TagLabel(label_assembledPrimitives)
        .SetDescription("Assembled Primitives: {n}")
)

builder.AddTagToken(
    new TagTokenEntry("primitiveMovementCallbacks")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(2330216))
        .SetDescription(
`
Invokes movement callbacks for primitives whose extents changed due to assembly operations or joint transformations.
`
        )
        .AddLabel(label_assembledPrimitives)
)
builder.AddTagToken(
    new TagTokenEntry("onPrimitiveMovementCallbacks")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(7029286))
        .SetDescription(
`
Similar to primitiveMovementCallbacks
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Solve Batch/Finalize")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5855659))
        .SetDescription(
`
**Finalize contacts** applies narrowphase contact results to the physics kernel —
adding, updating, or removing contact data and firing touch/untouch events. **Finalize** completes a solver batch:
it applies the solver's impulse corrections,
runs the final constraint iterations, and integrates the updated positions and velocities back into the simulated bodies.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Finalize contacts")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5855659))
        .AsAliasOf("Solve Batch/Finalize")
)


// Finalize With Malformed Output Checks ?



// TODO: Add others from there






const label_LDLPGS_Solver_report = makeLabelName("LDLPGS_Solver_report")

builder.AddGenericTagEntries([
    new TagLabel(label_LDLPGS_Solver_report)
        .SetDescription(
`
Islands 8dt,4dt,2dt,1dt - count of different "time steps" for adaptive time stepping<br/>
Rigid Bodies: {n}<br/>
Collisions & Constraints: {n}<br/>
Solver Islands: {n}<br/>
Task Count: {n}<br/>
`
        ),
])
builder.AddTagToken(
    new TagTokenEntry("LDLPGSSolver::solve")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(3715294))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
https://about.roblox.com/newsroom/2020/08/improving-simulation-performance-advanced-physics-solver

**Finalize contacts** applies narrowphase contact results to the physics kernel —
adding, updating, or removing contact data and firing touch/untouch events. **Finalize** completes a solver batch:
it applies the solver's impulse corrections,
runs the final constraint iterations, and integrates the updated positions and velocities back into the simulated bodies.
`
        )
        .AddLabel(label_LDLPGS_Solver_report)
)



export default {}
