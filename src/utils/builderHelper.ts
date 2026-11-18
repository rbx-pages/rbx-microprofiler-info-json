import { TagDataBuilder, TagDataClasses } from "../builderOut.js"

const builder = new TagDataBuilder();

export const STR_TagGroups = {  
  LuaBridge: "LuaBridge",
  Physics: "Physics",
  Render: "Render",
}

export const builderHelper = {
  TagDataBuilder,
  TagDataClasses,
  currentBuilder: builder,
}

export default builderHelper;
