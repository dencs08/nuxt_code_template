<template>
    <div>
        <ConfirmationModal :question="'Are you sure you want to delete this item?'" />
        <div class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div class="relative">
                        <div v-if="loading" class="space-y-2">
                            <AnimatedPlaceholder class="w-full h-12 rounded" />
                            <AnimatedPlaceholder class="w-full h-12 rounded" />
                            <AnimatedPlaceholder class="w-full h-12 rounded" />
                        </div>
                        <div v-else-if="!loading && elements">
                            <table class="min-w-full table-fixed divide-y divide-gray-300 relative">
                                <thead>
                                    <tr>
                                        <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                                            <input type="checkbox"
                                                class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                                :checked="indeterminate || selectedElements.length === elements.length"
                                                :indeterminate="indeterminate"
                                                @change="selectedElements = $event.target.checked ? elements.map((e) => e.id) : []" />
                                        </th>
                                        <th v-for="column in columns" :key="column" scope="col"
                                            :class="['px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap transition-colors cursor-pointer', { 'text-primary-500': column === sortColumn }]"
                                            @click="sortColumn = column, order = !order">
                                            {{ column.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }}
                                            <span class="transition-opacity"
                                                :class="[column === sortColumn ? 'opacity-100' : 'opacity-0']">
                                                <Icon name="ic:round-arrow-drop-down"
                                                    class="w-auto h-6 m-0 transition-transform"
                                                    :class="[order ? 'rotate-180' : '']" />
                                            </span>
                                        </th>


                                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3">
                                            <p>
                                                <span class="sr-only">Edit</span>
                                                <span class="sr-only">Open</span>
                                            </p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white" v-auto-animate>
                                    <tr v-for="row in sortedElements" :key="row.id"
                                        :class="[selectedElements.includes(row.id) && 'bg-gray-50']"
                                        class="bg-white hover:bg-gray-100 cursor-pointer transition-colors duration-75"
                                        @click="toggleCheckbox(row.id)">
                                        <td class="relative px-7 sm:w-12 sm:px-6">
                                            <div v-if="selectedElements.includes(row.id)"
                                                class="absolute inset-y-0 left-0 w-0.5 bg-primary-500">
                                            </div>
                                            <input type="checkbox"
                                                class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                                :value="row.id" v-model="selectedElements" />
                                        </td>
                                        <td v-for="column in columns" :key="column"
                                            :class="['whitespace-nowrap truncate max-w-[200px] xl:max-w-[250px] px-3 py-4 text-sm', selectedElements.includes(row.id) ? 'font-medium text-indigo-600' : 'text-gray-500']">
                                            <input v-if="editableColumns?.includes(column) && row.isEditing.value"
                                                v-model="row[column]" type="text" @click.stop
                                                class="text-sm px-1 py-0 border border-primary-100 w-full" />
                                            <span v-else>{{ row[column] }}</span>

                                        </td>
                                        <td
                                            class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 space-x-3">
                                            <a href="#" v-if="props.editableColumns && props.editableColumns.length > 0"
                                                class="text-primary-500 hover:text-primary-900 transition-colors duration-150"
                                                @click.stop.prevent="editRow(row)">
                                                {{ row.isEditing.value ? 'Save' : 'Edit' }}
                                                <span class="sr-only">,
                                                    {{ row.id }}
                                                </span>
                                            </a>
                                            <button
                                                class="text-primary-500 hover:text-primary-900 transition-colors duration-150"
                                                @click.stop="performRowAction(row)">
                                                Open<span class="sr-only">, {{ row[props.navigationKey] }}</span>
                                            </button>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else-if="!loading && !elements" class="text-center text-gray-500">
                            Nothing here yet
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Select Actions -->
        <div class="mt-4">
            <div v-if="selectedElements.length > 0" class="flex h-12 items-center space-x-3 bg-white sm:left-12"
                @click="deleteSelected">
                <Button styling="light" size="xs" class="h-8">Delete selected</Button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
const props = defineProps({
    elements: Array,
    columns: Array,
    editableColumns: Array,
    defaultSortColumn: String,
    onOpenLink: String,
    navigationKey: {
        type: String,
        default: 'id',
    },
    loading: {
        type: Boolean,
        default: false,
    },

    rowAction: {
        type: String,
        default: 'redirect',
    },
    rowActionHandler: {
        type: Function,
        default: () => { },
    }
});
let elements = computed(() => props.elements.map(element => ({
    ...element,
    isEditing: ref(false),
})));


let sortColumn = ref(props.defaultSortColumn || 'id')
let order = ref(true) // true for ascending, false for descending
const selectedElements = ref([])
const checked = ref(false)
const indeterminate = computed(() => selectedElements.value.length > 0 && selectedElements.value.length < elements.length)

const sortedElements = computed(() => {
    return [...elements.value].sort((a, b) => {
        if (a[sortColumn.value] < b[sortColumn.value]) return order.value ? -1 : 1;
        if (a[sortColumn.value] > b[sortColumn.value]) return order.value ? 1 : -1;
        return 0;
    });
});

const toggleCheckbox = (id) => {
    const index = selectedElements.value.indexOf(id);
    if (index > -1) {
        selectedElements.value.splice(index, 1);
    } else {
        selectedElements.value.push(id);
    }
}

const editRow = (row) => {
    if (props.editableColumns && props.editableColumns.length > 0) {
        if (row.isEditing.value) {
            console.log('saved!');
        }
        row.isEditing.value = !row.isEditing.value;
    } else {
        console.warn('No editable columns available');
    }
}

const deleteSelected = () => {
    console.log(selectedElements.value);
}

const performRowAction = (row) => {
    switch (props.rowAction) {
        case 'redirect':
            // Perform redirect using Nuxt's router
            useRouter().push({ name: props.onOpenLink, params: { id: row[props.navigationKey] } });
            break;
        case 'custom':
            // Perform custom action
            props.rowActionHandler(row);
            break;
        // add other cases as necessary
    }
}
</script>