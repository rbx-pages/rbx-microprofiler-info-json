import builderHelper, {STR_SearchTags, STR_TagGroups} from "../utils/builderHelper"

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
    new TagGroupEntry(STR_TagGroups.LuaBridge)
        .SetDescription(
`LuaBridge is the bridge from C++ to Luau.
When a Luau script has to interact with the Engine, something has to bridge Luau to C++
This is the LuaBridge.

Along with that, the Roblox Engine needs to perform Security and Capability checks to determine whether a script
can actually access, and whether the Security Context is correct.


These entries are extremely useful in the MicroProfiler.

https://devforum.roblox.com/t/roblox-luabridge-where-the-magic-lies-within-when-talking-to-the-datamodel/3356959
        `)
)


const label_LuaBridge_whatIsAccessed = makeLabelName("LuaBridge_whatIsAccessed")
const label_LuaBridge_callFuncName = makeLabelName("LuaBridge_callFuncName")

builder.AddGenericTagEntries([
    new TagLabel(label_LuaBridge_whatIsAccessed)
        .SetDescription(
`
A label that shows what was indexed onto.
`
        ),

    new TagLabel(label_LuaBridge_callFuncName)
        .SetDescription(
`
A label that shows the function name
`
        )
])


builder.AddTagToken(
    new TagTokenEntry("LuaBridge_index")
        .WithDisplayName("$index_<Property>")
        .WithColor(DecimalToRgb(9333539))
        .WithGroup(STR_TagGroups.LuaBridge)
        .SetDescription(
`When accessing Roblox Engine fields/properties such as ${"``Instance.Name``"}, causes ${"``index_Name``"} to appear.
Contains labels that indicate what was accessed.

Tag origins from C++ in ${"``on_index``"}.
`
        )
        .InsertSearchTags([STR_SearchTags.Examined])
        .AddLabel(label_LuaBridge_whatIsAccessed)
)

builder.AddTagToken(
    new TagTokenEntry("LuaBridge_newindex")
        .WithDisplayName("$newindex_<Property>")
        .WithColor(DecimalToRgb(5205839))
        .WithGroup(STR_TagGroups.LuaBridge)
        .SetDescription(
`Similar to $index, except ${"``Instance.Name = \"Name\"``"}.

This one appears when trying to alter a property through a script.

Doing a "newindex_" directly on something that will receive the same value again may be less efficient,
and it might be better to check if it is different through "index_" or other methods.
`
        )
        .InsertSearchTags([STR_SearchTags.Examined])
        .AddLabel(label_LuaBridge_whatIsAccessed)
)

builder.AddTagToken(
    new TagTokenEntry("LuaBridge_namecall")
        .WithDisplayName("$namecall_<FuncName>")
        .WithColor(DecimalToRgb(12088115))
        .WithGroup(STR_TagGroups.LuaBridge)
        .SetDescription(
`
LuaBridge for \`\`Instance:FuncName()\`\`, namecalling.
Contains labels that indicate what was accessed and what method was invoked.
The invoked method is also shown in the timer name.
`
        )
        .InsertSearchTags([STR_SearchTags.Examined])
        .AddLabel(label_LuaBridge_callFuncName)
        .AddLabel(label_LuaBridge_whatIsAccessed)
)

builder.AddTagToken(
    new TagTokenEntry("LuaBridge_call")
        .WithDisplayName("$call_<FuncName>")
        .WithColor(DecimalToRgb(5205839))
        .WithGroup(STR_TagGroups.LuaBridge)
        .SetDescription(
`
Similar to $namecall but not namecalling
`
        )
        .InsertSearchTags([STR_SearchTags.Examined])
        .AddLabel(label_LuaBridge_callFuncName)
        .AddLabel(label_LuaBridge_whatIsAccessed)
)

export default {}
