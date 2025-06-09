<template>
    <div class="card flex justify-center">
        <Dialog v-model:visible="visible" modal class="w-[30rem] sm:mx-0 mx-[5px]" @hide="toAddParticipants = []">
            <template #header>
                <div class="text-lg">Add from JSON File</div>
            </template>

            <Form @submit="submit">

                <div class="card flex items-center gap-6 mb-5">
                    <FileUpload 
                        mode="basic" 
                        @select="onFileSelect" 
                        customUpload 
                        name="json"
                        auto 
                        accept=".json,application/JSON"
                        chooseIcon="pi pi-file-import" 
                    />
                    <Message 
                        v-if="isTouched && !isValidJSON" 
                        severity="error" 
                        size="small" 
                        variant="simple"
                    >
                        Invalid JSON format
                    </Message>
                    <div v-else-if="isTouched && isValidJSON">+{{ toAddParticipants.length }} participants</div>
                </div>

            <Accordion class="mb-7">
                <AccordionPanel class="!border-[1px] rounded" value="0">
                    <AccordionHeader>JSON Example</AccordionHeader>
                    <AccordionContent>
                        <pre class="white-space-pre overflow-x-auto max-w-[70dvw] sm:max-w-[30rem]">
[
    {
        "name": "Participant 1",
        "image": "https://my.image/avatar.png"
    },
    {
        "name": "Participant 2",
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAusB9s7rP9wAAAAASUVORK5CYII=
    },
    {
        "name": "Participant 3"
    }
]
                        </pre>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>

                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false" />
                    <Button type="submit" label="Add" :disabled="!isValidJSON || !toAddParticipants.length" />
                </div>
            </Form>

        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RaffleUser } from '@/types/RaffleUser'

const visible = defineModel({ required: true })
const emit = defineEmits(['addParticipants'])
const toAddParticipants = ref([])
const isTouched = computed(() => toAddParticipants.value.toString().length > 2)

function onFileSelect(event) {
    const file = event.files[0]
    const reader = new FileReader()

    reader.onload = async (e) => {
        toAddParticipants.value = JSON.parse(e.target.result)
        validateJSON(toAddParticipants.value)
    }
    
    reader.readAsText(file)
}

const isValidJSON = ref(false)
const validateJSON = (json) => {
    if (!Array.isArray(json)) {
        isValidJSON.value = false
        return
    }

    for (let item of json) {
        if (typeof item !== 'object' || !item) {
            isValidJSON.value = false
            return
        }

        if (!('name' in item) || 
            (typeof item.name !== 'string' && typeof item.name !== 'number')) {
            isValidJSON.value = false
            return
        }

        if ('image' in item && typeof item.image !== 'string') {
            isValidJSON.value = false
            return
        }
    }

    isValidJSON.value = true
    toAddParticipants.value = json.map(user => new RaffleUser(user.name, user.image))
}

const submit = () => {
    if (isValidJSON.value) {
        emit('addParticipants', toAddParticipants.value)
        visible.value = false
    }
}
</script>