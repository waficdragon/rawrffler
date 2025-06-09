<template>
    <Panel toggleable :header="`Winners (${displayWinnersList.length})`">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
                v-for="winner in displayWinnersList"
                :key="winner.id"            
                class="flex flex-wrap gap-2 items-center w-full"
            >
                <Avatar 
                    size="xlarge" 
                    shape="circle"
                    class="aspect-square"
                    :pt="{ image: { class: 'object-cover' } }"
                    v-bind="{
                        image: winner.image || null,
                        icon: winner.image ? null : 'pi pi-user'
                    }"
                />
                <span class="text-xl wrap-break-word max-w-[40dvw]">{{ winner.name }}</span>
                <Button 
                    icon="pi pi-times" 
                    rounded 
                    severity="danger" 
                    variant="text" 
                    size="small" 
                    @click="() => removeWinner(winner.id)"
                />
            </div>
        </div>

        <template #icons>
            <Button 
                icon="pi pi-trash" 
                severity="danger"
                v-tooltip.left="'Clear winners'"
                rounded 
                text 
                @click="clearWinners" 
            />
        </template>
    </Panel>
</template>

<script setup lang="ts">
import { RaffleUser } from '@/types/RaffleUser'

const winnersList = defineModel<RaffleUser[]>('winnersList')
const displayWinnersList = defineModel<RaffleUser[]>('displayWinnersList')

const removeWinner = (id: string) => {
  winnersList.value = winnersList.value.filter(user => user.id !== id)
  displayWinnersList.value = displayWinnersList.value.filter(user => user.id !== id)
}

const clearWinners = () => {
  winnersList.value = []
  displayWinnersList.value = []
}
</script>