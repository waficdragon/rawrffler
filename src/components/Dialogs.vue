<template>
    <FADialog
      v-model="dialogs.openFADialog" 
      @addParticipants="addParticipants"
    />

    <BskyDialog 
      v-model="dialogs.openBskyDialog" 
      @addParticipants="addParticipants"
    />

    <JsonDialog v-model="dialogs.openJSONDialog" @addParticipants="addParticipants" />
    <ManualDialog v-model="dialogs.openManualDialog" @addParticipants="addParticipants" />
</template>

<script setup>
import FADialog from '@/components/FADialog.vue'
import BskyDialog from '@/components/BskyDialog.vue'
import ManualDialog from '@/components/ManualDialog.vue'
import JsonDialog from '@/components/JsonDialog.vue'

const dialogs = defineModel({ required: true })
const emit = defineEmits(['addParticipants'])

const addParticipants = (newParticipants) => emit('addParticipants', newParticipants)
</script>