<template>
  <footer class="my-[1rem]">
    <divider />
    <div class="flex flex-col sm:flex-row sm:items-center gap-2 items-start justify-between w-10/10 md:w-9/10 lg:w-8/10 2xl:w-7/10 mx-auto">
        <div>
            <Button as="a" icon="pi pi-home" label="waficdragon.com" variant="link" href="https://waficdragon.com" />
        </div>

        <div class="flex items-center gap-2 ml-3 flex-wrap">
            <span class="pi pi-link primary" style="color: var(--p-primary-color)" />
            <Button 
                as="a" label="FurAffinity"
                severity="secondary"
                size="small"
                href="https://www.furaffinity.net/user/waficdragon" 
                target="_blank" rel="noopener" 
            />
            <Button 
                as="a" label="BlueSky"
                severity="secondary"
                size="small"
                href="https://bsky.app/profile/waficdragon.bsky.social" 
                target="_blank" rel="noopener" 
            />
            <Button 
                as="a" label="Twitter"
                severity="secondary"
                size="small"
                href="https://x.com/waficdragon" 
                target="_blank" rel="noopener" 
            />
        </div>
    </div>
  </footer>
</template>