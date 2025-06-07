<template>
    <Dialog 
      v-model:visible="visible" 
      modal 
      @hide="onHideModal"
      :header="winners.length ? `So lucky!` : 'Raffle on progress...'" 
      class="min-w-[25rem]"
    >
      <div class="flex flex-col gap-5 items-center">

        <div 
          v-if="!winners.length"
          class="flex items-center justify-center gap-1 my-2"
        >
          <div>
            <Skeleton shape="circle" size="4rem" />
          </div>
          <div class="w-[100px]">
            <Skeleton height="1.7rem" borderRadius="16px" />
          </div>
        </div>
        <div 
          v-else
          class="flex flex-col gap-4 p-4 px-4 mt-5 mb-8 rounded-lg ring-2 ring-yellow-500/90 relative"
        >
          <div 
            v-for="winner in winners"
            class="flex gap-2 items-center"
          >
            <Avatar 
              size="xlarge" 
              shape="circle"
              :pt="{ image: { class: 'object-cover' } }"
              v-bind="{
                  image: winner.image || null,
                  icon: winner.image ? null : 'pi pi-user'
              }"
            />
            <span class="text-3xl">{{ winner.name }}</span>
          </div>
          <i class="pi pi-crown rounded-full p-2 bg-yellow-500 absolute top-[-.7rem] right-[-.7rem] text-black"></i>
        </div>

        <Button 
          v-if="!winners.length"
          label="Pick winner/s!"
          icon="pi pi-crown" 
          size="large" 
          @click="handleRaffle"
        />
        <Button 
          v-else
          label="Close"
          class="self-end mt-[-1rem]"
          text 
          @click="visible = false"
        />
      </div>
    </Dialog>
    
    <Button 
      label="Start raffle"
      icon="pi pi-play"
      class="max-w-[210px] w-full"
      size="large" 
      @click="handleRaffle"
      :disabled="!(participants.length > 1)"
    />
  
</template>

<script setup lang="ts">
import { RaffleUser } from '@/types/RaffleUser'
import { ref } from 'vue'

const visible = ref(false)
const winners = ref<RaffleUser[]>([])
const currentNumber = ref()
const { participants, numberOfWinners } = defineProps<{ participants: RaffleUser[], numberOfWinners: number }>()
const winnersList = defineModel('winnersList')
const displayWinnersList = defineModel('displayWinnersList')

const isRunning = ref(false)
let timeout = null

const addAsyncWinner = async (winner) => winnersList.value.push(winner)

const handleRaffle = async () => {
  if (isRunning.value) {
    clearTimeout(timeout)
    isRunning.value = false
    timeout = null

    for (let i = 0; i < numberOfWinners; i++) {
      const winner = participants[currentNumber.value]
      await addAsyncWinner(winner)
      winners.value.push(winner)
      roll() 
    }

  } else {
    winners.value = []
    isRunning.value = true
    visible.value = true
    roll()
  }
}

const roll = () => {
  const randomNumber = Math.floor(Math.random() * participants.length)
  currentNumber.value = randomNumber
  timeout = setTimeout(roll, 70)
}

const onHideModal = () => {
  clearTimeout(timeout)
  if (winners.value.length) {
    displayWinnersList.value = [...winnersList.value]
    winners.value = []
  }
}
</script>
