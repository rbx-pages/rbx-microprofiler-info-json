import fs from "fs"
//import { TagDataBuilder, TagDataClasses } from "./builderOut.js"
//import TagInfoBuilder from "https://example.com"
import _tags from "./tags/index.ts"
{
    function stub() {}
    stub(_tags) // We need to give it a reason to run
}


// ---

import builderHelper, {STR_TagGroups} from "./utils/builderHelper.ts"

const TagDataClasses = builderHelper.TagDataClasses
const TagDataBuilder = builderHelper.TagDataBuilder

const TagTokenEntry = TagDataClasses.TagTokenEntry
const TagGroupEntry = TagDataClasses.TagGroupEntry
const TagLabel = TagDataClasses.TagLabel

const builder = builderHelper.currentBuilder

//
// Do NOT remove content above
//

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

fs.writeFileSync( "output_metadata.json", JSON.stringify({}, null, 2) );
