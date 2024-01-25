<template>
    <FileUpload :mode="mode" :name="name" customUpload @uploader="internalUploadHandler" :accept="accept"
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
    }
});

import { type FileUploadUploaderEvent } from 'primevue/fileupload';
const emit = defineEmits(['success', 'error', 'file-selected']);
const client = useSupabaseClient();

//TODO files which could be compressed should be compressed before upload 
const internalUploadHandler = async (event: FileUploadUploaderEvent) => {
    console.log('uploading internally');

    const files = Array.isArray(event.files) ? event.files : [event.files];
    emit('file-selected', files);

    if (files.length === 0) {
        emit('error', 'No file selected');
        return;
    }

    try {
        const file = files[0];

        let filePath = `${props.path}`;
        if (props.addTimestamp) {
            const timestamp = Date.now();
            const pathParts = filePath.split('.');
            const extension = pathParts.pop();
            filePath = `${pathParts.join('.')}_${timestamp}.${extension}`;
        }

        const { data, error: uploadError } = await client.
            storage.
            from(props.bucketName).
            upload(filePath, file, { upsert: props.upsert });

        if (uploadError) throw uploadError;

        const fileUrl = client
            .storage
            .from(props.bucketName)
            .getPublicUrl(filePath);

        emit('success', fileUrl.data.publicUrl);
    } catch (error) {
        emit('error', (error as Error).message);
    }
};
</script>
