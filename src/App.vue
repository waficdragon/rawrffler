<template>

  <Toast />

  <Header />

  <main class="w-10/10 md:w-9/10 lg:w-8/10 2xl:w-7/10 mx-auto px-[5px]">

    <Dialogs 
      v-model="dialogs"
      @addParticipants="addParticipants"
    />

    <RafflePanel 
      :participants="filteredParticipants"
      :displayWinnersList
      v-model:dialogs="dialogs" 
      v-model:numberOfWinners="numberOfWinners"
    >    
      <RaffleDriver 
        :participants="filteredParticipants"
        :numberOfWinners
        v-model:winnersList="winnersList"
        v-model:displayWinnersList="displayWinnersList"
      />
    </RafflePanel>

    <RaffleWinners
      v-if="winnersList.length"
      v-model:winnersList="winnersList"
      v-model:displayWinnersList="displayWinnersList"
      class="mb-5"
    />

    <RaffleList 
      v-model:participants="participants"
      v-model:filteredParticipantsWithSearch="filteredParticipantsWithSearch"
      @participantRemoved="onParticipantRemoved"
    > 
      <IconField v-if="participants.length" class="mb-5">
        <InputIcon class="pi pi-search" />
        <InputText v-model="search" size="small" placeholder="Filter participants" />
      </IconField>
    </RaffleList>

  </main>

  <Footer />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import RafflePanel from '@/components/RafflePanel.vue'
import RaffleList from '@/components/RaffleList.vue'
import Dialogs from '@/components/Dialogs.vue'
import RaffleDriver from '@/components/RaffleDriver.vue'
import { RaffleUser } from '@/types/RaffleUser'
import RaffleWinners from '@/components/RaffleWinners.vue'

const participants = ref<RaffleUser[]>([])
const winnersList = ref<RaffleUser[]>([])
const displayWinnersList = ref<RaffleUser[]>([])
const numberOfWinners = ref(1)
const search = ref('')

const dialogs = ref({
  openFADialog: false,
  openFADialogAlt: false,
  openBskyDialog: false,
  openManualDialog: false,
  openJSONDialog: false
})

const normalizeString = (str: string) => str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
const filteredParticipants = computed(() => participants.value.filter(
  user => !winnersList.value.find(winner => winner.id === user.id)
))
const filteredParticipantsWithSearch = computed(() => filteredParticipants.value.filter(
  user => normalizeString(user.name).includes(normalizeString(search.value))
))
const addParticipants = (newParticipants: RaffleUser[]) => {
  participants.value.unshift(...newParticipants)
}
const onParticipantRemoved = () => {
    if (numberOfWinners.value >= filteredParticipants.value.length) {
        numberOfWinners.value = Math.max(1, filteredParticipants.value.length - 1)
    }
}
</script>