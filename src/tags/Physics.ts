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
It sequences: PreAnimation scripts → humanoid step → animation → Stepped scripts → IK → PreSimulation scripts →
world step → PostSimulation scripts.
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
It sequences: PreAnimation scripts → humanoid step → animation → Stepped scripts → IK → PreSimulation scripts →
world step → PostSimulation scripts.
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


builder.AddTagToken(
    new TagTokenEntry("Finalize With Malformed Output Checks")
        .WithGroup(STR_TagGroups.Physics)
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`Integrates the solved positions into the simulated bodies while checking for numerically unstable (exploded) solver output.`
        )
)



builder.AddTagToken(
    new TagTokenEntry("preContactStepSleepStage")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(16723791))
        .SetDescription(
`
Pre-contact sleep evaluation — determines which assemblies can remain sleeping this frame.

Checks whether sleeping assemblies have been disturbed (new contacts, applied forces) and need to wake up.

**Performance notes:** Fast per-assembly check. Total cost = O(sleeping assemblies with potential contacts).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("postContactStepSleepStage")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9315179))
        .SetDescription(
`
Post-contact sleep evaluation — puts assemblies to sleep that have settled.

After solving, checks whether active assemblies
have come to rest (velocity below threshold for enough frames) and can be put to sleep.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("stepAssembliesRecursiveWakePending")
        .WithDisplayName("preContactStepSleepStage/stepAssembliesRecursiveWakePending")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(32767))
        .SetDescription(
`
Wakes assemblies that have pending wake requests (touched by a moving object, force applied, etc.).
The recursive variant also propagates waking through connected assemblies up to a bounded depth.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("stepAssembliesWakePending")
        .WithDisplayName("preContactStepSleepStage/stepAssembliesWakePending")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(12088115))
        .AsAliasOf("stepAssembliesRecursiveWakePending")
)

builder.AddTagToken(
    new TagTokenEntry("stepAwakeAssemblies")
        .WithDisplayName("postContactStepSleepStage/stepAwakeAssemblies")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14390128))
        .SetDescription(
`
Iterates over all awake assemblies to check if they should continue being awake.
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("sampleAwakeNonSimulatingAssemblies")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14390128))
        .SetDescription(
`
Samples awake assemblies that aren't actively simulating to check if they need to start simulating.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updateContactSleepState")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(8740418))
        .SetDescription(
`
Updates the sleep state of contacts — removes contacts for sleeping pairs, activates for waking pairs.
`
        )
)

// updateVisuallySleeping


builder.AddTagToken(
    new TagTokenEntry("Generating Islands")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10461023))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Partitions the awake world into independent islands for parallel solving.

Groups connected assemblies (via contacts or joints) into independent islands that can be solved in parallel without synchronization.

**Performance notes:** Cost depends on connectivity. Highly connected scenes (many parts touching) produce fewer,
larger islands that can't parallelize well.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Repack Islandizer")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(32767))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Compacts island data structures after topology changes.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Physics_Generating_Tasks")
        .WithDisplayName("Generating Tasks")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13382297))
        .SetDescription(
`
Creates solver tasks for each island — prepares work items for the constraint solver.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Init Batch Solve")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Initializes batch solving — prepares shared data structures for parallel island solving.
`
        )
)


// Solve Batch


builder.AddTagToken(
    new TagTokenEntry("Solve_Batch_Primal")
        .WithDisplayName("Solve Batch Primal")
        .WithGroup(STR_TagGroups.Physics)
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Solves a batch of constraint islands using the alternate constraint solver.

An alternate constraint solver that uses iterative methods for robust convergence on complex systems.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Sort Constraints")
        .WithGroup(STR_TagGroups.Physics)
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Partitions an island's constraints into interior versus exterior groups
as a preparation step for the alternate (Primal) solver path.
`
        )
)



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

Main constraint solver iteration loop — iterates to convergence.

The core constraint solver. Projects constraints iteratively to find equilibrium forces.
`
        )
        .AddLabel(label_LDLPGS_Solver_report)
)




builder.AddTagToken(
    new TagTokenEntry("LDL Decomp")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(65407))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Decomposes the constraint matrix for efficient solving.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Physics_Apply_forces")
        .WithDisplayName("Apply forces")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5855659))
        .SetDescription(
`
Evaluates active force objects (such as VectorForce and the legacy body-force movers) and
accumulates their force and torque onto bodies for later integration.
These are user-created forces, not constraint forces, and velocities are not updated here.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("ConstructLDLProgram")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Constructs the solver program — builds the computation graph for constraint solving.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("ConstructLDLMxVProgram")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("ConstructLDLProgram")
)

builder.AddTagToken(
    new TagTokenEntry("LDLMxVProgram::applyInverse")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(32767))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Applies the inverse of the factored constraint matrix to a residual vector,
producing impulse corrections during constraint solving.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("LDLMxVProgram::applyInverseLDL")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14390128))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("LDLMxVProgram::applyInverse")
)

builder.AddTagToken(
    new TagTokenEntry("ConstructBodyShattering")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(8855416))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Constructs body shattering data — splits a body with a large constraint dimension into
smaller shards to reduce the cost of the direct solve.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("ConstructConnectedComponent")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Identifies connected components in the constraint graph for island decomposition.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("ConstructLinearForceModel")
        .WithGroup(STR_TagGroups.Physics)
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Builds a part's aerodynamic force model — precomputing the coefficient matrices used to
evaluate fluid (aerodynamic) forces from the part's surface geometry.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("CreateMinimumLocalFillElimination")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9315107))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Computes a fill-reducing elimination ordering for the solver by
greedily eliminating the node with the fewest resulting fill-in edges.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("buildLDLProgram")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Builds the solver's factorization structures from the constraint topology:
\`buildLDLComponents\` splits the constraint graph into independent components,
and \`buildLDLProgram\` builds the solve plan for a single component.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("buildLDLComponents")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(7396243))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("buildLDLProgram")
)

builder.AddTagToken(
    new TagTokenEntry("constructLineGraph")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(32767))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Constructs the line graph representation of constraint connectivity.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("orderEdgeReductionsInPivotOrder")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5855659))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Prepares the solver's elimination ordering: \`orderPivotsInDepthFirstOrder\` reorders pivots by a depth-first walk of the elimination tree,
while \`orderEdgeReductionsInPivotOrder\` orients each edge reduction so the factorization uses only the lower-triangular blocks.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("orderPivotsInDepthFirstOrder")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(32767))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("orderEdgeReductionsInPivotOrder")
)


builder.AddTagToken(
    new TagTokenEntry("applyDiagonalPreconditioner")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13382297))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Applies diagonal preconditioning to improve solver convergence rate.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Primal::solve2")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Alternate constraint solver entry point — iterates to convergence.

An alternate solver used for complex constraint systems.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Primal::newton")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
One iteration of the alternate solver.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Primal::buildSystem")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Constructs the linearized system of equations for the solver step.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Primal::buildEquations")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Primal::buildSystem")
)

builder.AddTagToken(
    new TagTokenEntry("Primal::linearSolve (variants)")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Solves the linear system within a solver iteration.

Variants:
- \`(Partition Blocks By Row, Unpack Diagonal)\` — general (non-SIMD) path
- \`(SIMD Partition Blocks By Row, Unpack Diagonal)\` — SIMD-accelerated variant, used when the island's block layout allows it
- \`(pure block-diagonal direct solve)\` — fast path used when the system has no off-diagonal blocks (empty lower triangle)
- \`(two-body direct solve)\` — optimized for simple two-body contacts
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Primal::velocityStage")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Velocity and position correction stages of the alternate solver.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Primal::positionStage")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Primal::velocityStage")
)

builder.AddTagToken(
    new TagTokenEntry("Primal::explicitForces")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Applies explicit (non-constraint) forces before the solve;
in the current path this is limited to buoyancy for submerged bodies,
and the scope does no work when fluid forces are disabled.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Primal::buoyancy")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Computes buoyancy forces for submerged bodies in the alternate solver path.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Primal::convergence")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Checks convergence criteria — determines if the solver has reached an acceptable solution.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Primal::warmstart")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Initializes the solver's iteration start point. \`Primal::warmstart\` carries the velocity-stage solution forward
(blending toward the integrated velocity) as a warm start;
\`Primal::warmstartPositionStage\` instead zeroes the position-stage solution (a cold start).`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Primal::warmstartPositionStage")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Primal::warmstart")
)

builder.AddTagToken(
    new TagTokenEntry("Primal::sortLowerTriangularBlocks")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Sorts lower-triangular blocks for efficient forward/back substitution.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Primal::bodyData")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Gathers body data (mass, inertia, position) for the solver.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Primal::DualUpdateTerm")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Solver iteration steps for the primal solver — DualUpdateTerm advances the augmented-Lagrangian dual (force) variables per constraint;
InitializeNewtonIteration sets up per-iteration solver state.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Primal::InitializeNewtonIteration")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Primal::DualUpdateTerm")
)

builder.AddTagToken(
    new TagTokenEntry("Primal::NewtonIterationApplyAero")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Applies aerodynamic forces within a solver iteration.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Primal::StoreOutput")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Stores solver output — packs per-body velocity and position virtual displacements, and stores the solved constraint forces.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Primal::StoreOutputForConstraints")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Primal::StoreOutput")
)
builder.AddTagToken(
    new TagTokenEntry("Primal::StoreOutputForSimBodies")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Primal::StoreOutput")
)

builder.AddTagToken(
    new TagTokenEntry("PrimalSolverContext::PrimalSolverContext")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Constructs the primal solver context — allocates working memory and initializes state.
`
        )
)


const label_RaycastBatched_report = makeLabelName("RaycastBatched_report")
builder.AddTagLabel(
    new TagLabel(label_RaycastBatched_report)
        .SetDescription(
`
#Rays: {n}<br/>
Ray Length: 4.10
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RaycastBatched")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(3715294))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Performs a batch of raycasts against the physics world (used by humanoids, sensors, scripts).

**Performance notes:** Cost = O(rays × scene complexity). Raycasts are one of the most common script-driven physics costs.

**What game creators can do:**
- Reduce raycast frequency (don't raycast every frame if not needed)
- Use shorter ray lengths
- Use RaycastParams FilterDescendantsInstances to reduce traversal
- Avoid raycasting against complex MeshPart geometry
`
        )
        .AddLabel(label_RaycastBatched_report)
)


const label_MaxDistance = makeLabelName("MaxDistance")
builder.AddTagLabel(
    new TagLabel(label_MaxDistance)
        .SetDescription(
`
MaxDistance: {n}
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RaycastBroadphase")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5855659))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Broadphase traversal for raycasts — finds candidate objects along the ray path.
`
        )
        .AddLabel(label_MaxDistance)
)

builder.AddTagToken(
    new TagTokenEntry("RaycastTerrain")
        .WithDisplayName("RaycastBroadphase/RaycastTerrain")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(2330216))
        .SetDescription(
`
Raycasts against Smooth Terrain voxel data.

**Performance notes:** Terrain raycasts traverse the terrain spatial structure. Long rays across large terrain areas are expensive.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("RaycastTerrainBatched")
        .WithDisplayName("RaycastBroadphase/RaycastTerrainBatched")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13467442))
        .AsAliasOf("RaycastTerrain")
)
builder.AddTagToken(
    new TagTokenEntry("raycastAgainstCachedTerrain")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        //.AsAliasOf("RaycastTerrain")
        .InsertSearchTags([STR_SearchTags.NotExamined])
)


builder.AddTagToken(
    new TagTokenEntry("Shapecast")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Performs a shape cast (swept volume test) — tests if a shape would collide moving along a path.

More expensive than raycasts because the swept shape must test against all potential contacts, not just a thin ray.

**Performance notes:** Significantly more expensive than Raycast. Use sparingly.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("createKDTreeAsyncAndLaunchRaycastTasks")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(2330216))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Builds a KDTree and launches batched raycasts used to compute mesh self-occlusion for aerodynamic force calculations.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("buildKDTree")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("createKDTreeAsyncAndLaunchRaycastTasks")
)

builder.AddTagToken(
    new TagTokenEntry("getHitLocationPartFilterDescendents")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(2330216))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Filters raycast results by part hierarchy (respects FilterDescendantsInstances).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("buildClientRegion3d")
        //.WithDisplayName("updatePhysicsInstructions/buildClientRegion3d")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Builds the local player's client-side simulation region — computes the simulation radius
and replication focus used to filter physics networking.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Physics_Interpolation")
        .WithDisplayName("Interpolation")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5205839))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Interpolates network-replicated assemblies toward their latest received state —
the per-task worker inside \`interpolateNetworkedAssemblies\`.

This runs in parallel across networked assemblies (bucketed so only a fraction update each step),
smoothly advancing each replicated assembly and its children toward the state received over the network so
remote-owned objects move smoothly between updates.

**Performance notes:** Cost = O(moving assemblies). Fast per-body (simple lerp/slerp).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("interpolateAfterWorldsteps")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Post-world-step interpolation — updates visual positions after all physics steps in a frame.
`
        )
)

// interpolateNetworkedAssemblies

// notifyMovingAssembliesAndPrimMovementCallbacks



builder.AddTagToken(
    new TagTokenEntry("notifyVisuallyMovingPrimitives")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(2330147))
        .SetDescription(
`
Notifies the visual system about primitives that are visually moving (for rendering updates).

**Performance notes:** Runs once per part that moved this frame; cost scales with the number of continuously-moving parts.

**What game creators can do:**
- Reduce the number of parts moving every frame; let physics bodies come to rest (sleep) instead of jittering.
- Weld groups of parts into a single assembly so they move as one unit rather than many.
- When moving things from scripts, move a container/model rather than many individual parts.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("primitiveMovedCallback")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14381275))
        .SetDescription(
`
Per-primitive movement callback — updates rendering, streaming, and other systems.
`
        )
)

// onPrimitiveMovementCallbacks

const label_movedPrimitives_report = makeLabelName("movedPrimitives_report")
builder.AddTagLabel(
    new TagLabel(label_movedPrimitives_report)
        .SetDescription(
`
ContactWakeAssemblies: {n}, Actually Woke: {n}
JointWakeAssemblies: {n}, Actually Woke: {n}
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("movedPrimitives")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9315107))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Processes primitives that moved during parallel interpolation — fires post-move updates and wakes touching assemblies.
`
        )
        .AddLabel(label_movedPrimitives_report)
)
builder.AddTagToken(
    new TagTokenEntry("collectPrimitivesFromMovingAssemblies")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`
Processes primitives that moved during parallel interpolation — fires post-move updates and wakes touching assemblies.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("physics_prepareCallbacks")
        .WithDisplayName("prepareCallbacks")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9180951))
        .SetDescription(
`
Prepares callback data structures before firing movement notifications.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("WorldStepSignal")
        .WithGroup(STR_TagGroups.Physics)
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Fires the world step signal — notifies all world step observers.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("physics_fireStateChangeEvents")
        .WithDisplayName("fireStateChangeEvents")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9333539))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Fires Humanoid state change events (e.g., Landing, Freefall, Running transitions).
`
        )
)

const label_motorJointsToReplicate = makeLabelName("motorJointsToReplicate")
builder.AddTagLabel(
    new TagLabel(label_motorJointsToReplicate)
        .SetDescription(
`
motorJointsToReplicate size: {n}
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("queueJointGuidsForPropChangedSignals")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14408560))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Queues property-changed signals for joints that were modified by the solver.
`
        )
        .AddLabel(label_motorJointsToReplicate)
)


builder.AddTagToken(
    new TagTokenEntry("applyDeferredTerrainChanges")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(2321294))
        .SetDescription(
`
Applies queued terrain modifications to the physics representation.

When terrain is edited, changes are batched and applied during the physics step to maintain consistency.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("applyDeferredTerrainChanges/applyDeferredUpdates")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(2321294))
        .AsAliasOf("applyDeferredTerrainChanges")
)

builder.AddTagToken(
    new TagTokenEntry("deletedTerrainChunks")
        .WithDisplayName("applyDeferredTerrainChanges/deletedTerrainChunks")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14408560))
        .SetDescription(
`
Processes removed terrain chunks for the physics representation.
`
        )
)

const label_updatedTerrainChunks_report = makeLabelName("updatedTerrainChunks_report")
builder.AddTagLabel(
    new TagLabel(label_updatedTerrainChunks_report)
        .SetDescription(
            `Chunks Updated: {n}, OOT Checks: {n}, OOT Overrides: {n}, Chunks Checked: {n}`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updatedTerrainChunks")
        .WithDisplayName("applyDeferredTerrainChanges/updatedTerrainChunks")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5205839))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Processes updated terrain chunks for the physics representation.
`
        )
        .AddLabel(label_updatedTerrainChunks_report)
)


builder.AddTagToken(
    new TagTokenEntry("cacheCurrentTerrain")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(2321294))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Reads and caches terrain voxel data for physics queries.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("readGrid")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(2321294))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("cacheCurrentTerrain")
)


builder.AddTagToken(
    new TagTokenEntry("testClearTerrainWeldsForGatheredCells")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(2321294))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Clears terrain weld constraints for cells that have been modified.
`
        )
)

// assemble


builder.AddTagToken(
    new TagTokenEntry("GatherAssemblies")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(2321294))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Gathers the actively-simulating assemblies (and, when not throttling, moving dynamic assemblies) into the broadphase set for this step.
`
        )
)


const label_processPendingCollisionAssemblies_report = makeLabelName("processPendingCollisionAssemblies_report")
builder.AddTagLabel(
    new TagLabel(label_processPendingCollisionAssemblies_report)
        .SetDescription(
`
#dirtyCollisionStateAssemblies: {n}
#dirtyNoCollisionJoint: {n}
#geometryChangedAssemblies: {n}
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("processPendingCollisionAssemblies")
        .WithDisplayName("Simulation/assemble/processPendingCollisionAssemblies")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(3715294))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Processes assemblies with pending collision changes —
\`\`CanCollide\`\` changes, geometry/CollisionFidelity changes, size changes, and NoCollision joint add/remove.
`
        )
        .AddLabel(label_processPendingCollisionAssemblies_report)
)


builder.AddTagToken(
    new TagTokenEntry("ResetBroadIslandForAssembly")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(32767))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Resets the broadphase island assignment for an assembly that changed connectivity.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("getAdaptiveBodiesInSolver")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(6266783))
        .SetDescription(
`
Retrieves bodies that use adaptive simulation quality (LOD for physics).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("computeMassAndIntertia")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(6266783))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Computes mass properties (centroid, volume, inertia tensor) for a single mesh-based part from its own mesh geometry.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("AerodynamicInterpolatorConstruction")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(6266783))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Constructs the aerodynamic force interpolator for wind/drag simulation.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("ReducedMeshAeroForceModelConstruction")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(6266783))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Builds a reduced mesh model for efficient aerodynamic force computation.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("extractAeroMeshFromPrimitive")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(6266783))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Extracts the aerodynamic mesh surface from a primitive shape for drag calculation.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("generateAeroMesh")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(6266783))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
## Aerodynamics

Building a body's aerodynamic model (the \`*Construction\` scopes below and \`generateAeroMesh\`) is one-time setup —
it runs when a part gains fluid forces or its mesh changes, not every frame. For MeshParts and unions this setup cost
grows with the mesh's triangle count, so very high-poly meshes take longer to prepare.
The per-frame aerodynamic force itself runs on a reduced (simplified) model, so its cost stays
bounded regardless of the source mesh's complexity.


**Generates the full aerodynamic mesh for a body.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("TurbulenceCoefficientsUpdate")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(6266783))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Updates turbulence coefficients for wind simulation.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("getOccludedMeshDataMTLimited")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(6266783))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Computes wind occlusion data for aerodynamic surfaces (which faces are sheltered).
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("BuoyancyAccumulator::computeForce")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(65407))
        .SetDescription(
`
**Applies the buoyancy force to each body that is in water (floating or submerged).**

Each body's buoyancy force for the frame is computed earlier; this step
just adds that force into the physics solver for every buoyant body. The per-body cost is constant —
it does **not** depend on how complex the body's shape is.

**Performance notes:** Cost scales with the *number* of buoyant bodies (parts touching water),
not their shape complexity. The physics step shows a \`buoyancyAccumulators: N\` label with this count.
Normally cheap; only notable when a very large number of parts are in water at once.

**What game creators can do:**
- Reduce the number of parts simultaneously in water
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("KernelJoint::computeForce")
        .WithDisplayName("stepWorld/KernelJoint::computeForce")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Computes constraint forces for one joint (Motor6D, HingeConstraint, etc.).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("AtmosphereSensor")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Sensor scopes for various force-computation systems — gather environmental data for force calculations.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("BuoyancySensor")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("AtmosphereSensor")
)
builder.AddTagToken(
    new TagTokenEntry("ControllerPartSensor")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("AtmosphereSensor")
)
builder.AddTagToken(
    new TagTokenEntry("FluidForceSensor")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("AtmosphereSensor")
)

// workspaceOnHeartbeat

// handleFallenParts


builder.AddTagToken(
    new TagTokenEntry("updateBones")
        .WithDisplayName("physicsStepped/updateBones")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(2330147))
        .SetDescription(
`
Updates dirty attachment-hierarchy constraints after physics solving — refreshes bones and attachment-attached constraints.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updatePhysicsInstructions")
        .WithDisplayName("Simulation/updatePhysicsInstructions")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10079282))
        .SetDescription(
`
Updates physics instruction state for adaptive simulation.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updatePartCollisions")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(10079282))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Recomputes character part collision data when avatar scaling changes (R15 scaling defaults).
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("SafeMove")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Kinematic movement functions — move parts safely without tunneling through geometry.

SafeMove is the high-level entry point; MoveCoarse does large steps; MoveFine does sub-step refinement.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("MoveCoarse")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("SafeMove")
)
builder.AddTagToken(
    new TagTokenEntry("MoveFine")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("SafeMove")
)

builder.AddTagToken(
    new TagTokenEntry("collectCharacterParts")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(10079282))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Collects all parts belonging to a character model for physics grouping.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Batch Expansion")
        .WithDisplayName("Solve Batch/Batch Expansion")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Reserves and populates an island batch's working buffers (sim bodies, anchored bodies, constraints)
for the current solver step.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("ContactManagerPhysicalPropertiesChanged")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(10079282))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Handles physical property changes (friction, elasticity) on existing contacts.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("ContactManagerOnAssemblyAdded")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(6266783))
        .SetDescription(
`
Handles assembly addition/removal from the contact manager.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("ContactManagerOnAssemblyRemoving")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(11904578))
        .AsAliasOf("ContactManagerOnAssemblyAdded")
)

builder.AddTagToken(
    new TagTokenEntry("ISR-PhysicsStep::notifyMovingNOURoots")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(5205839))
        .SetDescription(
`
Notifies the Instance State Replicator about moving Network Owner Unit roots for replication.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("ISR-WorkspaceSynchHelper::processQueuedSynchData")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(8855416))
        .SetDescription(
`
Processes queued synchronization data from the ISR system for physics state.
`
        )
)

// SpatialFilter::filterStep


builder.AddTagToken(
    new TagTokenEntry("UpdateControllers")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(16723791))
        .SetDescription(
`
Steps all constraint controllers (VectorForce, LinearVelocity, AlignOrientation, etc.).

Evaluates modern constraint-based body movers and applies their forces/velocities to the solver.

**Performance notes:** Cost proportional to active constraints. Generally well-optimized.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("MeshAssembly-Task")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Builds a body's aerodynamic mesh data on a worker thread (used by fluid-force / buoyancy models), not collision geometry.

Runs asynchronously on worker threads to build/process a body's
aerodynamic mesh data (e.g. triangle-set occlusion weighting), not collision meshes.
Fires when a part gains fluid forces or its mesh changes.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("MeshProcessing-Task")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("MeshAssembly-Task")
)


builder.AddTagToken(
    new TagTokenEntry("generateCollisionGeometry")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(16723791))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Generates the collision representation for a part (e.g. convex decomposition of a mesh)
used by the physics broad/narrowphase.

**Performance notes:** One-time cost per unique mesh. Cached after generation.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("generateShape")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(16723791))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Generates the collision mesh for a Terrain chunk (smooth-voxel geometry).

**Performance notes:** Runs when terrain is edited or streamed in;
cost scales with the amount of terrain being (re)meshed.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("physics_generate")
        .WithDisplayName("generate")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(16723791))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("generateShape")
)


builder.AddTagToken(
    new TagTokenEntry("Aerodynamic Integrator")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Integrates rigid body velocities with aerodynamic force models.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("LadderRaycast")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(2321294))
        .SetDescription(
`
Raycast used to detect ladder surfaces for character climbing state transitions.

**Performance notes:** One spatial query per climbing check.
Cost rises with dense collision geometry in the character's vicinity.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Kernel::stepIkSolver")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Executes inverse kinematics solving on connectors for kinematic chains.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("NOUSignals")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(7029286))
        .SetDescription(
`
Processes deferred Network Ownership Unit (NOU) signals and joint change callbacks for ownership and spanning tree modifications.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("PGS Solve")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9315107))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Executes iterative constraint solving on contacts and collisions.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Primal::linearSolve (Partition Blocks By Row, Unpack Diagonal)")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(9315107))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Solves the linear system using row-partitioned blocks with diagonal unpacking.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Primal::linearSolve (SIMD Partition Blocks By Row, Unpack Diagonal)")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(9315107))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
SIMD-accelerated variant of the row-partitioned linear solve — used when the island's diagonal blocks can be processed with SIMD.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Primal::linearSolve (pure block-diagonal direct solve)")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(9315107))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Direct solve for block-diagonal systems — fast path for simple constraint topologies.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Primal::linearSolve (two-body direct solve)")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(9315107))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Optimized direct solve for two-body contact constraints.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("applyInnerBox")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(9315107))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Updates part collision data for avatars to enforce inner box collision constraints based on R15 scaling models.
`
        )
)

// applyJointTransforms

// primitiveMovementCallbacks

builder.AddTagToken(
    new TagTokenEntry("stepIk")
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(9315107))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Executes the IK dragger physics step including contact stepping and solver updates for IK-controlled bodies.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("stepUiLegacyJoints")
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(16723791))
        .SetDescription(
`
Updates legacy kinematic joints (VehicleSeat, SkateBoardPlatform, DynamicRotateJoint) using their stepUi callbacks.
`
        )
)


export default {}
