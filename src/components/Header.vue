<template>
  <header class="mb-[1rem] sm:mb-[3rem]">
    <div class="flex flex-col sm:flex-row sm:items-center items-start justify-between w-10/10 md:w-9/10 lg:w-8/10 2xl:w-7/10 mx-auto">
      <div class="text-xl m-3">
        Rawrffler!
      </div>

      <div class="flex items-center gap-2 sm:mb-0 mb-3 ml-3">
        <Button 
            as="a"
            target="_blank"
            size="small"
            label="Star"
            severity="secondary"
            href="https://github.com/waficdragon/rawrffler"
            icon="pi pi-github"
        />

        <Button 
            icon="pi pi-info-circle"
            size="small"
            severity="secondary"
            @click="e => issuesMenu.toggle(e)"
        />
        <Popover ref="issuesMenu" class="w-full max-w-[350px]">
            Had any suggestions / Found any bugs? Feel free to either 
            <Button 
                type="link" 
                variant="text" 
                icon="pi pi-pen-to-square" 
                as="a" 
                label="open an issue" 
                target="_blank" 
                href="https://github.com/waficdragon/rawrffler/issues" 
            /> 
            or send me a DM to my socials
        </Popover>

        <Button 
            icon="pi pi-palette"
            size="small"
            severity="secondary"
            @click="e => themeColorsMenu.toggle(e)"
        />
        <Popover ref="themeColorsMenu" class="w-full max-w-[270px] h-[100px]">
            <div class="grid grid-cols-8 gap-2">
                <Button 
                    v-for="color in colors"
                    class="!p-0 !w-[20px] !h-[20px] !border-none"
                    rounded
                    :pt="{ icon: { class: '!text-xs' } }"
                    :icon="`${color === themeColor ? 'pi pi-check' : ''}`"
                    @click="() => changePrimaryColor(color)"
                    :style="`background-color: var(--p-${color}-500)`" 
                />
            </div>
        </Popover>
        
        <Button
            @click="switchThemeMode"
            severity="secondary" 
            aria-label="Toggle dark mode"
            size="small"
            :icon="`${isDarkMode ? 'pi pi-moon' : 'pi pi-sun'}`"
        />
      </div>
    </div>
    <divider class="!mt-0" />
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { updatePrimaryPalette } from '@primeuix/themes'

const themeColorsMenu = ref()
const issuesMenu = ref()
const isDarkMode = ref(false)

const colors = ["emerald", "green", "lime", "red", "orange", "amber", "yellow", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "slate", "gray", "zinc", "neutral", "stone"]
const themeColor = ref(colors[0])

const switchThemeMode = () => {
    if (isDarkMode.value) {
        document.documentElement.classList.remove('dark-mode')
        isDarkMode.value = false
        localStorage.setItem('themePrefs:mode', 'light')
    } else {
        document.documentElement.classList.add('dark-mode')
        isDarkMode.value = true
        localStorage.setItem('themePrefs:mode', 'dark')
    }
}

const changePrimaryColor = (color) => {
    updatePrimaryPalette({
        50: `{${color}.50}`,
        100: `{${color}.100}`,
        200: `{${color}.200}`,
        300: `{${color}.300}`,
        400: `{${color}.400}`,
        500: `{${color}.500}`,
        600: `{${color}.600}`,
        700: `{${color}.700}`,
        800: `{${color}.800}`,
        900: `{${color}.900}`,
        950: `{${color}.950}`
    })
    themeColor.value = color
    localStorage.setItem('themePrefs:color', color)
}

onMounted(() => {
    const themePrefsMode = localStorage.getItem('themePrefs:mode')
    const themePrefsColor = localStorage.getItem('themePrefs:color')

    if (themePrefsMode) {
        if (themePrefsMode === 'dark') {
            document.documentElement.classList.add('dark-mode')
            isDarkMode.value = true
        }
    } else {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDarkMode) {
            document.documentElement.classList.add('dark-mode')
            isDarkMode.value = true
        }
    }

    if (themePrefsColor) {
        changePrimaryColor(themePrefsColor)
    }
})
</script>