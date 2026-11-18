import fs from "fs"
//import { TagDataBuilder, TagDataClasses } from "./builderOut.js"
//import TagInfoBuilder from "https://example.com"
import builderHelper from "./utils/builderHelper"

const TagDataClasses = builderHelper.TagDataClasses
const TagDataBuilder = builderHelper.TagDataBuilder

const TagTokenEntry = TagDataClasses.TagTokenEntry
const TagGroupEntry = TagDataClasses.TagGroupEntry
const TagLabel = TagDataClasses.TagLabel

const builder = builderHelper.currentBuilder

//
// Do NOT remove content above
//

builder.AddTagGroup(
    new TagGroupEntry("LuaBridge")
        .SetDescription(`
            This is LuaBridge!
            Very cool!
        `)
)
builder.AddTagGroup(
    new TagGroupEntry("Systems")
        .SetDescription(`
            This is Systems!
        `)
)


builder.AddGenericTagEntries(
    [
        new TagTokenEntry("test")
            .SetDescription("This is test")
            .WithColor([255,0,0]),
        new TagTokenEntry("test2")
            .SetDescription("This is test2")
            .WithColor([0,255,0]), 
        new TagTokenEntry("test3")
            .SetDescription("This is test3")
            .WithColor([0,0,255]), 
    ]
)

builder.Finalize()
let dataJsonStr = builder.toJSON()


//
// Do NOT remove content below
//

fs.writeFileSync( "output.json", JSON.stringify(JSON.parse(dataJsonStr), null, 2) );
