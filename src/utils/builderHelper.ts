import { TagDataBuilder, TagDataClasses } from "../builderOut.js"

let builder = new TagDataBuilder();

export const STR_TagGroups = {
    App: "App",
    Systems: "Systems",
    Jobs: "Jobs",
    Heartbeat: "Heartbeat",
    LuaBridge: "LuaBridge",
    Script: "Script",
    Physics: "Physics",
    Render: "Render",
    Input: "Input",
    Voice: "Voice",
}

export const builderHelper = {
  TagDataBuilder,
  TagDataClasses,

  STR_TagGroups,
  
  currentBuilder: builder,
}

export default builderHelper;
