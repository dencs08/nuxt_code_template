<template>
    <FileUpload :mode="mode" :name="name" customUpload @uploader="handleUploadPlaceholder" :accept="accept"
        :maxFileSize="maxFileSize" :auto="auto" :chooseLabel="chooseLabel" :pt="pt" />
</template>

<script setup lang="ts">
const props = defineProps({
    mode: {
        type: String as () => "basic" | "advanced",
        default: "basic"
    },
    name: {
        type: String,
        default: 'file'
    },
    accept: {
        type: String,
        default: 'image/*'
    },
    maxFileSize: {
        type: Number,
        default: 1000000 // 1MB
    },
    auto: {
        type: Boolean,
        default: true
    },
    chooseLabel: {
        type: String,
        default: 'Upload File'
    },
    pt: {
        type: Object,
        default: () => ({
            label: { class: 'text-sm font-medium font-body' },
            chooseButton: { class: 'flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-surface-0 font-bold py-1.5 px-3 rounded cursor-pointer transition border-0 shadow-sm ring-1 ring-inset dark:ring-surface-0/25 ring-surface-0/40 focus:ring-2 focus:ring-inset focus:ring-surface-300 sm:text-sm sm:leading-6' },
            input: { class: 'hidden' },
            uploadIcon: { class: '' },
        })
    },
    bucketName: {
        type: String,
        default: 'public'
    },
    path: {
        type: String,
        default: ''
    },
    upsert: {
        type: Boolean,
        default: false
    },
    addTimestamp: {
        type: Boolean,
        default: true
    },
    fileForUpload: {
        type: Object as () => File | null,
        default: null
    }
});

import { type FileUploadUploaderEvent } from 'primevue/fileupload';
const emit = defineEmits(['success', 'error', 'file-selected', 'file-ready-for-upload']);
const client = useSupabaseClient();

watch(() => props.fileForUpload, (newFile) => {
    if (newFile) {
        internalUploadHandler(newFile as File);
    }
}, { immediate: false });

const internalUploadHandler = async (fileOrEvent: File | FileUploadUploaderEvent) => {
    // console.log('3.5 internalUploadHandler', fileOrEvent);

    if (fileOrEvent) {
        performUpload(fileOrEvent as File);
    } else {
        emit('error', 'No file available for upload');
    }
};

const performUpload = async (file: File) => {
    try {
        let extension = file.type.split('/').pop();
        let filePath = `${props.path}`;

        if (props.addTimestamp) {
            const timestamp = Date.now();
            filePath = `${filePath}_${timestamp}.${extension}`; // Add timestamp and new extension
        } else {
            filePath = `${filePath}.${extension}`; // Add the extension for cases without timestamp
        }

        const { data, error: uploadError } = await client.storage.from(props.bucketName).upload(filePath, file, { upsert: props.upsert });

        if (uploadError) throw uploadError;

        const fileUrl = client.storage.from(props.bucketName).getPublicUrl(filePath);
        // console.log('4. baseupload performUpload done, now emitting success');

        emit('success', fileUrl.data.publicUrl);
    } catch (error) {
        emit('error', (error as Error).message);
    }
};

//used to prevent PrimeVue from uploading the file itself
const handleUploadPlaceholder = (event: FileUploadUploaderEvent) => {
    const files = Array.isArray(event.files) ? event.files : [event.files];
    // console.log('1. baseupload handleUploadPlaceholder now emitting file-selected');
    emit('file-selected', files);
};
</script>
