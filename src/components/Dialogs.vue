<template>
    <SocialsDialog 
      v-model="dialogs.openFADialog" 
      @addParticipants="addParticipants"
      social="furaffinity"
      headerTitle="Add from FurAffinity"
      inputLabel="Post or journal URL"
      inputPlaceholder="https://www.furaffinity.net/view/XXXXXXXX/"
    >
      <template #infoText>
        This component will analyze a FA post and gather all the users that left a comment there.
        If a user left more than one comment, it won't be repeated. It also accepts journal URLs
      </template>
      <template #inputMsg>
        URL to the FA raffle or journal post. 
        Host's profile must be public and post be General rated for this to work
      </template>
    </SocialsDialog>

    <SocialsDialog 
      v-model="dialogs.openBskyDialog" 
      @addParticipants="addParticipants"
      social="bsky"
      inputLabel="Post URL"
      headerTitle="Add from Bsky"
      inputPlaceholder="https://bsky.app/profile/my.user.handle/post/xxxxxxxxxxxxxx/"
    >
      <template #infoText>
        This component will analyze a Bsky post and gather all the users that left a comment at root level.
        If a user left more than one comment, it won't be repeated
      </template>
      <template #inputMsg>
        URL to the Bsky raffle post. 
        It will only gather replies to the root post, not replies of replies
      </template>
    </SocialsDialog>

    <JsonDialog v-model="dialogs.openJSONDialog" @addParticipants="addParticipants" />
    <ManualDialog v-model="dialogs.openManualDialog" @addParticipants="addParticipants" />
</template>

<script setup>
import SocialsDialog from '@/components/SocialsDialog.vue'
import ManualDialog from '@/components/ManualDialog.vue'
import JsonDialog from '@/components/JsonDialog.vue'

const dialogs = defineModel({ required: true })
const emit = defineEmits(['addParticipants'])

const addParticipants = (newParticipants) => emit('addParticipants', newParticipants)
</script>