import { TagDataBuilder, TagDataClasses, TagDataProcessing } from "../builderOut.js"

let builder = new TagDataBuilder()

export const STR_TagGroups = {
    Ads: "Ads",
    Animation: "Animation",
    App: "App",
    Heartbeat: "Heartbeat",
    Input: "Input",
    Jobs: "Jobs",
    LuaBridge: "LuaBridge",
    MicroProfiler: "MicroProfiler",
    Network: "Network",
    Physics: "Physics",
    Render: "Render",
    Runtime: "Runtime",
    Script: "Script",
    Systems: "Systems",
    UI: "UI",
    Voice: "Voice",
}

export const STR_SearchTags = {
    RbxWikiOriginal: "WikiOriginal",
    NotExamined: "NotExamined",
    Examined: "Examined",
}


const builderHelper = {
    TagDataBuilder,
    TagDataClasses,
    TagDataProcessing,

    STR_TagGroups,
    STR_SearchTags,

    labelPrefix: "label_",

    currentBuilder: builder,
};


export default builderHelper;
