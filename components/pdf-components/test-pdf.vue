<template>
    <div>
        <div ref="pdfSection">
            <!-- TODO test if it works with inline css? -->
            Thanks for testing out nuxt-pdf!
        </div>
        <button @click="exportToPDF('my-pdf-file.pdf', pdfSection)">
            print card
        </button>
    </div>
</template>

<script setup lang="ts">
import { exportToPDF } from '#imports'
const pdfSection = ref<HTMLElement | null>(null)
const DOCUMENT_OPTIONS = {} // See all options: http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html
const HTML_OPTIONS = {} // See all options: http://raw.githack.com/MrRio/jsPDF/master/docs/module-html.html#~html
// await exportToPDF('FILE_NAME.pdf', pdfSection, DOCUMENT_OPTIONS, HTML_OPTIONS)
</script>

<style lang="scss"></style>