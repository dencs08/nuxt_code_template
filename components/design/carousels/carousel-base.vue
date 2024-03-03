<template>
    <div>
        <div>
            <h3 class="text-center fw-semibold text-3xl mb-4">{{ props.header }}</h3>
            <div class="flex flex-col sm:flex-row gap-3 bg-gradient-to-r">
                <div v-for="el in props.elements" class="flex-1 min-w-[25vw] size-64">
                    <nuxt-img :src="el.img" class="h-full w-full object-cover" :ismap="false" decoding="auto" loading="lazy"
                        width="100%" height="100%" alt="Logo" quality="50" format="webp" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
//TODO how to make nuxt-img serve the image in lower resolution
const props = defineProps({
    header: {
        type: String,
        default: 'Base header',
    },
    elements: {
        type: Object,
        default: [{ img: `/img/placeholder.jpg` }]
    }
});
</script>
<style scoped lang="css">
.carousel-container {
    /* background-image:  */
}
</style>