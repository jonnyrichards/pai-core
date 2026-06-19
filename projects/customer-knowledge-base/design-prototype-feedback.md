# CKB Design Prototype Feedback

| Location | Feature | Notes | Propose / Suggest |
|---|---|---|---|
| Upload context panel | Context type selector | What if they want to add something we've not considered? | Shoudl we add 'Other'?|
| Add context panel | 'Generate' | I find this a bit unspecific | 'Extract context' (For me the mental model here is around 'extracting' from what they've given us and turning it into something Coach can use — hence extraction?) |
| Confirm context panel | 'Here's what I understood' | Doesn't feel like a headline to me | 'Confirm context' (Simple, functional header) |
| Confirm context panel | Edit functionality | Can't change tag | Enable tag edit on Edit? |
| Confirm context panel | 'Add access' | 'Access' feels off to me | 'Add to Coach'? |
| Upload panel | Batch upload (ie. is possible) | Downside of batch is: user can only choose one tag per batch (what if the documents need different tags?) Given this downside, what do we think the ability to batch upload provides? Would be good to user-test this. | |
| Confirm context panel | 'You already have...' message | We should communicate the ability to merge them | Add: 'You can switch back, or merge them with Edit' |
| Confirm context panel | Name field | Something is going on here with the name; I think you mean for it to be pulled through from the upload screen, but at the moment it defaults to 'Your values 2026' — should be easy to update in the code? | |
| Edit context screen | Name field | Name (in main table) and Heading (in drop down) don't align currently; needs some smoothing over | |
| Confirm context panel | 'AI can make mistakes' | This feels like it's part of the header. Does it need to be this prominent? | |
| Main table | Archive layer | Which use case does this solve for? I feel like 'Inactive' is a form of Archive already. Do we think this is worth testing? Or can we remove? | |
| Main table | Showing all tasks | What does this do? Can we remove it? | |
| Three-dot menu | Add from Drive | Nice idea. Definitely worth testing... | |
| Three-dot menu | 'Upload files' silently adds new file to context, skips the regular upload flow | The upload flow works well. My sense is, if a user wants two files, this is handled in the main 'Add context' flow? | Suggest removing 'Upload files' from three-dot menu |
