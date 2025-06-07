<template>
    <div class="card flex justify-center">
        <Dialog v-model:visible="visible" modal class="max-w-[25rem] sm:mx-0 !mx-[5px]" @hide="postURL = ''">
            <template #header>
                <Button icon="pi pi-question" rounded aria-label="Dialog Help" @click="e => dialogInfo.toggle(e)" />
                <Popover ref="dialogInfo" class="w-full max-w-[350px]">
                    <slot name="infoText" />
                </Popover>
                <div class="text-lg">{{ headerTitle }}</div>
            </template>

            <Form v-slot="$form" :resolver validateOnSubmit @submit="submit">
                <div class="flex flex-col gap-2 mt-3 mb-8">
                    <label for="socials-post">{{ inputLabel }}</label>
                    <InputText id="socials-post" v-model="postURL" name="postURL" aria-describedby="post-help" autoFocus :placeholder="inputPlaceholder" />
                    <Message size="small" severity="secondary" variant="simple">
                        <slot name="inputMsg" />
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

                <div class="flex items-center gap-2 mb-8">
                    <Checkbox v-model="removeHost" inputId="remove-host" binary />
                    <label for="remove-host">Remove Host from the results</label>
                </div>

                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false" />
                    <Button type="submit" label="Add" :icon="isFetching ? 'pi pi-spin pi-spinner' : ''" :disabled="isFetching" />
                </div>
            </Form>

        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGetFAParticipants } from '@/composables/useGetFAParticipants'
import { useGetBskyParticipants } from '@/composables/useGetBskyParticipants'
import { useToast } from "primevue/usetoast"

const toast = useToast()
const visible = defineModel({ required: true })
const { social, headerTitle, inputLabel, inputPlaceholder } = defineProps(['social', 'headerTitle', 'inputLabel', 'inputPlaceholder'])
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
const socials = {
    furaffinity: useGetFAParticipants,
    bsky: useGetBskyParticipants
}
const submit = async ({ valid }) => {
    if (valid) {
        try {
            isFetching.value = true
            const participants = await socials[social](postURL.value, { removeHost: removeHost.value })
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