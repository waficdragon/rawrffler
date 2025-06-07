<template>
    <div class="flex items-top gap-2">
        <Avatar
            tabindex="0"
            size="large" 
            shape="circle"
            class="cursor-pointer mt-[-2px]"
            :pt="{ image: { class: 'object-cover' } }"
            v-bind="{ 
                image: image.trim() || null, 
                icon: image.trim() ? null : 'pi pi-image' 
            }"
            @click="e => imageMenu.toggle(e)"
            @keydown.space="e => imageMenu.toggle(e)"
            @keydown.enter="e => imageMenu.toggle(e)"
        />
        <Popover ref="imageMenu" class="w-100 max-w-[370px]">
            <div class="flex items-center gap-1">
                <IconField>
                    <InputIcon class="pi pi-link" />
                    <InputText v-model="image" placeholder="Image link or base64" size="small" autofocus @keydown.escape="closeImageMenu" />
                </IconField>
                <span class="opacity-50">-or-</span>
                <FileUpload
                    mode="basic" 
                    @select="onFileSelect"
                    @keydown.escape="closeImageMenu"
                    customUpload
                    :chooseButtonProps="{ size: 'small' }"
                    auto
                    accept="image/*"
                />
            </div>
        </Popover>
        <div class="position-relative">
            <InputText 
                ref="nameInput"
                class="mt-[0px] w-full"
                :name="`name-${field.id}`" 
                @input="e => emit('updateField:name', e.target.value)" 
                placeholder="My awesome OC name" 
            />
            <slot name="message" />
        </div>
        <Button 
            v-if="indexField !== 0" 
            icon="pi pi-minus" size="small" 
            text rounded
            severity="danger"
            aria-label="Remove participant"
            class="mt-[6px]"
            @click="removeField"  
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const { field, indexField } = defineProps({ field: Object, indexField: Number })
const emit = defineEmits(['updateField:name', 'updateField:image'])

const addedFields = defineModel()
const removeField = () => addedFields.value = addedFields.value.filter((x, index) => index !== indexField)

const image = ref("")

const nameInput = ref()
const imageMenu = ref()
function closeImageMenu(event) {
    event.stopPropagation()
    imageMenu.value.hide(event)
    nameInput.value.$el.focus()
}

function onFileSelect(event) {
    const file = event.files[0]
    const img = new Image()
    const reader = new FileReader()

    reader.onload = async (e) => {
        img.src = e.target.result
    }

    img.onload = () => {
        image.value = resizeImg(file, img)
        emit('updateField:image', image.value)
    }

    reader.readAsDataURL(file)
    imageMenu.value.toggle(event)
}

function resizeImg(file, img) {
    const MAX_WIDTH = 300
    const MAX_HEIGHT = 300

    let width = img.width
    let height = img.height

    if (width > height && width > MAX_WIDTH) {
      height *= MAX_WIDTH / width
      width = MAX_WIDTH
    } else if (height > MAX_HEIGHT) {
      width *= MAX_HEIGHT / height
      height = MAX_HEIGHT
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)

    const image = canvas.toDataURL(file.type)
    canvas.remove()
    return image
}
</script>