<template>
    <div class="card flex justify-center">
        <Dialog v-model:visible="dialogs.openFADialogAlt" modal class="w-[30rem] sm:mx-0 mx-[5px]" @hide="">
            <template #header>
                <Button icon="pi pi-question" class="min-w-[40px]" rounded aria-label="Dialog Help" @click="e => dialogInfo.toggle(e)" />
                <Popover ref="dialogInfo" class="w-full max-w-[350px]">
                    If your post is Mature / Adult rated, or your profile is private, you can still manually
                    extract the users following these simple steps
                </Popover>
                <div class="text-lg text-center">Manually importing from FurAffinity</div>
            </template>

            <ol class="list-decimal ml-5 mt-1">
                <li class="mb-2">Go to your raffle post or journal</li>
                <li class="mb-2"><span class="font-semibold">Press F12</span> or <span class="font-semibold">Right click -> Inspect</span></li>
                    <Message size="small" id="post-help" severity="secondary" variant="simple">
                        <p class="mb-3 ml-3 mt-1">That will open a side window on your browser</p>
                    </Message>
                <li class="mb-2">Look for the <span class="font-semibold">Console</span> tab on the top</li>
                <li class="mb-2">Copy the code below</li>
                <Accordion v-model:value="open">
                    <AccordionPanel class="!border-[1px] rounded my-3" value="0">
                        <AccordionHeader>View code</AccordionHeader>
                        <AccordionContent>
                            <div class="flex items-center gap-2 mb-5">
                                <Checkbox v-model="removeHost" inputId="remove-alt-host" binary :disabled="isFetching" />
                                <label for="remove-alt-host">Remove Host from the results</label>
                            </div>
                            <div class="text-end mb-3">
                                <Button label="Copy" variant="text" icon="pi pi-copy" size="small" @click="copyCode" />
                            </div>
                            <pre id="fa-copy-code" class="white-space-pre overflow-x-auto max-h-[300px] max-w-[70dvw] sm:max-w-[30rem]">
{{`const comments = document.querySelectorAll("comment-container:not(.deleted-comment-container)")

const users = new Map()
const hostDisplayName = document.querySelector('.submission-id-container .c-usernameBlockSimple__displayName')?.getAttribute('title').trim() ||
                        document.querySelector('.c-usernameBlock.username-in-nav-bar .c-usernameBlock__userName').textContent.trim().substring(1)

for (const comment of Array.from(comments)) {
    const image = comment.querySelector('.avatar img').src
    const userName = comment.querySelector("comment-username .js-userName-block").textContent.trim().substring(1)
    const name = comment.querySelector("comment-username .js-displayName").textContent
    users.set(userName, {name, image})
}
${!removeHost ? '' : `
users.delete(hostDisplayName)
`}
const serialized = JSON.stringify([...users.values()], null, 2)
const blob = new Blob([serialized], { type: "application/json" })
const url = URL.createObjectURL(blob)
const a = document.createElement("a")
a.href = url
a.download = "participants.json"
a.click()
URL.revokeObjectURL(url)`}}
                            </pre>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>

                <li class="mb-2">Paste it inside the <span class="font-semibold">Console</span> tab and execute it (Enter)</li>
                <Message size="small" id="post-help" severity="secondary" variant="simple">
                    <p class="m-3">If your browser asks for permission to download files, say yes (don't worry it isn't a virus -.=.-)</p>
                    <p class="m-3">That will download a "participants.json" file with all the users.</p>
                </Message>
                <li class="mb-2">Now you can import them with the 
                    <Button label="Add from JSON file" size="small" variant="text" @click="openJSONDialog" /> 
                option here!</li>

            </ol>

            <div class="flex justify-end gap-2">
                <Button type="button" label="Close" variant="text" severity="secondary" @click="dialogs.openFADialogAlt = false" />
            </div>

        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from "primevue/usetoast"

const toast = useToast()
const open = ref('')
const dialogs = defineModel({ required: true })
const removeHost = ref(true)
const dialogInfo = ref()

const copyCode = async () => {
    const code = document.querySelector('#fa-copy-code').textContent
    await navigator.clipboard.writeText(code)
    toast.add({ severity: 'success', summary: 'Code successfully copied!', life: 3000 })
    setTimeout(() => open.value = '', 200)
}

const openJSONDialog = () => {
    dialogs.value.openFADialog = false
    dialogs.value.openFADialogAlt = false
    dialogs.value.openJSONDialog = true
}
</script>