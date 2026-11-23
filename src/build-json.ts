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
const TagDataProcessing = builderHelper.TagDataProcessing

const TagTokenEntry = TagDataClasses.TagTokenEntry
const TagGroupEntry = TagDataClasses.TagGroupEntry
const TagLabel = TagDataClasses.TagLabel

const builder = builderHelper.currentBuilder

//
// Do NOT remove content above
//

/*builder.AddGenericTagEntries(
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
)*/


//
// Pre-set code
//

builder.Finalize()
let dataJSON_str = builder.toJSON()
let dataJSON_parsed = JSON.parse(dataJSON_str)

let newMetadata = new TagDataProcessing.TagDataRootMeta(dataJSON_parsed)
let metadataJSON_str = newMetadata.toJSON()

//
// Do NOT remove content below
//

fs.writeFileSync( "output.json", JSON.stringify(dataJSON_parsed, null, 2) );

fs.writeFileSync( "output_metadata.json", JSON.stringify(JSON.parse(metadataJSON_str), null, 2) );
