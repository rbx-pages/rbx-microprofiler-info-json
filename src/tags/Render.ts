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



// RunService.RenderStepped

builder.AddTagToken(
    new TagTokenEntry("RunService.PreRender")
        .WithDisplayName("PreRender/RunService.PreRender")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`
Fires the \`RunService.PreRender\` Lua event — the preferred pre-render callback.

Modern replacement for RenderStepped. Game scripts that update visual state before rendering run here.

**What game creators can do:**
- Only put visual updates here (camera, UI state)
- Avoid physics or logic work (use PreSimulation instead)
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RenderSteppedInternal")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(11904578))
        .SetDescription(
`
Internal engine render-step callback — updates engine visual systems before scene traversal.

Engine-internal work that prepares the rendering state: camera updates, light parameter updates, particle system advances, etc.
`
        )
)

// fireBindToRenderStepCallbacks

// Prepare

// Prepare

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::UpdatePrepare")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(6266783))
        .SetDescription(
`
Prepares scene state — processes pending part additions, removals, material changes, and attachments.

Entry point for scene graph maintenance. Handles:
- New parts entering the scene
- Parts with changed materials
- Terrain updates
- Attachment constraint processing

**Performance notes:** Cost proportional to scene changes this frame. Static scenes are nearly free.

**What game creators can do:**
- Avoid creating/destroying many parts every frame
- Batch property changes rather than changing properties one at a time
- Reduce unique material count
`
        )
)


const label_totalParts = makeLabelName("totalParts")
builder.AddTagLabel(
        new TagLabel(label_totalParts)
                .SetDescription(
`
Total parts: {n}
`
                )
)

// SceneUpdater::updateDynamicParts

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::performUpdateCoordinateFrame")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5406582))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Updates dynamic scene objects, such as Dynamic Heads as part of Graphical Parts.
Can trigger \`\`SceneUpdater::preparePerformUpdateCoordinateFrame\`\`.

Updates the GPU-visible coordinate frames (world matrices) for dynamic FastCluster parts.

Writes updated transform matrices to the buffers that the GPU will read for rendering.

**Performance notes:** Cost proportional to moving objects. One matrix write per moving entity.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::preparePerformUpdateCoordinateFrame")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14408560))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Dynamic Part FastCluster related, prepares to update virtual bones.

Updates the GPU-visible coordinate frames (world matrices) for dynamic FastCluster parts.

Writes updated transform matrices to the buffers that the GPU will read for rendering.

**Performance notes:** Cost proportional to moving objects. One matrix write per moving entity.
`
        )
)


// SceneUpdater::computeLightingPerform

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::computeLightingPrepare")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`
May reset previous lighting data, to prepare the next.

See \`\`SceneUpdater::computeLightingPerform\`\`.

Computes dynamic lighting — updates light grid, shadow parameters, and environment lighting.

Prepares all lighting data needed for the current frame: updates light positions, recomputes the light grid, processes new/removed lights.

**Performance notes:** Cost depends on the number of dynamic lights. Many PointLights/SpotLights increase this.

**What game creators can do:**
- Reduce the number of dynamic lights
- Use static lighting where possible
- Set light \`Enabled = false\` for lights that aren't visible
- Move the camera less to reduce lighting recalculation near the camera
`
        )
)

const label_numClusters = makeLabelName("numClusters")
const label_numInstances = makeLabelName("numInstances")

builder.AddGenericTagEntries([
        new TagLabel(label_numClusters)
                .SetDescription(
`
clusters: {n} — the number of instanced clusters updated.
`
                )
        ,
        new TagLabel(label_numInstances)
                .SetDescription("instances: {n}")
])

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::updateInstancedClusters2")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10040013))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Updates instanced cluster rendering state — the batching system for similar parts.

Maintains the instanced rendering batches:
adds/removes parts from clusters, updates transforms within clusters, and handles cluster splits/merges.

**Performance notes:** Cost depends on the number of cluster membership changes. Static scenes are free.

**What game creators can do:**
- Reduce work that implicitly updates a part's bounding box (\`BasePart.CFrame\`, \`BasePart.Size\`, \`Motor6D.Transform\`)
- Prefer property updates that don't move the bounding box, such as \`Bone.Transform\`, where possible
`
        )
        .AddLabel(label_numClusters)
        .AddLabel(label_numInstances)
)


// updateInvalidatedFastClusters


builder.AddTagToken(
    new TagTokenEntry("updateInvalidParts")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        //.InsertSearchTags([])
        .SetDescription(
`
**Processes parts that were invalidated (material change, resize, etc.) and need visual updates.**

**updateInvalidParts** updates parts that had some property changed or added.

**What game creators can do:**
- Reduce the amount of property changes on the world; if a script updates a large set of object properties, break it down across frames
- Reduce visual changes to models with Humanoids or skinned MeshParts
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("updateWaitingParts")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13612347))
        //.InsertSearchTags([])
        .AsAliasOf("updateInvalidParts")
)

builder.AddTagToken(
    new TagTokenEntry("sortObjects")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14381275))
        .SetDescription(
`
Sorts the render queue by material, distance, or Z-index for optimal draw order.

Multiple calls per frame for different passes (main, depth, highlight).

**Performance notes:** O(n log n) where n = visible objects. Fast with modern sorting.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SpawnCullJobs")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330216))
        .SetDescription(
`
Spawns frustum culling work on worker threads — determines which objects are visible.

Kicks off parallel frustum culling: tests all potentially-visible objects against the camera frustum.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("CullJob")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13382297))
        .SetDescription(
`
One culling thread's work — tests a batch of objects against the view frustum.

Per-thread culling computation. Tests bounding boxes/spheres against the frustum planes.

**Performance notes:** Cost = O(total objects / thread count). More objects = more culling work.

**What game creators can do:**
- Reduce the total number of parts/meshes in the workspace
- Use StreamingEnabled to limit loaded objects
- Group small objects into fewer larger ones (Union, MeshParts)
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("CullableSceneUpdate")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
Updates the cullable scene representation — maintains spatial acceleration structures for culling.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("CullView")
        .WithGroup(STR_TagGroups.Render)
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Culls one view (camera) — produces the visible set for that view.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("WaitOnRenderNodeQueryFence")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
**Waits for culling to complete — synchronizes the main thread with cull worker threads.**

The main thread blocks here until all culling work is done. If this scope is wide, culling is the bottleneck.

**Performance notes:** If consistently long, there are too many objects to cull or too few threads.
`
        )
)



const label_updateRenderQueue_report = makeLabelName("updateRenderQueue_report")

builder.AddGenericTagEntries([
        new TagLabel(label_updateRenderQueue_report)
                .SetDescription(
`
beamNode = {n}<br/>
cullableScenNode = {n}<br/>
customEmitter = {n}<br/>
explosionEmitter = {n}<br/>
fastCluster = {n}<br/>
guiCluster = {n}<br/>
particleEmitter = {n}<br/>
renderNode = {n}<br/>
renderNode = {n}<br/>
renderNode = {n}<br/>
smoothCluster = {n}<br/>
trailNode = {n}
`
                )
])

builder.AddTagToken(
    new TagTokenEntry("updateRenderQueue")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10040013))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Updates render queue groups for all passes — assigns visible objects to their render pass slots.

After culling determines visibility, this scope assigns objects to specific render passes (depth, opaque, transparent, etc.).

**Performance notes:** Cost scales with the number of visible objects and the number of distinct passes/materials they map to.

**What game creators can do:**
- Reduce the number of objects visible on screen (lower draw distance, fewer parts).
- Reduce the number of distinct materials so more objects group into the same pass.
`
        )
        .AddLabel(label_updateRenderQueue_report)
)

builder.AddTagToken(
    new TagTokenEntry("BuildView")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Builds the draw call list for a view — creates GPU command data.

Converts the high-level render queue into actual draw commands (shader binding, mesh binding, constant buffer setup).

**Performance notes:** Cost proportional to visible draw calls. Complex materials and many unique meshes increase cost.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("BuildDraws")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("BuildView")
)

builder.AddTagToken(
    new TagTokenEntry("BuildPass.BatchAndSort")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Batches and sorts draw calls within a pass for state-change minimization.

Groups draw calls by shader/material to minimize GPU state changes.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Render_Dispatch")
        .WithDisplayName("Dispatch")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
The render-command dispatch phase. \`Dispatch\` is the actual CPU→GPU submission of draw calls;
\`DispatchScene.beginRender\` sets up per-frame state (clears frame data, refreshes technique caches, applies mip results)
and \`DispatchScene.refreshMeshSubsets\` refreshes CPU-side mesh LOD/subset tables — neither submits GPU commands.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("DispatchScene.beginRender")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Render_Dispatch")
)

builder.AddTagToken(
    new TagTokenEntry("DispatchScene.refreshMeshSubsets")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Render_Dispatch")
)

builder.AddTagToken(
    new TagTokenEntry("DispatchSceneFRMBudget")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Frame Rate Manager budget calculation for the legacy-pipeline emulation path.

The FRM evaluates whether the current frame met its time budget and adjusts quality settings accordingly.

**Performance notes:** If rendering is over budget, FRM reduces quality (lower resolution, fewer effects).
`
        )
)


const label_renderPass_report = makeLabelName("renderPass_report")
builder.AddTagLabel(
        new TagLabel(label_renderPass_report)
                .SetDescription(
`
DrawCount: {n} TriCount: {n} InstanceCount: {n} MaterialCount: {n}
`
                )
)

builder.AddTagToken(
    new TagTokenEntry("DepthPrePass")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5855659))
        .SetDescription(
`
Depth-only pre-pass — renders opaque, terrain, and opaque-caster geometry to populate the depth buffer without color writes.
Alpha-tested opaque geometry is handled separately by the OpaqueWithAlpha depth passes.

Enables early-Z rejection for the main color pass, significantly reducing overdraw.

**Performance notes:** Cost proportional to visible opaque geometry vertex count.

**Labels:** \`"NodeCount: {N}"\` — number of objects rendered in this pass.
`
        )
        .AddLabel(label_renderPass_report)
)

builder.AddTagToken(
    new TagTokenEntry("OpaqueWithAlphaDepthPass")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(65407))
        .SetDescription(
`
Depth pass for objects with alpha-tested materials (foliage, fences, etc.).

Objects with transparency that still need depth-testing get separate depth passes.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("OpaqueWithAlphaLateDepthPass")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("OpaqueWithAlphaDepthPass")
)

builder.AddTagToken(
    new TagTokenEntry("depthPrepass")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
CPU-side scope for the respective depth and main render passes within UpdateView.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("alphaPrepass")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("depthPrepass")
)

builder.AddTagToken(
    new TagTokenEntry("mainView")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("depthPrepass")
)


const label_Scene_report = makeLabelName("Scene_report")
builder.AddTagLabel(
        new TagLabel(label_Scene_report)
                .SetDescription(
`
Triangles {n} Batches {n}
`
                )
)

builder.AddTagToken(
    new TagTokenEntry("Scene")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13612347))
        .SetDescription(
`
Main 3D scene rendering (CPU side) — traverses the visible scene and submits the draw calls for its opaque and transparent geometry.
This measures the CPU cost of preparing the frame's 3D render; the matching GPU execution time is the GPU-group \`Scene\` scope.

**Performance notes:** Usually the largest CPU rendering cost. Driven mainly by:
- Number of draw calls — each unique mesh × material combination is a separate call
- Part / instance / object count that must be culled and submitted each frame
- Decal and adornment count (each adds submissions)

**What game creators can do:**
- Reduce the number of *unique* mesh × material combinations so more objects batch into fewer draw calls
- Reduce overall part / instance and decal count
- Reuse the same meshes and materials instead of many one-off variants
- Shading-side cost — material/shader complexity, transparency and overdraw, resolution —
shows up on the GPU-group \`Scene\` scope, not here
`
        )
        .AddLabel(label_Scene_report)
)

builder.AddTagToken(
    new TagTokenEntry("Scene2D")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
2D screen-space rendering — draws the screen-space UI render queues (screen-space GUIs and adornments).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("GuiScene")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
ViewportFrame rendering — renders 3D content within ViewportFrame UI elements.

Each ViewportFrame is a mini-scene that gets its own render pass.

**Performance notes:** Each ViewportFrame adds a full render pass. Many ViewportFrames are expensive.

**What game creators can do:**
- Minimize the number of visible ViewportFrames
- Reduce object complexity within ViewportFrames
- Set ViewportFrame.LightDirection to avoid dynamic lighting
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Render_Highlight")
        .WithDisplayName("Highlight")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Highlight effect pass — populates the CPU-side render queues for the Highlight instance's passes.
The actual GPU rendering of highlighted objects happens later in the frame.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Render_Clear")
        .WithDisplayName("Clear")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Clears the framebuffer at the start of rendering.

**Performance notes:** Nearly free — single GPU operation.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("UI")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14381275))
        .SetDescription(
`
Renders all 2D UI elements (ScreenGuis, adorns, text, images).

Draws all on-screen GUI elements including text, images, frames, and other UI primitives.

**Performance notes:** Cost depends on the number and complexity of visible UI elements.
Deep UI hierarchies with many elements increase draw call count.

**What game creators can do:**
- Reduce visible GuiObject count
- Use CanvasGroups to batch UI rendering
- Set \`\`Visible = false\`\` on off-screen elements
- Avoid excessive use of UIGradient (adds draw calls)
`
        )
        .AddLabel(label_renderPass_report)
)




builder.AddTagToken(
    new TagTokenEntry("HBAO")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Screen-space ambient occlusion — screen-space AO computation.

Computes ambient occlusion from the depth buffer to add contact shadows and depth perception.

**Performance notes:** Full-screen effect. Cost depends on resolution and quality setting.
The FRM may reduce AO quality under pressure.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Glow")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
Bloom/glow post-processing — extracts bright areas and blurs them for glow effect.

**What game creators can do:**
- Reduce the number of post-processing effects; usually not significant

**Performance notes:** Multi-pass blur. Usually not a bottleneck but contributes to post-processing budget.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("DOF")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Depth of Field effect — blurs areas that are out of the camera's focus range.

**Performance notes:** Full-screen effect. Heavier than glow due to depth-dependent kernel.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Depth of Field")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("DOF")
)

builder.AddTagToken(
    new TagTokenEntry("BlurFx")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Blur effect — general-purpose screen blur (not DOF-specific).

Used for the BlurEffect instance that game creators can add to the camera.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SunRays")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13382297))
        .SetDescription(
`
Sun shaft (god ray) effect — computes volumetric light scattering from the sun.

**Performance notes:** Full-screen radial blur. Moderate cost.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("ColorCorrection")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5205839))
        .SetDescription(
`
Final image composition — applies color correction, tonemapping, and combines all layers.

The final pass that produces the output image: combines the lit scene with post-effects, applies tonemapping, and color grading.

**What game creators can do:**
- Reduce the number of post-processing effects; usually not significant
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Image Composition")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("ColorCorrection")
)

builder.AddTagToken(
    new TagTokenEntry("VignetteEffect")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
CPU-side update of the vignette effect parameters (aperture based on camera motion).
The vignette darkening itself is applied later during image composition.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("MSAA")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13612347))
        .SetDescription(
`
MSAA resolve pass — resolves multi-sample targets to single-sample for post-processing.

**What game creators can do:**
- Reduce the number of post-processing effects; usually not significant
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("DownSample")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2321294))
        .SetDescription(
`
Downsamples the framebuffer for lower-resolution effects (bloom, AO).
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("Upscale SmootherStep")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Resolution upscaling — renders at lower resolution and upscales for performance.

Different upscaling algorithms with quality/performance tradeoffs:
- Linear: fastest, lowest quality
- SmootherStep: balanced
- Lanczos: high quality, more expensive
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Upscale Lanczos")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Upscale SmootherStep")
)
builder.AddTagToken(
    new TagTokenEntry("Upscale Linear")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Upscale SmootherStep")
)


builder.AddTagToken(
    new TagTokenEntry("renderShadowMap")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Renders the shadow map atlas — generates depth maps from light perspectives.

See the Shadows group for detailed shadow system scopes.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Shadow Blur")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Blurs shadow maps for soft shadow edges.
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("updateTerrainPrepare")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`
Prepares and executes terrain rendering updates (LOD transitions, texture streaming).
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("updateTerrainPerform")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9333539))
        .AsAliasOf("updateTerrainPrepare")
)


builder.AddTagToken(
    new TagTokenEntry("TerrainFeedbackJittered")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Virtual texture feedback passes — determines which terrain texture tiles to load.

Renders a feedback buffer that tells the texture streaming system which virtual texture tiles are needed at what resolution.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("TerrainFeedbackTiled")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("TerrainFeedbackJittered")
)


// AdvSky / AdvSky/Compute
builder.AddTagToken(
    new TagTokenEntry("AdvSky")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14390128))
        .SetDescription(
`
Renders the advanced sky — skybox with atmospheric scattering (sky color, haze, glare).
AdvSky/Compute is a background-thread step that tessellates the sky mesh and computes per-vertex scattering colors;
it does no GPU rendering. Volumetric clouds are rendered separately (see Clouds / CloudsComp).
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("AdvSky/Compute")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(8740418))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("AdvSky")
)



builder.AddTagToken(
    new TagTokenEntry("Clouds")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
Renders volumetric clouds.

**Performance notes:** Can be expensive depending on cloud density and quality settings.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("CloudsComp")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(3715294))
        .AsAliasOf("Clouds")
)


builder.AddTagToken(
    new TagTokenEntry("EnvCapture")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Captures the environment map — renders a cube map for reflections.

Periodically re-renders the environment for reflection probes.

**Performance notes:** Renders one face of the reflection cube map per invocation;
the six faces are amortized across multiple frames (one face per frame).
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("DynamicGeometryManager::processPendingRequests")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10040013))
        .SetDescription(
`
Processes pending geometry requests — loads/decodes mesh data for rendering.

Processes queued EditableMesh updates (mesh edits submitted through the EditableMesh API) and
uploads their vertex/index data to GPU buffers.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("DynamicGeometryManager::prepareMeshUpdates")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Prepares mesh updates — processes EditableMesh changes and mesh LOD transitions.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("prepareMeshUpdates::perEditableMesh")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([])
        .AsAliasOf("DynamicGeometryManager::prepareMeshUpdates")
)


builder.AddTagToken(
    new TagTokenEntry("DynamicGeometryManager::garbageCollectIncremental")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5855659))
        .SetDescription(
`
Incrementally garbage-collects unused mesh GPU resources.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("DynamicGeometryManager::prepareConsumerUpdates")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Updates mesh consumer state and reallocates bindings for EditableMesh changes.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("reallocateEditableMeshBinding")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([])
        .AsAliasOf("DynamicGeometryManager::prepareConsumerUpdates")
)

builder.AddTagToken(
    new TagTokenEntry("DynamicGeometryManager::transcodeVerticesAndCalculateBounds (and variants)")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Transcodes mesh vertices from asset format to GPU format and computes bounding boxes.

Variants include: DynamicGeometryManager::transcodeBoxMappedVerticesAndCalculateBounds, DynamicGeometryManager::transcodeFaceFilteredVerticesAndCalculateBounds.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("TextureManager::processPendingRequests")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Texture management — loads textures, prepares updates, and garbage-collects unused textures.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("DynamicTextureManager::prepareTextureUpdates")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("TextureManager::processPendingRequests")
)
builder.AddTagToken(
    new TagTokenEntry("DynamicTextureManager::garbageCollectIncremental")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13612347))
        .AsAliasOf("TextureManager::processPendingRequests")
)


builder.AddTagToken(
    new TagTokenEntry("MeshManager::processPendingRequests")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(32767))
        .SetDescription(
`
Processes pending mesh loading requests.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("MeshJob")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2321294))
        .SetDescription(
`
Render-thread mesh upload — pops decoded mesh jobs from the upload queue and uploads their geometry to the GPU.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("CheckAndGetAssets")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
WrapDeformer (layered clothing) asset check — requests the WrapDeformer's body-part and cage meshes,
initiating loading for any that are missing.
`
        )
)


// updateInvalidatedFastClusters


builder.AddTagToken(
    new TagTokenEntry("BroadcastInvalidations")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Broadcasts rendering invalidations to all affected subsystems.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("UpdateUILayouts")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
**UpdateUILayouts**: UI layout computations.
**UpdateStyleQueries**: Updates CSS-like style queries

**Performance notes:** Layout is expensive with deep or complex UI hierarchies.
Cost scales with the number of GUI objects laid out and with the number and
nesting of layout objects (\`UIListLayout\`, \`UIGridLayout\`, ...) and constraints.

**What game creators can do:**
- Reduce the number of on-screen GUI objects; hide or remove UI that isn't currently visible.
- Flatten layout nesting — avoid a layout inside another layout where a single one would do.
- Use \`AutomaticSize\` only where it's actually needed (it adds measurement passes).
- Batch UI property changes into one frame instead of spreading them across frames — each change re-runs layout.
- Keep style rules and selectors simple (avoid deep descendant selectors).
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("UpdateStyleQueries")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10040013))
        .AsAliasOf("UpdateUILayouts")
)


builder.AddTagToken(
    new TagTokenEntry("Pass2d")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`
Renders 2D GUI passes and 3D adornments (BillboardGuis, selection boxes, etc.).

**Pass3dAdorn** renders 3D adornments — BillboardGuis and other labels above objects (Humanoid name/health labels),
selection boxes, and debug adorns. For Humanoid labels that require line-of-sight,
it raycasts to check whether the label is occluded.

**Pass2d** readies 2D UI rendering (both player and Roblox UI).

**What game creators can do:**
- Reduce the number of visible adorned objects (BillboardGuis, Humanoid name/health labels)
- Reduce the number of visible parts
- Reduce the amount or complexity of UI elements
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Pass3dAdorn")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10079282))
        .AsAliasOf("Pass2d")
)

builder.AddTagToken(
    new TagTokenEntry("AlwaysOnTopAdorns")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Renders special adorn categories: always-on-top, core UI, debug, and edit mode.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("CoreGuiAdorns")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330147))
        .AsAliasOf("AlwaysOnTopAdorns")
)
builder.AddTagToken(
    new TagTokenEntry("DebugAdorns")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2321294))
        .AsAliasOf("AlwaysOnTopAdorns")
)
builder.AddTagToken(
    new TagTokenEntry("DebugAndEditAdorns")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14408560))
        .AsAliasOf("AlwaysOnTopAdorns")
)


const label_FRM_Quality = makeLabelName("FRM_Quality")
builder.AddGenericTagEntries([
        new TagLabel(label_FRM_Quality)
                .SetDescription(
`
Displays the Graphic Setting that was put on.

FRM Quality: {Quality Level}
`
                )
])

builder.AddTagToken(
    new TagTokenEntry("FrameRateManager::submitCurrentFrame")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(12088115))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Submits frame timing data to the Frame Rate Manager for adaptive quality decisions.**
`
        )
        .AddLabel(label_FRM_Quality)
)


// Present


// waitUntilCompleted


builder.AddTagToken(
    new TagTokenEntry("Context::beginFrame")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Low-level graphics context operations — frame boundaries and resource management.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Context::endFrame()")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Context::beginFrame")
)
builder.AddTagToken(
    new TagTokenEntry("Context::copyFramebuffer")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Context::beginFrame")
)
builder.AddTagToken(
    new TagTokenEntry("Context::generateMipMaps")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Context::beginFrame")
)
builder.AddTagToken(
    new TagTokenEntry("Context::resolveFramebuffer")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Context::beginFrame")
)

builder.AddTagToken(
    new TagTokenEntry("uploadBufferData")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
Uploads vertex/index/constant buffer data from CPU to GPU.

**Performance notes:** Cost depends on data volume. High when many meshes change (EditableMesh, particles).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RTPool::getRT")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10040013))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Creates a new render target when the pool has no reusable match — used for off-screen rendering.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Render_Copy")
        .WithDisplayName("Copy")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**GPU resource copy operations.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Render_Copy_Data")
        .WithDisplayName("Copy Data")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Copy")
)
builder.AddTagToken(
    new TagTokenEntry("CopyTexture::LightMap")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7029286))
        .AsAliasOf("Render_Copy_Data")
)
builder.AddTagToken(
    new TagTokenEntry("CopyTexture::Skylight")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330147))
        .AsAliasOf("Render_Copy_Data")
)


builder.AddTagToken(
    new TagTokenEntry("renderHighlightIdPass")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Highlight system passes — renders object IDs for the Highlight effect.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("renderMobileHighlightDepthMarkPass")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("renderHighlightIdPass")
)
builder.AddTagToken(
    new TagTokenEntry("renderMobileHighlightIdsPass")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("renderHighlightIdPass")
)

builder.AddTagToken(
    new TagTokenEntry("renderPerformanceOverlay")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Renders the performance debug overlay (light counts, draw call counts, etc.).**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SortQueueJob")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Sorts the render queue on a worker thread.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("meshTaskJobManager")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Terrain mesh generation job manager — generates terrain render meshes in the background.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("TextureCompositorJob::update")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Updates the texture compositor — checks that all layer assets (meshes/textures) for avatar layered textures
have loaded and updates their request priorities.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("UITextureRenderer::renderJob")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**UI texture rendering jobs — renders off-screen UI textures (CanvasGroups, ViewportFrames).**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("UITextureRendererBaseline::renderJob")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("UITextureRenderer::renderJob")
)
builder.AddTagToken(
    new TagTokenEntry("UITextureJob::updateAndGetFramebuffer")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(65407))
        .AsAliasOf("UITextureRenderer::renderJob")
)

builder.AddTagToken(
    new TagTokenEntry("EnvMapView::cullJob")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Environment map culling and raycast processing for reflections.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("EnvMapRaycastContext::raycastProcessingTask")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7029286))
        .AsAliasOf("EnvMapView::cullJob")
)


builder.AddTagToken(
    new TagTokenEntry("EditableImage::drawImageProjected")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**EditableImage and EditableMesh rendering updates — processes changes to editable assets.**

**Performance notes:** Frequent EditableMesh/EditableImage updates are expensive.

**What game creators can do:**
- Batch EditableMesh modifications
- Minimize per-frame pixel writes to EditableImage
- Use lower-resolution EditableImages
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("EditableMesh::updateRenderMesh")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("EditableImage::drawImageProjected")
)
builder.AddTagToken(
    new TagTokenEntry("EditableMeshData::convertFileMeshDataToEditableMeshData")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("EditableImage::drawImageProjected")
)
builder.AddTagToken(
    new TagTokenEntry("EditableMeshUpdateQueue::flushUpdates")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("EditableImage::drawImageProjected")
)

builder.AddTagToken(
    new TagTokenEntry("FACSRigCFrameProvider::prepare")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(65407))
        .SetDescription(
`
FACS (Facial Action Coding System) rig updates — face tracking data to bone transforms.

Computes and updates joint transforms from FACS controls.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("FACSRigCFrameProvider::update")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330147))
        .AsAliasOf("FACSRigCFrameProvider::prepare")
)

builder.AddTagToken(
    new TagTokenEntry("updateAvatarMemoryTracking")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(11904578))
        .SetDescription(
`
**Tracks avatar rendering memory usage for budget management.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("updateAvatarMemoryTrackingSummary")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5406582))
        .AsAliasOf("updateAvatarMemoryTracking")
)


builder.AddTagToken(
    new TagTokenEntry("updateEffectBoundings")
        .WithDisplayName("Perform/updateEffectBoundings")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5526612))
        .SetDescription(
`
Updates bounding volumes for trail effects.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("LightGrid::createCPU")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
**CPU-side light grid operations — computes lighting for the voxel-based light grid.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Render_DM")
        .WithDisplayName("DM")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Syncs VR device state into the DataModel (VRService) —
VREnabled and head/floor/hand UserCFrame poses each frame while VR is active.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("(Lookup)Build list of new tiles")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Diffs currently loaded virtual texture tiles against requested tiles and returns the list of new tiles to load.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("BuildDeformedMeshPart")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Builds deformed mesh geometry for the wrap deformer system using target and cage vertices.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Dedup sampled chunks")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Deduplicates sampled terrain chunks to avoid redundant processing.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("DrawBlockFilter")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Filters visible opaque blocks by render queue ID — removes already-rendered handles.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("DynamicGeometryManager::prepareMeshUpdates::perEditableMesh")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Processes per-editable-mesh binding updates for all consumers.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("DynamicGeometryManager::reallocateEditableMeshBinding")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Reallocates GPU buffers for editable mesh vertices and indices when size changes.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("DynamicGeometryManager::transcodeBoxMappedVerticesAndCalculateBounds")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Transcodes box-mapped vertices from editable mesh format and calculates bounding volumes.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("DynamicGeometryManager::transcodeFaceFilteredVerticesAndCalculateBounds")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Transcodes face-filtered vertices from editable mesh data and calculates bounds.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("EditableMeshUpdateQueue::flushUpdates::perEditableMesh")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Updates the render mesh for each queued editable mesh modification.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("EnvMapSampleRaycastStep")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9180951))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Performs indoor raycasting for environment map sampling — determines room boundaries.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("EnvMapUpdateStep")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5406582))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Updates environment map with filtered raycast results to determine indoor/outdoor candidates.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("FastCluster::finalizeSkinningAndEntities")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`
**Clears the cluster's existing entities before new avatar-cluster geometry is generated.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("FastCluster::finishUpdatingGeometry")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`
**Completes geometry update and records telemetry for avatar loading state.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("FastCluster::updateEntity")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9315179))
        .SetDescription(
`
**Updates entity data, handles invalidations and failsafe avatar fallback.**
`
        )
)

const label_FastCluster_updateGeometry_report = makeLabelName("FastCluster_updateGeometry_report")
builder.AddGenericTagEntries([
        new TagLabel(label_FastCluster_updateGeometry_report)
                .SetDescription(
`
{n} parts, {n} entities<br/>
{n} vertices ({n} KB)
`
                )
])

builder.AddTagToken(
    new TagTokenEntry("FastCluster::updateGeometry")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10461023))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Updates geometry for fast cluster avatars including skinning and asset loading.

**Performance notes:** Rebuilds when an avatar's parts, meshes, or skeleton change; cost scales with the number of parts on the avatar and is re-triggered by runtime mesh changes, rescaling, and active layered-clothing deformation.

**What game creators can do:**
- Keep avatar/model part and accessory counts reasonable.
- Avoid changing avatar meshes or rescaling avatars at runtime — each forces a geometry rebuild; set them up once.
- Limit the number of layered-clothing items, which add deformation work to each rebuild.
`
        )
        .AddLabel(label_FastCluster_updateGeometry_report)
)

builder.AddTagToken(
    new TagTokenEntry("FastCluster::updateInstanceData")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
**Updates per-instance data (transforms, colors) for all fast cluster entities.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("FillSubmitThreadData")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Fills submission thread data for multi-threaded GPU command submission.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Generate tile update commands")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Generates tile update commands from changed terrain tiles for virtual texturing.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("GeometryGenerator::fetchResources")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(12088115))
        .SetDescription(
`
Fetches geometry resources — loads file meshes and handles asset loading for parts.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("GetBestTechniques")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Retrieves best rendering techniques/shaders for materials per pass based on capability flags.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("HumanoidAdornRaycasts")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`
Performs raycasts to determine humanoid name/health bar visibility.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("HumanoidHealth")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
Renders the humanoid health bar GUI adornment above characters.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("HumanoidName")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9180951))
        .SetDescription(
`
Renders the humanoid name plate GUI adornment above characters.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Image::scale")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Scales an image texture by resampling all mip levels to new dimensions.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("InsertRenderQueue")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Inserts items from the render queue into the dispatch scene view for submission.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("LightExtentsQuery")
        .WithDisplayName("lightingGetLights/LightExtentsQuery")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13382297))
        .SetDescription(
`
**Queries lights within spatial extents using the light octree spatial structure.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("LightFrustumQuery")
        .WithDisplayName("gatherLights/LightFrustumQuery")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13382297))
        .SetDescription(
`
**Queries lights visible within a frustum using the light octree spatial structure.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("LightGridCPU::updatePrepare")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10079282))
        .SetDescription(
`
Prepares CPU light grid updates each frame — activates lighting for global shadows,
refreshes lighting technology/brightness settings, and selects which dirty chunks
to update within the per-frame budget.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Octree::maintenance")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`
**Performs spatial structure maintenance — validates nodes and rebalances the spatial tree.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("RenderWorkspaceAdorns")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10040013))
        .SetDescription(
`
Renders 3D adornments for workspace content (selection boxes, handles, etc.).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("StandardAdorns")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13612347))
        .SetDescription(
`
**Renders standard adornments including humanoid name cache raycasts.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("PlayerAdorns")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(32767))
        .SetDescription(
`
**Renders 3D adornments for player GUI content.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::checkFastClusters")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
**Checks fast clusters for geometry changes that require visual updates.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::processPendingAttachments")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14408560))
        .SetDescription(
`
**Processes newly added Attachment instances for rendering (beam/constraint anchors).**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::processPendingMegaClusters")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13612347))
        .SetDescription(
`
**Processes newly added terrain chunks for rendering.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::processPendingParts")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(6266783))
        .SetDescription(
`
**Processes newly added parts into instanced rendering clusters.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::updateModelClusters")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9180951))
        .SetDescription(
`
**Updates model-level clusters and removes empty ones.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("WaitForRenderThread")
        .WithDisplayName("TransferControlToRenderThread/WaitForRenderThread")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2321294))
        .SetDescription(
`
Waits for the render thread to complete frame rendering before proceeding.

**Performance notes:** If wide, the render thread is still busy with GPU work from the current/previous frame.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("TransferControlToRenderThread")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
Submits rendering work to the dedicated render thread for processing.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("updateLightingAsyncTask")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Sequential per-chunk light-grid propagation on the calling thread,
after the parallel occupancy pass has finished.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updateTerrainPrepareChangedChunks")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(6266783))
        .SetDescription(
`
Identifies and prepares terrain chunks that changed since last frame for mesh regeneration.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updateUsedChunkMaterials")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(65407))
        .SetDescription(
`
Updates the set of materials used by visible terrain chunks.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updateWater")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Updates water surface rendering state and shader parameters,
plus terrain material constants (tiling/atlas/blend/emissive) for all terrain materials.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("updateWaterMaterialConstants")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5406582))
        .AsAliasOf("updateWater")
)
builder.AddTagToken(
    new TagTokenEntry("updateWaterMaterialParams")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(3715294))
        .AsAliasOf("updateWater")
)

builder.AddTagToken(
    new TagTokenEntry("processGizmos")
        .WithGroup(STR_TagGroups.GizmoManager)
        .WithColor(DecimalToRgb(10461023))
        .SetDescription(
`
**Processes constraint and attachment gizmos (hover/selection state and detail display).**
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("queryExtents")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7396243))
        .SetDescription(
`
Spatial queries: extent-based, frustum-based (ordered and unordered), and occlusion queries.

**queryFrustumOrdered** applies frustum culling so objects not visible are not rendered.

**What game creators can do:**
- High cost means lots of elements — use larger meshes with more detail rather than many small pieces
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("queryFrustum")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2321294))
        .AsAliasOf("queryExtents")
)
builder.AddTagToken(
    new TagTokenEntry("queryFrustumOrdered")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5855659))
        .AsAliasOf("queryExtents")
)
builder.AddTagToken(
    new TagTokenEntry("queryOcclusion")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5526612))
        .AsAliasOf("queryExtents")
)

builder.AddTagToken(
    new TagTokenEntry("relocateGrid")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(16723791))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Relocates the light grid when the camera moves to a new region.**
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("smoothClusterGetOrCreateChunk")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Terrain rendering chunk management — creates chunks or marks them for regeneration.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("smoothClusterMarkDirty")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("smoothClusterGetOrCreateChunk")
)

builder.AddTagToken(
    new TagTokenEntry("Draw Tiles")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Draws virtual texture tile content into a staging texture (later copied into the atlas).**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Edge Expansion")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Renders tile border expansion using radial shader to expand edges of virtual texture tiles.**
`
        )
)

const label_numEmitters = makeLabelName("numEmitters")
builder.AddGenericTagEntries([
        new TagLabel(label_numEmitters)
                .SetDescription("Emitters: {n}")
])

builder.AddTagToken(
    new TagTokenEntry("Emitter estimated boundings")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330147))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Estimates bounding volumes for particle emitters for culling purposes.

**Performance notes:** Recomputed for a particle emitter whenever its properties change; cost scales with the number of active particle emitters being (re)estimated in a frame.

**What game creators can do:**
- Reduce the number of active \`ParticleEmitter\`s; pool and reuse them instead of constantly creating new ones.
- Batch emitter property changes rather than changing them every frame — each change re-triggers a bounds estimate.
- Avoid continuously varying an emitter's motion properties (speed, acceleration, spread), which keep re-triggering estimation.
`
        )
        .AddLabel(label_numEmitters)
)

builder.AddTagToken(
    new TagTokenEntry("FXCompositing")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Composites glow and sun rays effects: binds source, glow, and sun rays textures and renders a fullscreen compositing pass.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Generate Mips Custom")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Generates custom mipmap levels for font atlas textures through downsampling and copying passes.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("HbaoRenderCompute")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5855659))
        .SetDescription(
`
**Computes HBAO (Screen-space ambient occlusion) using compute shaders.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("IndoorSkybox")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Renders a fallback indoor environment cubemap (per cube face)
used as a reflection/image-based-lighting source for indoor areas —
not a visible sky replacement.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Perform/InstanceGlob")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7396243))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Performs GPU buffer uploads of instance data, handling both stable-slot
path uploads and overflow entries via compute shaders.
`
        )
        .AddLabel(label_numInstances)
)

// LightGridCPU::LightGridCPU

builder.AddTagToken(
    new TagTokenEntry("LightGridCPU::updatePerform")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9315179))
        .AsAliasOf("LightGridCPU::LightGridCPU")
)
builder.AddTagToken(
    new TagTokenEntry("LightGridCPU::updateChunksAsyncTask")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14390128))
        .AsAliasOf("LightGridCPU::LightGridCPU")
)
builder.AddTagToken(
    new TagTokenEntry("LightGridCPU::updateChunkOccupancy")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(65407))
        .AsAliasOf("LightGridCPU::LightGridCPU")
)

// LoadImage

builder.AddTagToken(
    new TagTokenEntry("MaterialGenerator::garbageCollectIncremental")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(16723791))
        .SetDescription(
`
Incrementally garbage-collects unused material GPU resources.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("MeshReceived")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14381275))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Processes a mesh asset that finished downloading — decodes and prepares for rendering.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("MotionBuffer")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Motion vector generation for temporal effects — computes per-pixel motion for TAA,
motion blur, and reprojection. Separate passes for fast clusters and instanced clusters.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("MotionBuffer Fast Cluster Dispatch")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("MotionBuffer")
)
builder.AddTagToken(
    new TagTokenEntry("MotionBuffer Instanced Cluster Dispatch")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("MotionBuffer")
)
builder.AddTagToken(
    new TagTokenEntry("MotionBuffer update fast cluster movement")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("MotionBuffer")
)
builder.AddTagToken(
    new TagTokenEntry("MotionBuffer update non fast cluster movement")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("MotionBuffer")
)


builder.AddTagToken(
    new TagTokenEntry("OpenXrBeginFrame")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**OpenXR VR frame lifecycle — begins/ends the VR frame and updates tracking state.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("OpenXrEndFrame")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("OpenXrBeginFrame")
)
builder.AddTagToken(
    new TagTokenEntry("UpdateOpenXr")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("OpenXrBeginFrame")
)

builder.AddTagToken(
    new TagTokenEntry("Outline Effect")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Renders outline effects (Highlight instance outlines).
`
        )
)


const label_FastClusters_report = makeLabelName("FastClusters_report")
builder.AddGenericTagEntries([
        new TagLabel(label_FastClusters_report)
                .SetDescription("Num:{n} PartCount:{n}")
])

builder.AddTagToken(
    new TagTokenEntry("Parallel FastClusters")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14390128))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Updates fast cluster rendering data in parallel across worker threads.
`
        )
        .AddLabel(label_FastClusters_report)
)

builder.AddTagToken(
    new TagTokenEntry("Parse and Layout RichText")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Parses rich text markup and computes layout for styled text content.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("ParticleLighting")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10040013))
        .SetDescription(
`
Renders particle lighting via a lighting atlas: clears the atlas framebuffer,
binds lighting resources, and draws particles as triangles to generate per-particle lighting.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Prepare2dWindow")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Prepares different window/surface types for rendering (2D window, bound surface, standalone).**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("PrepareBound")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Prepare2dWindow")
)

// PrepareStandalone

builder.AddTagToken(
    new TagTokenEntry("ProcessUpdaterQueue")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Processes queued scene updater operations.**
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("Processes Feedback")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Processes virtual texture feedback requests — determines which tiles need loading.
Bypass path skips when no feedback is available.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Processes Feedback (bypass)")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Processes Feedback")
)


builder.AddTagToken(
    new TagTokenEntry("Perform/Profiler")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330216))
        .SetDescription(
`Renders the profiler UI and profiler adornments.`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Perform/ProfilerAdorn")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7396243))
        .AsAliasOf("Perform/Profiler")
)

// RaycastIndoorSingleRay / RaycastPointsClear
builder.AddTagToken(
    new TagTokenEntry("RaycastIndoorSingleRay")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(11904578))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Indoor environment raycasting for the PBR reflection probe:
sampling rays to determine room boundaries, plus line-of-sight checks between two points.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("RaycastPointsClear")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("RaycastIndoorSingleRay")
)

builder.AddTagToken(
    new TagTokenEntry("Render feedback")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Renders virtual texture feedback and tile content.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("RenderTiles")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("Render feedback")
)

builder.AddTagToken(
    new TagTokenEntry("RenderView")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5526612))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
**Renders one complete view (the main camera view or a secondary view).**
`
        )
        .AddLabel(label_renderPass_report)
)

builder.AddTagToken(
    new TagTokenEntry("Reproject")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
Reprojects previous frame cloud data for temporal coherence:
swaps cloud framebuffers and renders a reproject + filter pass.
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("SSAO")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Screen-space ambient occlusion computation and application to the scene.**

**What game creators can do:**
- Reduce the number of post-processing effects; usually not significant
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("SSAOApply")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("SSAO")
)

builder.AddTagToken(
    new TagTokenEntry("SceneUpdater::invalidatePartMaterial")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Marks parts with material changes for shader/batch reassignment.**
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("ShadowMapSystem::updatePerform")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(16723791))
        .SetDescription(
`
Performs shadow map rendering — the GPU-side shadow pass execution.

Updates shadow maps. Skipped or reduced at lower graphics quality levels.

**What game creators can do:**
- Reduce the number of lights
- Use \`Light.Shadows\` and \`BasePart.CastShadow\` to disable shadow casting on less important instances
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Sort active chunks")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Sorts active terrain chunks by priority for rendering/streaming.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("SunRaysBlur")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7029286))
        .SetDescription(
`
Sun ray effect sub-passes: computes light shafts, blurs them, and downsamples for efficiency.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("SunRaysCompute")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .AsAliasOf("SunRaysBlur")
)
builder.AddTagToken(
    new TagTokenEntry("SunRaysDownSample")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330147))
        .AsAliasOf("SunRaysBlur")
)


builder.AddTagToken(
    new TagTokenEntry("SwOcc main loop")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Software occlusion culling — rasterizes simplified occluders on the CPU to cull hidden objects before GPU submission.

These are the top-level scopes for the software occlusion system. \`SwOcc main loop\` is the per-frame orchestrator
and \`SwOcc setup\` prepares candidate occluders.

**Performance notes:** Runs on CPU threads and benefits scenes with high depth complexity.
If these scopes are collectively wide, the scene has many potential occluders/occludees.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("SwOcc setup")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("SwOcc main loop")
)

builder.AddTagToken(
    new TagTokenEntry("Synthetic feedback")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Generates synthetic virtual texture feedback for tiles that weren't rendered but are needed.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Text Shaping+Layout")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9315107))
        .SetDescription(
`
Text rendering pipeline: font lookup, text shaping (glyph selection and positioning), and layout computation.

**Performance notes:** Runs when text or its layout changes; cost scales with the amount of text shaped and
with the number of separate font runs in a string (each distinct font is shaped separately).

**What game creators can do:**
- Reduce the total amount of on-screen text, and avoid re-setting \`Text\` every frame — each change re-shapes it.
- Update only what changes (e.g. a single number) rather than rewriting a whole label, so unchanged text isn't re-shaped.
- Minimize font changes within a single rich-text string; each distinct font becomes a separate shaping run.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Typesetter::layout")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14408560))
        .AsAliasOf("Text Shaping+Layout")
)
builder.AddTagToken(
    new TagTokenEntry("Typesetter::shape")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(32767))
        .AsAliasOf("Text Shaping+Layout")
)
builder.AddTagToken(
    new TagTokenEntry("getHbFont")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7396243))
        .AsAliasOf("Text Shaping+Layout")
)
builder.AddTagToken(
    new TagTokenEntry("hb_shape")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9180951))
        .AsAliasOf("Text Shaping+Layout")
)

builder.AddTagToken(
    new TagTokenEntry("TextureAtlas::upload")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9333539))
        .SetDescription(
`
Uploads texture atlas data to the GPU.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("TextureCompositor::render")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7029286))
        .SetDescription(
`
Composites layered textures (avatar clothing, decals) and updates compositor state.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("TextureCompositor::update")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14408560))
        .AsAliasOf("TextureCompositor::render")
)


builder.AddTagToken(
    new TagTokenEntry("TextureManager::loadImage")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Loads image textures and processes texture quality changes from the performance control system.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("TextureManager::processTextureQualityChange")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("TextureManager::loadImage")
)

builder.AddTagToken(
    new TagTokenEntry("TreeTraversal")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Traverses terrain spatial structure for LOD chunk activation:
processes destroy handles, updates chunks based on point of interest, and activates/deactivates
chunks by camera distance.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("UITextureRenderer::compositeUITextures")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5855659))
        .SetDescription(
`
**Composites UI textures (CanvasGroups) and resolves their dependency trees.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("UITextureRendererBaseline::compositeUITextures")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("UITextureRenderer::compositeUITextures")
)
builder.AddTagToken(
    new TagTokenEntry("UITextureRendererBaseline::recurseDependencyTree")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("UITextureRenderer::compositeUITextures")
)

// UpSample / Upsample
builder.AddTagToken(
    new TagTokenEntry("UpSample")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14408560))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Upsamples a lower-resolution render target back up the mip chain:
bloom (Glow) combines its blurred mip levels, and volumetric clouds upsample their half-resolution buffer.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("Upsample")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("UpSample")
)


builder.AddTagToken(
    new TagTokenEntry("UploadingMeshSizeBucketTelemetry")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2321294))
        .SetDescription(
`
Telemetry scopes for mesh metrics:
size distribution and time-to-serve of mesh uploads,
plus render-fidelity (LOD/detail-level) analytics that are not upload measurements.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("UploadingMeshTTMQTelemetry")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("UploadingMeshSizeBucketTelemetry")
)
builder.AddTagToken(
    new TagTokenEntry("UploadingMeshTimeToServeTelemetry")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9315107))
        .AsAliasOf("UploadingMeshSizeBucketTelemetry")
)
builder.AddTagToken(
    new TagTokenEntry("UploadingRenderFidelityTelemetry")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("UploadingMeshSizeBucketTelemetry")
)


builder.AddTagToken(
    new TagTokenEntry("VertexStreamer::renderPrepare")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(8740418))
        .SetDescription(
`
Prepares streaming vertex data and world-space streamer for the render pass.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("WorldSpaceStreamer::renderPrepare")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("VertexStreamer::renderPrepare")
)

builder.AddTagToken(
    new TagTokenEntry("ViewportFrameSky")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Renders sky within ViewportFrame contexts.
`
        )
)


const label_numVisible = makeLabelName("numVisible")
builder.AddTagLabel(
        new TagLabel(label_numVisible)
                .SetDescription(
`
Visible: {n}
`
                )
)
builder.AddTagToken(
    new TagTokenEntry("VisibleQuery")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
Performs a visibility query to determine which objects are in view.
`
        )
        .AddLabel(label_numVisible)
)


builder.AddTagToken(
    new TagTokenEntry("VrSubmitFrame")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**VR frame lifecycle — prepares, submits, and synchronizes VR frames.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("vrPrepareFrame")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("VrSubmitFrame")
)
builder.AddTagToken(
    new TagTokenEntry("waitVR")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("VrSubmitFrame")
)
builder.AddTagToken(
    new TagTokenEntry("xrWaitFrame")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("VrSubmitFrame")
)

builder.AddTagToken(
    new TagTokenEntry("WaitForLock")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Waits for a rendering lock to be released.**
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("acquireFramebuffer")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Acquires the framebuffer and swap chain images for the current frame.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("acquireSwapchains")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("acquireFramebuffer")
)


builder.AddTagToken(
    new TagTokenEntry("add tile mips")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Virtual texture mipmap management — adds mip levels, applies results, and computes requirements.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("applyMipResults")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("add tile mips")
)
builder.AddTagToken(
    new TagTokenEntry("computeMipRequirements")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("add tile mips")
)


builder.AddTagToken(
    new TagTokenEntry("asyncGrassTask")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Grass rendering: generates grass geometry asynchronously and uploads to GPU.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("generateGrass")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("asyncGrassTask")
)
builder.AddTagToken(
    new TagTokenEntry("uploadGrass")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("asyncGrassTask")
)

builder.AddTagToken(
    new TagTokenEntry("blurRender")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14408560))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Generic screen-space Gaussian blur pass used by post-processing effects (e.g. depth of field, bloom).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("cameraOnHeartbeat")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Updates camera state on the heartbeat — drives constant-speed interpolation (Studio)
and signals when a smooth transition is complete.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("Render_clear")
        .WithDisplayName("clear")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Clears invalidation event queue and merged invalidate events in dispatch scene.**
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("computeUploadFull")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330147))
        .SetDescription(
`
**GPU compute upload passes — full upload, staging area, and overflow handling.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("computeUploadStaging")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("computeUploadFull")
)
builder.AddTagToken(
    new TagTokenEntry("computeUploadStagingOverflow")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("computeUploadFull")
)

builder.AddTagToken(
    new TagTokenEntry("copyLockedContent")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Copy-on-write clone of voxelizer occupancy data when a write is needed while readers hold it.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("copySkylight")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9180951))
        .SetDescription(
`
**Copies combined skylight+sunlight data into a destination texture buffer for processing.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("count covered pixels")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Counts how many feedback-buffer pixels each virtual texture tile covers,
driving which terrain texture tiles to stream in.
`
        )
)

const label_destroyGeometry_report = makeLabelName("destroyGeometry_report")
builder.AddTagLabel(
        new TagLabel(label_destroyGeometry_report)
                .SetDescription(
`
Destroyed {n} queued {n}
`
                )
)
builder.AddTagToken(
    new TagTokenEntry("destroyGeometry")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7029286))
        .InsertSearchTags([STR_SearchTags.Examined])
        .SetDescription(
`
**Destroys geometry resources that are no longer needed.**
`
        )
        .AddLabel(label_destroyGeometry_report)
)


builder.AddTagToken(
    new TagTokenEntry("encodeDXT5")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Real-time texture compression — DXT5 (desktop) and ETC2 (mobile) formats.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("encodeETC2")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("encodeDXT5")
)

builder.AddTagToken(
    new TagTokenEntry("endBatcher")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(13467442))
        .SetDescription(
`
Completes instance handle batch upload and allocates buffer if needed.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("filterRequests")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5406582))
        .SetDescription(
`
Filters pending terrain/mesh requests by priority and budget.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("fitIntoMeshesBudget")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5526612))
        //.InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Manages mesh LOD promotion within video memory budget:
assigns priorities, sorts, promotes LODs within budget, unloads lower priority, and applies requests.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("gpuVoxelsPerform")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**GPU voxel terrain system — prepares, processes feedback, updates chunk tables, handles requests, and uploads subtrees.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("gpuVoxelsPrepare")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("gpuVoxelsPerform")
)
builder.AddTagToken(
    new TagTokenEntry("gpuVoxelsProcessChunkTableUpdates")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("gpuVoxelsPerform")
)
builder.AddTagToken(
    new TagTokenEntry("gpuVoxelsProcessFeedback")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("gpuVoxelsPerform")
)
builder.AddTagToken(
    new TagTokenEntry("gpuVoxelsProcessRequestedChunks")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("gpuVoxelsPerform")
)
builder.AddTagToken(
    new TagTokenEntry("gpuVoxelsUpdateCompressedChunkPriorityQueue")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("gpuVoxelsPerform")
)
builder.AddTagToken(
    new TagTokenEntry("gpuVoxelsUploadSubtree")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("gpuVoxelsPerform")
)

builder.AddTagToken(
    new TagTokenEntry("invalidateFailedResource")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Invalidates a resource that failed to load — marks it for retry or fallback.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("lightingClearSkylightSunlightChunk")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Light grid computation sub-phases: clears skylight data, composites lighting,
computes shadow masks, gathers lights, updates chunks (local/global/skylight),
updates individual light types, and uploads/commits results to GPU.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("lightingComposit")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(11904578))
        .AsAliasOf("lightingClearSkylightSunlightChunk")
)
builder.AddTagToken(
    new TagTokenEntry("lightingGetLights")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330147))
        .AsAliasOf("lightingClearSkylightSunlightChunk")
)
builder.AddTagToken(
    new TagTokenEntry("lightingUpdateChunkGlobal")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(16723791))
        .AsAliasOf("lightingClearSkylightSunlightChunk")
)
builder.AddTagToken(
    new TagTokenEntry("lightingUpdateChunkLocal")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(2330216))
        .AsAliasOf("lightingClearSkylightSunlightChunk")
)
builder.AddTagToken(
    new TagTokenEntry("lightingUpdateChunkSkylight")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(5205839))
        .AsAliasOf("lightingClearSkylightSunlightChunk")
)
builder.AddTagToken(
    new TagTokenEntry("lightingUploadChunk")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(9315107))
        .AsAliasOf("lightingClearSkylightSunlightChunk")
)
builder.AddTagToken(
    new TagTokenEntry("lightingUploadCommit")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(12088115))
        .AsAliasOf("lightingClearSkylightSunlightChunk")
)


builder.AddTagToken(
    new TagTokenEntry("meshChunk")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Terrain mesh chunk operations — generates, reads, and processes terrain mesh chunks and their borders.**
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("occupancyUpdateChunkPerform")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Updates light grid chunk occupancy — determines which grid cells contain geometry.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("occupancyUpdateChunkPrepare")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("occupancyUpdateChunkPerform")
)

builder.AddTagToken(
    new TagTokenEntry("plantGrass")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(3715294))
        .SetDescription(
`
Plants grass decoration geometry on terrain surfaces.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("prepareProfiler")
        .WithDisplayName("Prepare/prepareProfiler")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7029286))
        .SetDescription(
`
Prepares profiler data for on-screen rendering.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("processDestroyQueue")
        .WithDisplayName("Perform/processDestroyQueue")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(7029286))
        .SetDescription(
`
Destroys terrain render chunks queued for teardown.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("processTextureQuality")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Adjusts texture mip levels up or down each frame based on GPU memory pressure
against configured budget thresholds.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("queryFrustumEnvMap")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Reads back GPU timer-query results to compute the previous frame's GPU time.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("queryResults")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("queryFrustumEnvMap")
)
builder.AddTagToken(
    new TagTokenEntry("querySphere")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("queryFrustumEnvMap")
)


builder.AddTagToken(
    new TagTokenEntry("queuePresent")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Queues the present operation and submits/flips the swap chain.**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("submitAndFlip")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("queuePresent")
)

builder.AddTagToken(
    new TagTokenEntry("releaseResources")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Releases GPU resources that are no longer referenced.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("remove overflow tiles")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Removes virtual texture tiles that exceeded the atlas capacity.**
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("render2D")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(14381275))
        .SetDescription(
`
VertexStreamer adorn rendering — render3D draws world-space adorn geometry;
render2D draws screen-space adorn geometry via an orthographic camera.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("render3D")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(16744192))
        .AsAliasOf("render2D")
)

builder.AddTagToken(
    new TagTokenEntry("requestMeshContent")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Applies pending mesh LOD requests within the memory budget — both unloading/evicting LODs and
requesting new LOD downloads from the asset system.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("resetCommandPool")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Resets the GPU command pool for reuse in the next frame.
`
        )
)



builder.AddTagToken(
    new TagTokenEntry("sortUpdates")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Sorts pending updates by priority before processing.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("synthesize tile requests")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
Synthesizes virtual texture tile requests from visible renderables — the CPU fallback path
used when the GPU feedback buffer is not consumed.
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("trimMemory")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Trims GPU memory by evicting low-priority resources.**
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("updateChunk")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Updates terrain rendering chunks and their skirt masks (LOD seam hiding).**
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("updateChunkSkirtMasks")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("updateChunk")
)

builder.AddTagToken(
    new TagTokenEntry("updateDynamicObjectList")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Removes old dynamic object status after 32 frames by checking entry age.**
`
        )
)


builder.AddTagToken(
    new TagTokenEntry("updateLod")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(32767))
        .SetDescription(
`
Updates terrain LOD levels and transition blending state.
`
        )
)
builder.AddTagToken(
    new TagTokenEntry("updateTransitionState")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .AsAliasOf("updateLod")
)


// updateParticles
builder.AddTagToken(
    new TagTokenEntry("updateParticlesNonVisible")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("updateParticles")
)
builder.AddTagToken(
    new TagTokenEntry("updateParticlesVisible")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("updateParticles")
)
builder.AddTagToken(
    new TagTokenEntry("updateParticleBoundings")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        //.InsertSearchTags([])
        .AsAliasOf("updateParticles")
)

builder.AddTagToken(
    new TagTokenEntry("updatePlaneEffect")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(10079282))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Updates plane-based visual effects.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updateTerrainPrepareChangedChunksFilter")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Sorts the changed-terrain-chunk list by LOD and coordinate, then deduplicates it before preparation.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("updateVR")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(65407))
        .SetDescription(
`
Updates VR-specific rendering state (head tracking, eye buffers).
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("uploadChunk")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Uploads a single terrain chunk's mesh data to the GPU (vertex/index buffers). Queue iteration is handled by the caller.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("videoPresent")
        .WithGroup(STR_TagGroups.Render)
        //.WithColor(DecimalToRgb(9000))
        .InsertSearchTags([STR_SearchTags.NotExamined])
        .SetDescription(
`
**Presents a video frame to the display.**
`
        )
)

builder.AddTagToken(
    new TagTokenEntry("waitOnGpu")
        .WithGroup(STR_TagGroups.Render)
        .WithColor(DecimalToRgb(8740418))
        .SetDescription(
`
Synchronization points — waits for async worker thread or GPU completion.

**Performance notes:** A wide wait means the CPU is idle waiting for something else to finish —
most often the GPU (the frame is GPU-bound), sometimes a worker thread.

**What game creators can do:** This is a *symptom* of being GPU-bound, not a cost to optimize directly.
Reduce GPU load (see the GPU-group \`Scene\` scope): fewer transparent objects and less overdraw, simpler materials,
and fewer post-effects.
`
        )
)


export default {}
