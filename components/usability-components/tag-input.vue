<template>
    <div class="relative">
        <label :for="name"
            class="text-sm duration-300 transform truncate -translate-y-3.5 top-[0.8rem] z-10 origin-[0] left-3.5 pointer-events-none">
            {{ hasError ? props.hint : label }}
            <span v-if="required && !hasError">*</span>
            <span class="text-xs text-gray-500">(press enter to add)</span>
        </label>
        <div class="relative flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg py-2">
            <TransitionGroup name="fade">
                <div v-for="(tag, index) in tags" :key="index"
                    class="bg-primary-500 rounded-full px-3 mx-0.5 cursor-pointer" @click="removeTag(index)">
                    <div class="flex items-center gap-0.5 text-gray-100 h-7 truncate">
                        <div v-if="props.rating" class="flex">
                            <StarRating v-model="tag.rating" :modelValue="rating" interactive />
                        </div>
                        <span>{{ tag.name }}</span>
                        <Icon name="ic:round-close" class="h-1/2 w-1/2 text-gray-200 mt-0.5" />
                    </div>
                </div>

                <input key="input" type="text" :name="name" :id="name" v-model="newTag"
                    class="flex-grow block rounded-xl text-md border-0 focus:outline-none focus:ring-0 appearance-none py-0"
                    @keyup.enter="addTag" @keydown.enter.prevent placeholder=" "
                    :required="required && tags.length === 0" />
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: String,
    type: String,
    name: String,
    required: Boolean,
    modelValue: Array,
    icon: String,
    error: {
        type: Boolean,
        default: false,
    },
    hint: {
        type: String,
        default: 'Error: Input is not valid.',
    },
    rating: {
        type: Boolean,
        default: false,
    }
});
const hasError = ref(props.error);

const tags = ref([])
const newTag = ref('')
const rating = ref(1);

const addTag = () => {
    if (newTag.value.trim() !== '') {
        tags.value.push({ name: newTag.value, rating: rating.value })
        newTag.value = ''
        emit('update:modelValue', tags.value)
    }
}

const removeTag = (index) => {
    tags.value.splice(index, 1)
    emit('update:modelValue', tags.value)
}

const emit = defineEmits(['update:modelValue', 'update:rating']);

watch(rating, (newRating) => {
    console.log(tags.value);
    if (tags.value.length > 0) {
        tags.value[tags.value.length - 1].rating = newRating;
        emit('update:modelValue', tags.value);
    }
});

onMounted(() => {
    tags.value = props.modelValue.map(item => ({
        name: item.name,
        rating: item.rating ? item.rating : 1
    }));
});
</script>
