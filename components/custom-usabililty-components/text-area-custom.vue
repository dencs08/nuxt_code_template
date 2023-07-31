<template>
    <div class="relative">
        <div ref="wrapperRef" class="textarea-wrapper">
            <textarea ref="textareaRef" :name="name" :id="name" v-model="value" @input="resizeTextarea"
                class="block pb-1 pt-4 w-full text-md text-gray-900 bg-white border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-500 peer transition-colors duration-300 resize-none"
                :class="[borderStyle === 'full' ? 'border rounded-lg px-3.5' : 'border-0 border-b px-2']" placeholder=" "
                :maxlength="maxLength" :aria-describedby="name + '-optional'" :required="required" :rows="rows || 2" />
            <label v-if="borderStyle === 'full'" :for="name"
                class="absolute text-sm text-gray-500 duration-300 transform truncate -translate-y-3.5 scale-75 top-[0.8rem] z-10 origin-[0] left-3.5 peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 pointer-events-none">
                <span>{{ label }} </span>
                <span v-if="required"> *</span>
            </label>
            <div class="absolute top-1 right-2 lg:right-4 text-gray-500 text-xs">
                {{ value?.length }} / {{ maxLength }}chars
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    label: String,
    name: String,
    required: Boolean,
    modelValue: String,
    rows: Number,
    maxLength: {
        type: Number,
        default: 250,
    },
    borderStyle: {
        type: String,
        default: 'full',
    },
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const resizeTextarea = () => {
    if (textareaRef.value && wrapperRef.value) {
        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
        wrapperRef.value.style.height = textareaRef.value.style.height;
    }
};

</script>

<style>
textarea {
    overflow: hidden;
    resize: none;
}

.textarea-wrapper {
    transition: height 0.2s ease-out;
}
</style>
