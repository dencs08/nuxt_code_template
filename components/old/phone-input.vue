<template>
    <div>
        <div class="flex gap-3">
            <div class="relative">
                <div class="bg-white h-full rounded-md border border-gray-300 w-24 px-3.5 py-2.5 cursor-pointer flex items-center gap-1"
                    ref="toggleButton" @click="toggleDropdown">
                    <img :src="selectedCountry.flag" class="h-3.5 w-auto border border-gray-200"
                        :alt="selectedCountry.code">
                    <p>{{ selectedCountry.callingCode }}</p>
                </div>
            </div>
            <InputCustom class="w-full" v-model="phoneNumber" type="phone" label="Phone Number" name="phone" required />
        </div>

        <div class="relative" v-auto-animate>
            <div v-if="dropdownVisible" ref="dropdown" @keydown="handleKeydown" tabindex="0"
                class="absolute bg-white border p-2 mt-1 h-72 overflow-auto w-72 z-50 rounded-lg">
                <div v-for="country in countryData" :key="country.code" @click="selectCountry(country)"
                    :data-country-code="country.code" class="cursor-pointer p-1 flex gap-2 items-center">
                    <img :src="country.flag" class="h-3.5 w-auto border border-gray-200" :alt="country.code" />
                    <p>{{ country.fullName }} ({{
                        country.callingCode
                    }})</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';

const props = defineProps({
    modelValue: String,
});

const toggleButton = ref(null);
// const phoneNumber = ref(null);
const dropdownVisible = ref(false);
const dropdown = ref(null);
const selectedCountry = ref({ code: 'US', callingCode: '+1', flag: '/img/flags/US.svg', name: 'United States' });

const emit = defineEmits(['update:modelValue']);
const phoneNumber = computed({
    get: () => combinedValue.value.phoneNumber,
    set: (value) => {
        combinedValue.value.phoneNumber = value;
        emit('update:modelValue', combinedValue.value.callingCode + combinedValue.value.phoneNumber);
    },
});

const combinedValue = ref({
    callingCode: selectedCountry.value.callingCode,
    phoneNumber: ''
});

const countries = getCountries();
const countryData = [];
(async () => {
    for (const countryCode of countries) {
        try {
            const callingCode = getCountryCallingCode(countryCode);
            const flagPath = `/img/flags/${countryCode.toUpperCase()}.svg`;
            const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(
                countryCode
            );

            countryData.push({
                code: countryCode,
                callingCode: '+' + callingCode,
                flag: flagPath,
                fullName: countryName,
            });
        } catch (error) {
            console.error(`Error importing flag for ${countryCode}:`, error);
        }
    }
})();

onClickOutside(
    dropdown,
    (event) => {
        // Check if the clicked element is the toggle button or a child of the toggle button
        if (toggleButton.value.contains(event.target)) {
            return;
        }
        toggleDropdown();
    },
    { enabled: dropdownVisible } // Only enable onClickOutside when the dropdown is visible
);

async function toggleDropdown() {
    dropdownVisible.value = !dropdownVisible.value;

    if (dropdownVisible.value) {
        await nextTick();
        // Set focus to the dropdown when it becomes visible
        dropdown.value.focus();
    }
}

function selectCountry(country) {
    selectedCountry.value = country;
    combinedValue.value.callingCode = country.callingCode;
    dropdownVisible.value = false;
    emit('update:modelValue', combinedValue.value.callingCode + combinedValue.value.phoneNumber);
}

const typedString = ref('');
const debounceDelay = 1500;
let debounceTimeout;
async function handleKeydown(event) {
    clearTimeout(debounceTimeout);

    const pressedKey = event.key.toUpperCase();
    if (event.key.length === 1 && /[A-Za-z]/.test(pressedKey)) {
        typedString.value += pressedKey;
        const countryIndex = countryData.findIndex((country) =>
            [country.code, country.fullName].some((val) =>
                val.toUpperCase().startsWith(typedString.value)
            )
        );
        if (countryIndex !== -1) {
            // Scroll the dropdown to the found country
            constcountryElement = dropdown.value.querySelector(
                `[data-country-code="${countryData[countryIndex].code}"]`
            );
            countryElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    debounceTimeout = setTimeout(() => {
        typedString.value = '';
    }, debounceDelay);
}
</script>
