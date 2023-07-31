<template>
    <div class="relative">
        <div class="flex items-center bg-white h-full rounded-md border border-gray-300 px-3.5 py-2.5 cursor-pointer overflow-hidden"
            ref="toggleButton" @click="toggleDropdown">
            <span class="text-gray-500 text-sm mr-1 flex-shrink-0">{{ label }}</span>
            <input class="text-sm focus:outline-none focus:ring-0 cursor-pointer overflow-hidden flex-grow"
                :value="selectedElement?.name" readonly />
        </div>
    </div>
    <div class="relative" v-auto-animate>
        <div v-if="dropdownVisible" ref="dropdown" @keydown="handleKeydown" tabindex="0"
            class="absolute right-0 bg-white border p-2 mt-1 h-auto max-h-64 overflow-auto w-auto max-w-2xl min-w-full z-50 rounded-lg">
            <div v-for="element in arrayData" :key="element.name" @click="selectElement(element)"
                :data-element-name="element.name" class="cursor-pointer p-1 flex gap-2 items-center">
                <p class="text-sm">
                    {{ element.name }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    choices: Array,
    modelValue: [String, Number],
    label: {
        type: String,
        default: "Choice"
    },
    returnField: {
        type: String,
        default: 'name'
    }
});


const toggleButton = ref(null);
const dropdownVisible = ref(false);
const dropdown = ref(null);
const arrayData = props.choices;

const emit = defineEmits(['update:modelValue']);
let selectedElement = ref(props.choices.find(choice => choice[props.returnField] === props.modelValue));

const value = computed({
    get: () => selectedElement.value[props.returnField],
    set: (val) => {
        selectedElement.value = props.choices.find(choice => choice[props.returnField] === val);
        emit('update:modelValue', selectedElement.value[props.returnField]);
    },
});

onClickOutside(
    dropdown,
    (event) => {
        if (toggleButton.value.contains(event.target)) {
            return;
        }
        toggleDropdown();
    },
    { enabled: dropdownVisible }
);

async function toggleDropdown() {
    dropdownVisible.value = !dropdownVisible.value;

    if (dropdownVisible.value) {
        await nextTick();
        dropdown.value.focus();
    }
}

watchEffect(() => {
    let selected = props.choices.find(choice => choice[props.returnField] === props.modelValue);
    if (selected) selectedElement.value = selected;
});

function selectElement(element) {
    selectedElement.value = element;
    value.value = element[props.returnField];
    dropdownVisible.value = false;
}
</script>