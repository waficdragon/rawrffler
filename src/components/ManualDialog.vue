<template>
    <div class="card flex justify-center">
        <Dialog v-model:visible="visible" modal class="w-full max-w-[25rem] sm:mx-0 mx-[5px]" @hide="restoreFields">
            <template #header>
                <div class="text-lg">Add manually</div>
            </template>

            <Form v-slot="$form" :resolver @submit="submit" validateOnSubmit>

                <div class="flex items-start gap-3 mb-8 relative">
                    <div class="flex flex-col gap-3 mt-1">
                        <ManualUserFields 
                            v-for="(field, indexField) in addedFields"
                            :field
                            :indexField
                            v-model="addedFields"
                            @updateField:name="name => field.name = name"
                            @updateField:image="image => field.image = image"
                        >
                            <template #message>
                                <Message 
                                    v-if="$form[`name-${field.id}`]?.invalid" 
                                    severity="error" 
                                    size="small" 
                                    variant="simple"
                                >
                                    {{ $form[`name-${field.id}`]?.error.message }}
                                </Message>
                            </template>
                        </ManualUserFields>
                    </div>
                    <Button 
                        icon="pi pi-plus" 
                        aria-label="Add participant manually" 
                        class="sm:mt-[3px] shrink-0 mt-[9px] !w-[30px] !h-[30px] sm:!w-[40px] sm:!h-[40px] sm:!absolute sm:right-12" 
                        rounded @click="addField" 
                    />
                </div>

                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false" />
                    <Button type="submit" label="Add" />
                </div>
            </Form>

        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ManualUserFields from './ManualUserFields.vue'
import { RaffleUser } from '@/types/RaffleUser'

const visible = defineModel({ required: true })
const emit = defineEmits(['addParticipants'])

const addedFields = ref([new RaffleUser()])
const restoreFields = () => {
    addedFields.value = [new RaffleUser()]
}
const addField = () => {
    addedFields.value.push(new RaffleUser())
}

const resolver = ({ values }) => {
    const errors = {}

    Object.entries(values).forEach(([key, value]) => {
        if (!value) {
            errors[key] = [{ message: 'Name is required.' }]
        }
    })

    return { values, errors }
}

const submit = ({ valid }) => {
    if (valid) {
        emit('addParticipants', addedFields.value)
        visible.value = false
    }
}
</script>