<template>
    <div class="card flex justify-center">
        <Dialog v-model:visible="visible" modal class="max-w-[25rem] sm:mx-0 !mx-[5px]" @hide="postURL = ''">
            <template #header>
                <Button icon="pi pi-question" rounded aria-label="Dialog Help" @click="e => dialogInfo.toggle(e)" />
                <Popover ref="dialogInfo" class="w-full max-w-[350px]">
                    This component will analyze a Bsky post and either gather all the users that left a comment at root level or
                    users who reposted, or both! You can also filter them by your followers, or people who reposted.
                </Popover>
                <div class="text-lg">Add from Bsky</div>
            </template>

            <Form v-slot="$form" :resolver validateOnSubmit @submit="submit">
                <div class="flex flex-col gap-2 mt-3 mb-8">
                    <label for="bsky-post">Post URL</label>
                    <InputText id="bsky-post" v-model="postURL" 
                        name="postURL" aria-describedby="post-help" autoFocus 
                        placeholder="https://bsky.app/profile/my.user.handle/post/xxxxxxxxxxxxxx/"
                        type="text" :disabled="isFetching"
                    />
                    <Message size="small" id="post-help" severity="secondary" variant="simple">
                        URL to the Bsky raffle post. 
                    </Message>
                    <Message 
                        v-if="$form.postURL?.invalid" 
                        severity="error" 
                        size="small" 
                        variant="simple"
                    >
                        {{ $form.postURL?.error.message }}
                    </Message>
                </div>

                <div class="flex flex-col gap-2 mt-3 mb-8">
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="addReplies" name="addReplies" inputId="add-replies" binary :disabled="isFetching" />
                        <label for="add-replies">Add users who replied to the raffle</label>
                    </div>
                    <Message size="small" severity="secondary" variant="simple">
                        It will only gather replies to the root post, not replies of replies
                    </Message>
                    <Message 
                        v-if="$form.addReplies?.invalid" 
                        severity="error" 
                        size="small" 
                        variant="simple"
                    >
                        {{ $form.addReplies?.error.message }}
                    </Message>
                </div>

                <div class="flex flex-col gap-2 mt-3 mb-8">
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="addReposts" name="addReposts" inputId="add-reposts" binary :disabled="isFetching" />
                        <label for="add-reposts">Add users who reposted to the raffle</label>
                    </div>
                    <Message 
                        v-if="$form.addReposts?.invalid" 
                        severity="error" 
                        size="small" 
                        variant="simple"
                    >
                        {{ $form.addReposts?.error.message }}
                    </Message>
                </div>

                <div class="flex items-center gap-2 mb-8">
                    <Checkbox v-model="removeHost" inputId="remove-host" binary :disabled="isFetching" />
                    <label for="remove-host">Remove Host from the results</label>
                </div>

                <div class="flex items-center gap-2 mb-8">
                    <Checkbox v-model="mustBeAFollower" inputId="must-follow" binary :disabled="isFetching" />
                    <label for="must-follow">Users must be followers</label>
                </div>
                
                <div class="flex items-center gap-2 mb-8">
                    <Checkbox v-model="mustHaveReposted" inputId="must-reposted" binary :disabled="isFetching" />
                    <label for="must-reposted">Users must have reposted</label>
                </div>

                <div class="flex flex-col gap-2 mt-3 items-end">
                    <div class="flex justify-end gap-2">
                        <Button type="button" label="Cancel" severity="secondary" @click="visible = false" />
                        <Button type="submit" label="Add" :icon="isFetching ? 'pi pi-spin pi-spinner' : ''" :disabled="isFetching" />
                    </div>
                    <Message 
                        v-if="isFetching && (addReposts || mustBeAFollower || mustHaveReposted)" 
                        size="small" severity="secondary" variant="simple"
                    >
                        It may take a bit, please, be patient
                    </Message>
                </div>
            </Form>

        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGetBskyParticipants } from '@/composables/useGetBskyParticipants'
import { useToast } from "primevue/usetoast"

const toast = useToast()
const visible = defineModel({ required: true })
const emit = defineEmits(['addParticipants'])
const postURL = ref('')
const removeHost = ref(true)
const addReplies = ref(true)
const addReposts = ref(false)
const mustBeAFollower = ref(false)
const mustHaveReposted = ref(false)
const dialogInfo = ref()

const resolver = ({ values }) => {
    const errors = {}

    if (!values.postURL) {
        errors.postURL = [{ message: 'Post URL is required.' }]
    }

    if (!addReplies.value && !addReposts.value) {
        errors.addReplies = [{ message: 'At least one is required' }]
        errors.addReposts = [{ message: 'At least one is required' }]
    }

    return { values, errors }
}

const isFetching = ref(false)
const submit = async ({ valid }) => {
    if (valid) {
        try {
            isFetching.value = true
            const participants = await useGetBskyParticipants(postURL.value, { 
                removeHost: removeHost.value,
                addReplies: addReplies.value,
                addReposts: addReposts.value,
                mustBeAFollower: mustBeAFollower.value,
                mustHaveReposted: mustHaveReposted.value
            })
            emit('addParticipants', participants)
            visible.value = false
        } catch (error) {
            toast.add({ severity: 'error', summary: error.message, detail: 'Oups!', life: 5000 })
        } finally {
            isFetching.value = false
        }
    }
}
</script>