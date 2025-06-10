<template>
    <div class="flex flex-col sm:flex-row items-start sm:items-end gap-6 justify-between mb-3">
        <SplitButton 
            label="Add participants" 
            icon="pi pi-user-plus"
            @click="dialogs.openManualDialog = true" 
            :model="addParticipantsItems" 
        />
        <div class="flex flex-col gap-1">
            <FloatLabel variant="on">
                <InputNumber 
                    v-model="numberOfWinners" 
                    :allowEmpty="false"
                    inputClass="max-w-[130px] w-full"
                    :min="1"
                    :max="maxWinners"
                    buttonLayout="horizontal" 
                    showButtons
                >
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </InputNumber>
                <label>Number of winners</label>
            </FloatLabel>
            <slot />
        </div>
    </div>
</template>

<script setup>
import { watch, computed } from 'vue'
const dialogs = defineModel('dialogs')
const numberOfWinners = defineModel('numberOfWinners')
const { participants, displayWinnersList }  = defineProps(['participants', 'displayWinnersList'])

const maxWinners = computed(() => participants.length < 1 ? 1 : participants.length -1)

watch(() => displayWinnersList, () => {
    if (participants.length && (participants.length < numberOfWinners.value)) {
        numberOfWinners.value = maxWinners.value || 1
    }
})

const addParticipantsItems = [
    {
        label: 'Manually',
        icon: 'pi pi-pencil',
        command: () => dialogs.value.openManualDialog = true
    },
    {
      separator: true  
    },
    {
        label: 'From FurAffinity',
        icon: 'pi pi-comments',
        command: () => dialogs.value.openFADialog = true
    },
    {
        label: 'From BlueSky',
        icon: 'pi pi-comments',
        command: () => dialogs.value.openBskyDialog = true
    },
    {
        separator: true
    },
    {
        label: 'From JSON file',
        icon: 'pi pi-file-import',
        command: () => dialogs.value.openJSONDialog = true
    }
]


</script>