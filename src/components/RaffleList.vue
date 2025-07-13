<template>
    <Panel :header="`Participants (${filteredParticipantsWithSearch.length}/${participants.length})`">
        <slot />
        <div class="flex flex-wrap gap-3">
            <Chip 
                v-for="participant in filteredParticipantsWithSearch"
                :key="participant.id"
                removable
                :label="participant.name"
                :pt="{ image: { class: 'object-cover' } }"
                v-bind="{
                    image: participant.image || null,
                    icon: !participant.image ? 'pi pi-user' : null
                }"
            >
                <template #removeicon>
                    <Button 
                        icon="pi pi-times" 
                        rounded 
                        severity="danger"
                        variant="text" 
                        size="small" 
                        @click="() => removeParticipant(participant.id)"
                    />
                </template>
            </Chip>
        </div>

        <template #icons>
            <Button 
                icon="pi pi-sync" 
                rounded 
                severity="secondary"
                v-tooltip.left="'Shuffle'"
                text 
                @click="shuffleParticipants" 
            />
            <Button 
                icon="pi pi-file-export"
                v-tooltip.bottom="'Export to JSON'"
                rounded
                :disabled="!participants.length"
                text 
                @click="exportToJSON" 
            />
            <Button 
                icon="pi pi-trash" 
                severity="danger"
                v-tooltip.bottom="'Clear participants'"
                rounded 
                text 
                @click="clearParticipants" 
            />
        </template>
    </Panel>
</template>

<script setup lang="ts">
import { RaffleUser } from '@/types/RaffleUser'

const participants = defineModel<RaffleUser[]>('participants')
const filteredParticipantsWithSearch = defineModel<RaffleUser[]>('filteredParticipantsWithSearch')

const emit = defineEmits(['participantRemoved'])

const removeParticipant = (id: string) => {
    participants.value = participants.value.filter(user => user.id !== id)
    emit('participantRemoved')
}

const shuffleParticipants = () => {
    if (!participants.value.length) return
    for (let i = participants.value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participants.value[i], participants.value[j]] = [participants.value[j], participants.value[i]]
    }
}

const clearParticipants = () => {
    participants.value = []
    RaffleUser.resetCounter()
}

const exportToJSON = () => {
    if (!participants.value.length) return

    const toJsonParticipants = participants.value.map(participant => ({
        name: participant.name,
        image: participant.image
    }))

    const serialized = JSON.stringify(toJsonParticipants, null, 2)
    const blob = new Blob([serialized], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "participants.json"
    a.click()
    URL.revokeObjectURL(url)
}

</script>