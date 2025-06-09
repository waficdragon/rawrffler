<template>
    <div class="card flex justify-center">
        <Dialog v-model:visible="dialogs.openFADialog" modal class="max-w-[25rem] sm:mx-0 !mx-[5px]" @hide="postURL = ''">
            <template #header>
                <Button icon="pi pi-question" class="min-w-[40px]" rounded aria-label="Dialog Help" @click="e => dialogInfo.toggle(e)" />
                <Popover ref="dialogInfo" class="w-full max-w-[350px]">
                    This component will analyze a FA post and gather all the users that left a comment there.
                    If a user left more than one comment, it won't be repeated. It also accepts journal URLs.
                </Popover>
                <div class="text-lg text-center">Add from FurAffinity</div>
            </template>

            <Form v-slot="$form" :resolver validateOnSubmit @submit="submit">
                <div class="flex flex-col gap-2 mt-3 mb-6">
                    <label for="fa-post">Post or journal URL</label>
                    <InputText id="fa-post" v-model="postURL" 
                        name="postURL" aria-describedby="post-help" autoFocus 
                        placeholder="https://www.furaffinity.net/view/XXXXXXXX/"
                        type="text" :disabled="isFetching"
                    />
                    <Message size="small" id="post-help" severity="secondary" variant="simple">
                        URL to the FA raffle or journal post. 
                        Host's profile must be public and post be General rated for this to work
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

                <div class="flex items-center gap-2 mb-5">
                    <Checkbox v-model="removeHost" inputId="remove-host" binary :disabled="isFetching" />
                    <label for="remove-host">Remove Host from the results</label>
                </div>

                <div class="flex flex-wrap items-center mb-8 gap-2">
                    <Message size="small" id="post-help" severity="secondary" variant="simple">
                        Private profile or Mature/Adult post?
                    </Message>
                    <Button label="Click here" size="small" class="!p-0" variant="link" @click="dialogs.openFADialogAlt = true" />
                </div>

                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="dialogs.openFADialog = false" />
                    <Button type="submit" label="Add" :icon="isFetching ? 'pi pi-spin pi-spinner' : ''" :disabled="isFetching" />
                </div>
            </Form>

        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGetFAParticipants } from '@/composables/useGetFAParticipants'
import { useToast } from "primevue/usetoast"

const toast = useToast()
const dialogs = defineModel({ required: true })
const emit = defineEmits(['addParticipants'])
const postURL = ref('')
const removeHost = ref(true)
const dialogInfo = ref()

const resolver = ({ values }) => {
    const errors = {}

    if (!values.postURL) {
        errors.postURL = [{ message: 'Post URL is required.' }]
    }

    return { values, errors }
}

const isFetching = ref(false)
const submit = async ({ valid }) => {
    if (valid) {
        try {
            isFetching.value = true
            const participants = await useGetFAParticipants(postURL.value, { removeHost: removeHost.value })
            emit('addParticipants', participants)
            dialogs.value.openFADialog = false
        } catch (error) {
            toast.add({ severity: 'error', summary: error.message, detail: 'Oups!', life: 5000 })
        } finally {
            isFetching.value = false
        }
    }
}
</script>