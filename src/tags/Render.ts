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

const label_instancedClusters_report = makeLabelName("instancedClusters_report")
builder.AddTagLabel(
        new TagLabel(label_instancedClusters_report)
                .SetDescription(
`
clusters: {n} — the number of instanced clusters updated.<br/>
instances: {n}
`
                )
)

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
        .AddLabel(label_instancedClusters_report)
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



////

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
