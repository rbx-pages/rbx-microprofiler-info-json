import { TagDataBuilder, TagDataClasses } from "../builderOut.js"

let builder = new TagDataBuilder();

export const STR_TagGroups = {
    App: "App",
    Systems: "Systems",
    LuaBridge: "LuaBridge",
    Physics: "Physics",
    Render: "Render",
}

export const builderHelper = {
  TagDataBuilder,
  TagDataClasses,

  STR_TagGroups,
  
  currentBuilder: builder,
}

export default builderHelper;
