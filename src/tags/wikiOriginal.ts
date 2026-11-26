import builderHelper, {STR_TagGroups, STR_SearchTags} from "../utils/builderHelper"

const TagDataClasses = builderHelper.TagDataClasses
const TagDataBuilder = builderHelper.TagDataBuilder

const TagTokenEntry = TagDataClasses.TagTokenEntry
const TagGroupEntry = TagDataClasses.TagGroupEntry
const TagLabel = TagDataClasses.TagLabel

const DecimalToRgb = builderHelper.DecimalToRgb

const builder = builderHelper.currentBuilder

// --

builder.AddTagGroup(
    new TagGroupEntry("Sleep")
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
When threads aren't actively performing tasks, they enter a sleep state, with tags to indicate how long the thread was sleeping.
At any given time, it's extremely common for most worker threads to be in a sleep state.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("sleep")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Sleep)
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
When threads aren't actively performing tasks, they enter a sleep state, with tags to indicate how long the thread was sleeping.
At any given time, it's extremely common for most worker threads to be in a sleep state.
`
        )
)


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
Calculates paths, typically after **rasterizeTile**.

### Advice
Reduce the number and world extents of \`\`Path:ComputeAsync()\`\` calls.
Try reusing paths for multiple agents if they are expected to start/end from approximately similar locations.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Navigation::getPrimitivesOverlapping")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.OverflowGroup)
        .WithColor(DecimalToRgb(6266783))
        .SetDescription(
`
Collects the world geometry for each pathfinding tile and schedules the rasterization tasks to be executed by the pathfinding thread.

### Advice
Reduce the part count.
`
        )
)


{

builder.AddTagToken(
    new TagTokenEntry("gameStepped")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(12088115))
        .SetDescription(
`
Processing of game-specific objects such as Humanoids, Animations and heartbeat callbacks.

**Performance notes:** Cost is the total work your scripts do in these callbacks; drill into the
individual \`\`RunService.*\`\` sub-scopes to see which one dominates.

### Advice
See **gameStepped** labels below.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("stepHumanoid")
        .WithDisplayName("gameStepped/stepHumanoid")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(11904578))
        .SetDescription(
`
\`\`Humanoid\`\` state changes and movement.

### Advice
Reduce the amount of \`\`Humanoids\`\` or disable \`\`Humanoid\`\` states on NPCs that don't need them, 
such as \`\`Climbing\`\` or \`\`Swimming\`\`.
Reduce callbacks to \`\`Humanoid.StateChanged\`\` or state changes such as Running or Died.

**Performance notes:** Cost scales linearly with the number of active Humanoids.
Each humanoid performs raycasts for floor detection and state transitions.

- Reduce the number of spawned NPCs with Humanoids
- Use SimplePath or custom movement for distant NPCs instead of full Humanoids
- Set Humanoid state to Dead or disable PlatformStanding for inactive characters
- Disable Humanoid states that NPCs don't need (e.g. Climbing or Swimming)
- Reduce callbacks to \`\`Humanoid.StateChanged\`\`, or state changes such as Running or Died
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("stepAnimation")
        .WithDisplayName("gameStepped/stepAnimation")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(2330147))
        .SetDescription(
`
Animators will step forward in currently playing animations.

Evaluates all Animator instances — steps animation tracks and produces skeletal poses.

Runs AnimatorParallelManager::stepAll (parallel) or fires the animation signal (serial) to evaluate all playing animation tracks.

**Performance notes:** Cost = (number of characters) × (playing tracks per character) × (bones per track).
The biggest animation cost in most games.

### Advice
Reduce the amount of \`\`Animators\`\` or animated joints to lower the workload of this step.

- Limit playing animation tracks per character (stop tracks that are fully blended out)
- Use animation priorities to prevent unnecessary blending
- Reduce animation on off-screen or distant characters
- Use fewer bones in rigs when possible
- Reduce the number of animated joints to lower the workload of this step
- Reduce callbacks to animation events such as \`\`AnimationTrack.KeyframeReached\`\` or \`\`AnimationTrack.Ended\`\`
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RunService.Stepped")
        .WithDisplayName("gameStepped/RunService.Stepped")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(7029286))
        .SetDescription(
`
Runs functions connected to the \`\`RunService.Stepped\`\` event.

### Advice
Reduce the amount or workload of functions connected to this event.
Consider delaying or replacing expensive calculations or spreading computation across multiple frames.
`
        )
)


}



{


builder.AddTagToken(
    new TagTokenEntry("Sound")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(16744192))
        .SetDescription(
`
Processes acoustic simulation and updates sounds in active playback.

### Advice
See **Sound** labels below.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Sound/stepInstances")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Sound)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Updates the volume of active sounds in the workspace.

### Advice
Reduce the amount of sounds in active playback.
`
        )
)

}


{


builder.AddTagToken(
    new TagTokenEntry("Net_PacketReceive")
        .WithDisplayName("Net PacketReceive")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
Receives network packets. If many objects or events are being replicated, this step takes longer.

### Advice
Replicate fewer objects or events.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Replicator_ProcessPackets")
        .WithDisplayName("Replicator ProcessPackets")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`
Processes contents of network packets, such as motion, event invocations and property changes.

### Advice
Reduce the number or size of objects being replicated, or do this in incremental steps.
May increase if map size increases, as larger maps tend to have more overall activity.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Dispatch_Physics_Senders_and_TouchSenders")
        .WithDisplayName("Allocate Bandwidth and Run Senders/Dispatch Physics Senders and TouchSenders")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Network)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Sends data about activity in the game.

### Advice
Reduce the amount of moving objects and/or touches. See following sections.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Dispatch_StreamJob")
        .WithDisplayName("Allocate Bandwidth and Run Senders/Dispatch StreamJob")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Network)
        .WithColor(DecimalToRgb(16723791))
        .SetDescription(
`
Sends corresponding specific regions to specific clients in the streaming feature.

### Advice
Reduce the minimum and target streaming radii.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Dispatch_Data_Senders")
        .WithDisplayName("Allocate Bandwidth and Run Senders/Dispatch Data Senders")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Network)
        .WithColor(DecimalToRgb(12088115))
        .SetDescription(
`
Sends property changes, remote event invocations, \`\`Humanoid\`\` state changes,
animation state changes, and replication of new instances.

### Advice
Reduce the number of replicated changes to the data model.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Replicator_SendCluster")
        .WithDisplayName("Replicator SendCluster")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.NotExamined
        ])
        .SetDescription(
`
Sends Terrain data to clients.

### Advice
Reduce the amount or size of terrain changes.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("ModelCompleteness_Mega_Job")
        .WithDisplayName("ModelCompleteness Mega Job")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.NotExamined
        ])
        .SetDescription(
`
Server only: completeness is an internal concept. When models are completely sent, model completeness events are sent.

### Advice
Add or remove fewer instances.
`
        )
)



builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("deserializeByteTracker"))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Format: \`\`ID: <ID> (X bytes remaining)\`\`
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("deserializePacket")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined
        ])
        .WithGroup(STR_TagGroups.Network)
        .WithColor(DecimalToRgb(5205839))
        .SetDescription(
`
Low-level network packet processing. Prepares for **Replicator/ProcessPackets**.

### Advice
Send fewer or smaller updates.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("deserializeByteTracker"))
)

}


{

builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("RenderingPrepare_GPU_Time"))
        .InsertSearchTags([STR_SearchTags.NotExamined])
)

builder.AddTagToken(
    new TagTokenEntry("Prepare")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Information is gathered from the main thread and updates various data structures used for rendering.

Orchestrates all pre-render scene graph updates: coordinate frame syncing, part invalidation, lighting preparation, and cluster updates.

**Nesting:** Contains SceneUpdater scopes and UI Layout.

### Advice
See **Prepare** labels below.
`
        )
        .AddLabel(TagDataBuilder._labelPrefix + "RenderingPrepare_GPU_Time")
)

builder.AddTagToken(
    new TagTokenEntry("Pass3dAdorn")
        .WithDisplayName("Prepare/Pass3dAdorn")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10079282))
        .SetDescription(
`
Handles rendering of various object adorns, such as text labels above objects.
For \`\`Humanoid\`\` labels with occlusion, this step includes raycasting to determine if such objects are visible.
This includes non-transparent parts to facilitate debug visualizations.

### Advice
Reduce the number of visible adorned objects, such as BillboardGuis,
\`\`Humanoid\`\` name/health labels, etc. Reduce the number of visible parts.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Pass2d")
        .WithDisplayName("Prepare/Pass2d")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`
Readies 2D UI rendering (both player and Roblox UI).

### Advice
Reduce the amount or complexity of UI elements.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("updateInvalidParts")
        .WithDisplayName("Prepare/UpdatePrepare/updateInvalidParts")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Updates parts that had some property changed or added.

### Advice
Reduce the amount of properties changes on the world.
If a script updates a large set of object properties, break it down across frames.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updateInvalidatedFastClusters")
        .WithDisplayName("Prepare/UpdatePrepare/updateInvalidatedFastClusters")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(6266783))
        .SetDescription(
`
Prepares "FastCluster" geometries used to render \`\`Humanoids\`\` and skinned \`\`MeshParts\`\`.
Labels specify the number of parts, vertices, and size of vertices.

### Advice
Reduce visual changes to models with \`\`Humanoids\`\` or skinned \`\`MeshParts\`\`.
`
        )
)


builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("totalParts"))
        .SetDescription("Total parts: {n}")
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::updateDynamicParts")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(16744192))
        .SetDescription(
`
Prepares \`\`Beams\`\`, \`\`ParticleEmitters\`\`, and \`\`Humanoids\`\` for rendering.

Updates the coordinate frames (world matrices) for all dynamic parts each frame —
including Beams, ParticleEmitters, Trails, Lights, and Humanoids — so their rendering follows their latest positions.

**Performance notes:** Cost scales with the number of visible dynamic parts (Beams, ParticleEmitters, Humanoids, etc.).

### Advice
Reduce the number of visible \`\`Beams\`\`, \`\`ParticleEmitters\`\`, and \`\`Humanoids\`\`.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("totalParts"))
)


builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("clusters"))
)
builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("instances"))
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::updateInstancedClusters2")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10040013))
        .SetDescription(
`
Updates geometry that uses instanced rendering such as parts. Labels **Clusters** and Instances indicate the number updated.

**Performance notes:** Cost depends on the number of cluster membership changes. Static scenes are free.

### Advice
- Reduce work that implicitly updates a part's bounding box (BasePart.CFrame, BasePart.Size, Motor6D.Transform)
- Prefer property updates that don't move the bounding box, such as Bone.Transform, where possible
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("clusters"))
        .AddLabel(TagDataBuilder.makeLabelName("instances"))
)


builder.AddTagToken(
    new TagTokenEntry("Perform")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13382297))
        .SetDescription(
`
When actual rendering commands are created and issued.

### Advice
See **Perform** labels below.
`
        )
)


builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("guiCount"))
        .SetDescription(`
gui count label indicates the amount of \`\`LayerCollectors\`\` visible in the frame.
            `)
)

builder.AddTagToken(
    new TagTokenEntry("fillGuiVertices")
        .WithDisplayName("Perform/fillGuiVertices")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined
        ])
        .WithGroup(STR_TagGroups.UI)
        .WithColor(DecimalToRgb(5205839))
        .SetDescription(
`
Fills buffers with UI vertices to prepare for rendering.
gui count label indicates the amount of \`\`LayerCollectors\`\` visible in the frame.

### Advice
If the cost is high, reduce the amount, density, and space taken by UI elements.
If there are too many Process GuiEffect labels, consider reducing the use of \`\`UIGradient\`\` and \`\`UICorner\`\` on text labels.`
        )
        .AddLabel(TagDataBuilder.makeLabelName("guiCount"))
)


builder.AddTagToken(
    new TagTokenEntry("queryFrustumOrdered")
        .WithDisplayName("queryFrustumOrdered")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5855659))
        .SetDescription(
`
Applies frustum culling so that objects not visible are not rendered.

### Advice
If there is a high cost that means there are a lot of elements.
Perhaps use some larger meshes where a single mesh has more details as opposed to many small individual pieces.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::computeLightingPerform")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`
Computation of lighting near the camera.

Computes dynamic lighting — updates light grid, shadow parameters, and environment lighting.
Prepares all lighting data needed for the current frame: updates light positions, recomputes the light grid, processes new/removed lights.

**Performance notes:** Cost depends on the number of dynamic lights. Many PointLights/SpotLights increase this.

### Advice
Manipulate the number of light sources or move the camera less to reduce the time it takes to recalculate lighting.

- Reduce the number of dynamic lights
- Use static lighting where possible
- Set light \`\`Enabled = false\`\` for lights that aren't visible
- Move the camera less to reduce lighting recalculation near the camera
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("LightGridCPU::LightGridCPU")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9315179))
        .SetDescription(
`
Updates the voxel lighting, which is used at lower quality levels.

CPU light grid lifecycle and update phases: construction, per-frame update, async chunk updates, and occupancy tracking.

### Advice
If updating chunk occupancy takes too long, consider using lower resolution geometry,
reducing the number of parts, or anchoring parts. If the other labels take too long,
consider reducing the number of lights and using non-shadow casting geometry
for objects that move and invalidate the occupancy.

- Reduce chunk occupancy (the amount of geometry occupying light-grid chunks)
- Use fewer lights
- Prefer non-shadow-casting geometry where shadows aren't needed
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("computeLightingPerform/ShadowMapSystem")
        .WithDisplayName("Perform/Scene/computeLightingPerform/ShadowMapSystem")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.NotExamined
        ])
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(0))
        .SetDescription(
`
Updates shadow maps. Not performed at quality levels below 4.

### Advice
Reduce the number of lights.
You can also use Light.Shadows and BasePart.CastShadow to disable shadow casting on less important instances.
See Improve performance https://create.roblox.com/docs/performance-optimization/improve#mitigation-4.
`
        )
)


// nah...
// Perform/Scene/Glow, ColorCorrection, MSAA, SSAO, and SSAOApply



builder.AddTagToken(
    new TagTokenEntry("Perform/Scene/UI")
        .WithDisplayName("Perform/Scene/UI")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.NotExamined
        ])
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(0))
        .SetDescription(
`
UI rendering. In Id_Screen, there is a label with the number of batches, materials and triangles used.

### Advice
Reduce the number of visible UI elements. Using \`\`CanvasGroups\`\` can help at the expense of increased memory use.
`
        )
)



builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("EmittersCount"))
        .SetDescription(
`
Emitters: {n}
`)
)
builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("ParticlesCount"))
        .SetDescription(
`
Particles: {n}
`)
)

builder.AddTagToken(
    new TagTokenEntry("updateParticles")
        .WithDisplayName("UpdateView/updateParticles")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(32767))
        .SetDescription(
`
Update particle position and bounds.

### Advice
Reduce the number of \`\`ParticleEmitters\`\`, emission rates, lifetimes, etc. Limit the movement of emitters.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("EmittersCount"))
        .AddLabel(TagDataBuilder.makeLabelName("ParticlesCount"))
)

builder.AddTagToken(
    new TagTokenEntry("updateParticleBoundings")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Update particle position and bounds.

### Advice
Reduce the number of \`\`ParticleEmitters\`\`, emission rates, lifetimes, etc. Limit the movement of emitters.
`
        )
)



builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("drawRenderCount"))
        .SetDescription(
`
DrawCount: {n} TriCount: {n} InstanceCount: {n} MaterialCount: {n}
`)
)

builder.AddTagToken(
    new TagTokenEntry("Id_Opaque")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(6266783)) // 2330147 
        .SetDescription(
`
Parts in the scene with an overall transparency of \`\`0.01\`\` or lower.

### Advice
Reduce the use and density of parts.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("drawRenderCount"))
)


builder.AddTagToken(
    new TagTokenEntry("Id_Transparent")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2321294)) // 14381275 
        .SetDescription(
`
Parts in the scene with an overall transparency between \`\`0.01\`\` and \`\`1\`\`.

### Advice
Reduce the use of partial transparency.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("drawRenderCount"))
)

builder.AddTagToken(
    new TagTokenEntry("Id_Decals")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(11904578)) // 9315107 
        .SetDescription(
`
Decals in the scene.

### Advice
Reduce the use of decals on complex meshes.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("drawRenderCount"))
)


builder.AddTagToken(
    new TagTokenEntry("Scene/Shadows")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.NotExamined
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(11904578)) // 9315107 
        .SetDescription(
`
Shadow recalculation in the scene, usually performed on dynamic scenes and typical gameplay.
Parts regardless of transparency cast shadows under the assumption that they contain decals.
Not performed at quality levels below 4.

### Advice
If this step takes too long, consider disabling BasePart.CastShadow for complex meshes, parts with high partial transparency,
and less important instances.
Fully transparent parts that don't have decals or need decal shadows should have BasePart.CastShadow disabled.
See Improve performance.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Perform/Present")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5205839))
        .SetDescription(
`
Forwards to the GPU thread to perform rendering commands.

### Advice
Reduce scene complexity in general. If this step is taking a long time, you might be limited by the GPU.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Perform/Present/waitUntilCompleted")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(12088115))
        .SetDescription(
`
Waits for the GPU to finish rendering the previous frame.

### Advice
If this is generally happening a lot then the amount of things rendered is too high. The Frame Rate Manager helps with balancing this,
but if it remains high, try following performance advice from the individual **Scene** tags.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("LoadImage")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.NotExamined,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Processes images into a format the engine can use.
Loads and decodes an image file into a GPU texture.

### Advice
Reduce the use of large images.
`
        )
)


}



{

builder.AddTagToken(
    new TagTokenEntry("fireBindToRenderStepCallbacks")
        .WithDisplayName("PreRender/fireBindToRenderStepCallbacks")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9315179))
        .SetDescription(
`
Running functions bound to render step via \`\`RunService:BindToRenderStep()\`\`.

Fires callbacks registered via \`RunService:BindToRenderStep()\` — priority-ordered pre-render callbacks.

Invokes all callbacks registered with specific priorities. These run in priority order (lower number = earlier).

**Performance notes:** Cost = sum of all BindToRenderStep callbacks. If wide, specific callbacks are doing heavy work.

### Advice
- Ensure functions connected to this event do as little work as possible.
- Unbind render step callbacks when not needed
- Keep bound callbacks minimal (only visual updates)
- Use appropriate priorities to avoid unnecessary ordering
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RunService.RenderStepped")
        .WithDisplayName("PreRender/RunService.RenderStepped")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
Runs functions connected to the \`\`RunService.RenderStepped\`\` event.

### Advice
Ensure functions connected to this event do as little work as possible.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("WaitingHybridScriptJob")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Jobs)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
Resumes scripts waiting using \`\`Instance:WaitForChild()\`\` or \`\`Globals.Roblox.wait()\`\`.
Usually performed 30 times per second. This step has an execution time budget to run waiting scripts.

### Advice
If you have too many waiting scripts or scripts with a long runtime before yielding,
this step is throttled and waits longer before it can run again.
Reduce the amount of bound functions or long computations in this step.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("GC")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Script)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Luau's garbage collection cycle.

### Advice
Pool tables and other collectable objects or try to reduce creating temporary tables.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("RunService.Heartbeat")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal
        ])
        .WithGroup(STR_TagGroups.Heartbeat)
        .WithColor(DecimalToRgb(10079282))
        .SetDescription(
`
Runs functions connected to the \`\`RunService.Heartbeat\`\` event.

This is the Lua-facing \`\`RunService.Heartbeat\`\` event. Game scripts that call \`\`RunService.Heartbeat:Connect(function)\`\` execute here.
This runs after the internal heartbeat signal.

**Nesting:** Runs immediately after heartbeatInternal in the same frame step.

**Performance notes:** If this scope is wide, game scripts connected to \`\`RunService.Heartbeat\`\` are doing expensive work. Common causes:
- Complex per-frame Lua logic (NPC AI, custom physics, UI updates)
- Too many connections to the Heartbeat event
- Heavy math or table operations in connected functions

### Advice
Reduce the amount or workload of functions connected to this event.
Consider delaying or replacing expensive calculations or spreading computation across multiple frames.

- Move expensive work to \`\`RunService.Stepped\`\` or \`\`RunService.PreSimulation\`\` if it only needs to run at physics rate
- Throttle per-frame logic (run expensive operations every Nth frame)
- Use task.defer/task.spawn to spread work across frames
- Reduce the number of Heartbeat connections by consolidating logic
`
        )
)


}




{

builder.AddTagToken(
    new TagTokenEntry("Distributed_Physics_Ownership")
        .WithDisplayName("Distributed Physics Ownership")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.NotExamined
        ])
        .WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(10079282))
        .SetDescription(
`
Determines whether the server or a client has authority over certain instances such as parts.

### Advice
Reduce the amount of parts that frequently switch network ownership, especially those with common interaction.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Simulation/assemble")
        .WithDisplayName("Simulation/assemble")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14408560))
        .SetDescription(
`
Updates a tree of connected objects (assemblies) used by the physics engine.

### Advice
Reduce the amount of joints being created or destroyed.
`
        )
)



builder.AddGenericTagEntries([
    new TagLabel(TagDataBuilder.makeLabelName("highPriorityRate"))
        .SetDescription(
`High Priority Rate: {n} %`),
    
    new TagLabel(TagDataBuilder.makeLabelName("lowPriorityRate"))
        .SetDescription(
`Low Priority Rate: {n} %`),
    
    new TagLabel(TagDataBuilder.makeLabelName("stepsIncludingLowPriority"))
        .SetDescription(
`Steps Including Low Priority: {n} %`),
    
    new TagLabel(TagDataBuilder.makeLabelName("stepsSimulated"))
        .SetDescription(
`Steps Simulated: x / out of x (dropped 0.0)`),

    new TagLabel(TagDataBuilder.makeLabelName("stepDt"))
        .SetDescription(
`Step dt: {n} ms`)
])

builder.AddTagToken(
    new TagTokenEntry("physicsStepped")
        .WithDisplayName("Simulation/physicsSteppedTotal/physicsStepped")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined,
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(8855416))
        .SetDescription(
`
Runs the physics simulation.

Note: Labels may or may not be there.

### Advice
Reduce the amount and complexity of physically simulated bodies.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("highPriorityRate"))
        .AddLabel(TagDataBuilder.makeLabelName("lowPriorityRate"))
        .AddLabel(TagDataBuilder.makeLabelName("stepsIncludingLowPriority"))
        .AddLabel(TagDataBuilder.makeLabelName("stepsSimulated"))
        .AddLabel(TagDataBuilder.makeLabelName("stepDt"))
)



builder.AddGenericTagEntries([
    new TagLabel(TagDataBuilder.makeLabelName("broadphaseIslands"))
        .SetDescription(
`Broadphase Islands: {n}`
        ),
    
    new TagLabel(TagDataBuilder.makeLabelName("filter_AssemblySetPhase"))
        .SetDescription(
`
There can be one or multiple of these.<br/>
Filter AssemblySetPhase: {n} - Num Assemblies: {n}
`
        )
])

builder.AddTagToken(
    new TagTokenEntry("SpatialFilter::filterStep")
        //.WithDisplayName("")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined,
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Updates simulation islands, arranging parts according to network ownership, local simulation.
Islands are non-interacting groups of parts which can be simulated independently.

### Advice
Avoid setting network ownership frequently.
Keep groups of parts far enough away from each other so they can be simulated separately.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("broadphaseIslands"))
        .AddLabel(TagDataBuilder.makeLabelName("filter_AssemblySetPhase"))
)


builder.AddGenericTagEntries([
    new TagLabel(TagDataBuilder.makeLabelName("numPrimitiveContacts"))
        .SetDescription(`numPrimitiveContacts: {n}`),
    
    new TagLabel(TagDataBuilder.makeLabelName("numTerrainContacts"))
        .SetDescription(`numTerrainContacts: {n}`),
    
    new TagLabel(TagDataBuilder.makeLabelName("phys_contacts"))
        .SetDescription(`contacts: {n}`),
    
    new TagLabel(TagDataBuilder.makeLabelName("phys_sleepingContacts"))
        .SetDescription(`sleeping contacts: {n}`)
])

builder.AddTagToken(
    new TagTokenEntry("stepContacts")
        .WithDisplayName("physicsStepped/worldStep/stepContacts")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined,
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9315179))
        .SetDescription(
`
Updates contacts between objects.

Narrow-phase contact generation — computes exact contact points and normals between colliding shapes.

Runs specialized contact-generation algorithms for each shape-pair type to find contact manifolds.

**Performance notes:** Cost depends on the number of active contact pairs and shape complexity.
Convex decomposition parts are the most expensive.

### Advice
Reduce the amount of bodies colliding at once, or use simpler collision boxes.
Cubes are better than complex meshes.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("numPrimitiveContacts"))
        .AddLabel(TagDataBuilder.makeLabelName("numTerrainContacts"))
        .AddLabel(TagDataBuilder.makeLabelName("phys_contacts"))
        .AddLabel(TagDataBuilder.makeLabelName("phys_sleepingContacts"))
)


builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("stepWorld_report"))
        .SetDescription(
`
Can contain these or more than one of these.<br/>
buoyancyAccumulators: {n}<br/>
collisionConnectors: {n}<br/>
humanoidConnectors: {n}<br/>
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Kernel::stepWorld")
        //.WithDisplayName("physicsStepped/worldStep/stepWorld")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined,
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10040013))
        .SetDescription(
`
Solves physics equations relating to connectors, buoyancy and Humanoids. When the engine is overloaded and unable to simulate everything in real time,
some steps may be throttled (stepWorldThrottled)
and only "real-time assemblies" such as Humanoids are simulated.

### Advice
Depends on where the time is going based on the following three phases:
- stepContacts: narrow phase collision detection geometry tests.
- Solver step: integrate time and resolve collisions and other constraints
- updateBroadphase: update positions of assemblies in collision detection system and find possibly colliding narrow phase pairs.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("stepWorld_report"))
)

builder.AddTagToken(
    new TagTokenEntry("Kernel::stepWorldThrottled")
        .AsAliasOf("Kernel::stepWorld")
)



builder.AddGenericTagEntries([
    new TagLabel(TagDataBuilder.makeLabelName("highPriorityAssemblies"))
        .SetDescription(`High Priority Assemblies {n}`)
    ,
    new TagLabel(TagDataBuilder.makeLabelName("lowPriorityAssemblies"))
        .SetDescription(`Low Priority Assemblies {n}`)
    ,
    new TagLabel(TagDataBuilder.makeLabelName("prismForCallbacks"))
        .SetDescription(`Prims for Callbacks {n}`)
    ,
])

builder.AddTagToken(
    new TagTokenEntry("notifyMovingAssembliesAndPrimMovementCallbacks")
        //.WithDisplayName("")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined,
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(9180951))
        .SetDescription(
`
Helps track how long primitives have been sleeping.

Fires movement callbacks for all assemblies that moved this step.

Notifies the rendering system and other listeners that assemblies have new positions.

**Performance notes:** Cost proportional to moving assemblies. If this is expensive, many parts are moving.
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("highPriorityAssemblies"))
        .AddLabel(TagDataBuilder.makeLabelName("lowPriorityAssemblies"))
        .AddLabel(TagDataBuilder.makeLabelName("prismForCallbacks"))
)


builder.AddTagToken(
    new TagTokenEntry("interpolateNetworkedAssemblies")
        .WithDisplayName("physicsStepped/interpolateNetworkedAssemblies")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Interpolates assemblies not controlled by the current player.

Interpolates network-replicated assemblies between received server states.

Smoothly transitions physics objects from their predicted state to server-corrected state.

### Advice
Set the network owner of parts to the current player to reduce this;
although this will usually cause more physics work to be done elsewhere.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("handleFallenParts")
        .WithDisplayName("Simulation/handleFallenParts")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(14408560))
        .SetDescription(
`
Removes parts that have fallen below \`\`Workspace.FallenPartsDestroyHeight\`\`.

**Performance notes:** Checks all moving parts against the destroy threshold. Normally fast.

### Advice
Lower the destroy height or reduce the amount of parts that fall to the destroy height.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updateVisuallySleeping")
        .WithDisplayName("heartbeatInternal/workspaceOnHeartbeat/updateVisuallySleeping")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13612347))
        .SetDescription(
`
Advances each visually-moving part's "steps to sleep" countdown and moves parts that have stopped moving into
a visually-sleeping state — the second part of
the moving-assemblies (\`\`notifyMovingAssembliesAndPrimMovementCallbacks\`\`) tracking.
Parts marked visually sleeping no longer need per-frame transform updates on the render side.
`
        )
)



builder.AddGenericTagEntries([
    new TagLabel(TagDataBuilder.makeLabelName("islandCount"))
        .SetDescription(`Island Count: {n}`)
        ,
    new TagLabel(TagDataBuilder.makeLabelName("constraintCount"))
        .SetDescription(`Constraint Count: {n}`)
        ,
    new TagLabel(TagDataBuilder.makeLabelName("simBodyCount"))
        .SetDescription(`Sim Body Count: {n}`)
        ,
    new TagLabel(TagDataBuilder.makeLabelName("nonSimBodyCount"))
        .SetDescription(`Non-Sim Body Count: {n}`)
        ,
    new TagLabel(TagDataBuilder.makeLabelName("LDLComponents"))
        .SetDescription(`LDL Components: {n}`)
        ,
])

builder.AddTagToken(
    new TagTokenEntry("Solve_Batch")
        .WithDisplayName("Solve Batch")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined,
        ])
        .WithGroup(STR_TagGroups.Physics)
        .WithColor(DecimalToRgb(13612347))
        .SetDescription(
`
Helps the physics simulation solve batches of objects' motion.

Solves a batch of constraint islands using the constraint solver.

The main solver work for the traditional physics solver. Iterates over constraints to find forces that satisfy all contacts and joints.

**Performance notes:** This is often the most expensive physics scope. Cost depends on:
- Number of awake constraint rows (contacts + joints)
- Solver iteration count
- Island size and connectivity

**What game creators can do:**
- Reduce the number of unanchored parts
- Anchor parts that don't need physics
- Avoid large piles of parts (creates big islands with many constraints)
- Use simpler collision fidelity
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("islandCount"))
        .AddLabel(TagDataBuilder.makeLabelName("constraintCount"))
        .AddLabel(TagDataBuilder.makeLabelName("simBodyCount"))
        .AddLabel(TagDataBuilder.makeLabelName("nonSimBodyCount"))
        .AddLabel(TagDataBuilder.makeLabelName("LDLComponents"))
)

}





{

/*builder.AddTagToken(
    new TagTokenEntry("Render/PreRender/UpdateInput")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.NotExamined,
        ])
        //.WithGroup(STR_TagGroups.Physics)
        //.WithColor(DecimalToRgb(0))
        .SetDescription(
`
Updates and fires all user input related events if the user has performed input since the last frame.

### Advice
Try and not do too much work directly as you get the input. Consider doing a minimal amount of processing for the input,
and larger computations should be pushed off to another thread that happens later.
`
        )
)*/


builder.AddTagToken(
    new TagTokenEntry("TweenService")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.UI)
        .WithColor(DecimalToRgb(9315107))
        .SetDescription(
`
Updates objects being tweened using \`\`TweenService\`\` and calls completion callbacks,
such as those used provided to \`\`GuiObject:TweenSize()\`\` or \`\`GuiObject:TweenPosition()\`\`.

In the **server**, \`\`TweenService\`\` runs in \`\`RunService.Heartbeat\`\` instead of \`\`RunService.PreRender\`\`.

### Advice
Reduce the number of objects being tweened using \`\`TweenService\`\` and ensure callbacks do as little work as possible.
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("UpdateUILayouts")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Updates position and size for UI elements on all enabled \`\`LayerCollectors\`\`.

### Advice
See **UpdateUILayouts** labels below.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("UpdateUILayouts/Rebuild Z-order list")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
        ])
        .WithGroup(STR_TagGroups.UI)
        .WithColor(DecimalToRgb(12088115))
        .SetDescription(
`
Rebuilds the internal Z-order list of UI elements (not to be confused with \`\`GuiObject.ZIndex\`\`)
in a \`\`LayerCollector\`\` on first render or when a new element is added, removed, or had its \`\`GuiObject.ZIndex\`\` changed.

### Advice
Reduce the number of UI elements in \`\`LayerCollectors\`\` before first render and avoid frequently changing the parent and
\`\`GuiObject.ZIndex\`\` of UI elements inside them. The more elements a \`\`LayerCollector\`\` has, the worse it performs.
`
        )
)



builder.AddTagLabel(
    new TagLabel(TagDataBuilder.makeLabelName("updateUILayouts_layoutReport"))
        .SetDescription(
`
Example:
\`\`Context=Rendering Cause=<Instance Name> Root=<Instance Name> Relayouts=0 Updates=0 Resizes=0\`\`
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("UpdateUILayouts/Layout")
        .InsertSearchTags([
            STR_SearchTags.RbxWikiOriginal,
            STR_SearchTags.Examined,
        ])
        .WithGroup(STR_TagGroups.UI)
        .WithColor(DecimalToRgb(12088115))
        .SetDescription(
`
Updates position and size for UI elements in an individual \`\`LayerCollector\`\`.
Can contain a label with information about the relevant UI, along with the amount of Relayouts, Updates and Resizes.

Runs the UI layout system — computes positions and sizes for all dirty GuiObjects.
The main layout pass that processes the UI tree. Computes AbsolutePosition and AbsoluteSize for every GuiObject with dirty layout.

**Performance notes:** The most expensive UI scope in complex games. Cost depends on:
- Number of dirty layout nodes (GuiObjects whose properties changed)
- Depth of the UI hierarchy
- Use of UIListLayout, UIGridLayout, UIPageLayout (add layout computation)
- AutomaticSize elements (require multiple layout passes)

### Advice
Reduce the amount of UI elements being resized or repositioned,
such as those managed by UILayout and those tweened with \`\`TweenService\`\`,
\`\`GuiObject:TweenSize()\`\`, or \`\`GuiObject:TweenPosition()\`\`. Consider using fixed sizes for BillboardGuis.

- Minimize property changes that trigger re-layout (Size, Position, Visible)
- Use \`\`LayoutOrder\`\` instead of reparenting to reorder elements
- Avoid deeply nested UI structures
- Use \`\`AutomaticSize = None\`\` when the size is known
- Batch UI updates rather than changing many properties across multiple frames
- Reduce the amount of UI elements being resized or repositioned (via UILayout, TweenService, etc.)
- Consider fixed sizes for BillboardGuis
`
        )
        .AddLabel(TagDataBuilder.makeLabelName("updateUILayouts_layoutReport"))
)


}
