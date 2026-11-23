import { TagDataBuilder, TagDataClasses, TagDataProcessing } from "../builderOut.js"

// THE ABOVE SHOULD NOT GET OVERWRITTEN
// ---

let builder = new TagDataBuilder()

export const STR_TagGroups = {
    Ads: "Ads",
    Animation: "Animation",
    App: "App",
    AssetProvider: "AssetProvider",
    Avatar: "Avatar",
    CageDeformer: "CageDeformer",
    Camera: "Camera",
    D3D11: "D3D11",
    FileMeshData: "FileMeshData",
    FmdScratch: "FmdScratch",
    FroxelGrid: "FroxelGrid",
    GizmoManager: "GizmoManager",
    GPU: "GPU",
    Graphics: "Graphics",
    Heartbeat: "Heartbeat",
    HSR: "HSR",
    Input: "Input",
    Jobs: "Jobs",
    LC: "LC",
    LightGrid: "LightGrid",
    LuaBridge: "LuaBridge",
    Memory: "Memory",
    MemProfStorage: "MemProfStorage",
    MicroProfiler: "MicroProfiler",
    Network: "Network",
    OverflowGroup: "(OverflowGroup)",
    PerformanceControl: "PerformanceControl",
    Physics: "Physics",
    Qt: "Qt",
    RakNet: "RakNet",
    Rbf: "Rbf",
    RbxTransport: "RbxTransport",
    Render: "Render",
    Runtime: "Runtime",
    Script: "Script",
    ScriptContext: "ScriptContext",
    Shadows: "Shadows",
    Simulation: "Simulation",
    Sleep: "Sleep",
    Skeleton: "Skeleton",
    Slim: "Slim",
    Sound: "Sound",
    SoundOutput: "SoundOutput",
    Systems: "Systems",
    TaskQueue: "TaskQueue",
    Tasks: "Tasks",
    telem: "telem", // bruh?
    Telemetry: "Telemetry",
    UI: "UI",
    VertexNormals: "VertexNormals",
    Video: "Video",
    Voice: "Voice",
}

export const STR_SearchTags = {
    RbxWikiOriginal: "WikiOriginal",
    NotExamined: "NotExamined",
    Examined: "Examined",
}

function DecimalToRgb(value: number): [number, number, number] {
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;

    return [r, g, b]
}

const builderHelper = {
    TagDataBuilder,
    TagDataClasses,
    TagDataProcessing,

    STR_TagGroups,
    STR_SearchTags,

    DecimalToRgb: DecimalToRgb,

    currentBuilder: builder,
};


//export {TagDataBuilder, TagDataClasses}


export default builderHelper;
