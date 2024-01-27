<template>
    <BaseUpload :bucketName="bucketName" :path="filePath" :fileForUpload="compressedFile" @success="handleUploadSuccess"
        @error="handleUploadError" @file-selected="handleFileSelected" :upsert="true" :maxFileSize="maxFileSize" />
</template>

<script setup lang="ts">
import imageCompression from 'browser-image-compression';

const client = useSupabaseClient();
const { addToast } = useToastService();
const userStore = useUsersStore();
let userSession = userStore.getUserSession;

const compressedFile = ref(null);

const fileName = 'avatar'
const bucketName = 'user_avatars';
const maxFileSize = 20000000; //kbs (20mb before compression, actual max file size is set in the supabase bucket)
const filePath = `${userSession.id}/${fileName}`;

const handleUploadSuccess = async (fileUrl: string) => {
    try {
        compressedFile.value = null;
        //@ts-ignore
        const { error: userError } = await client.from('users').update({ photo: fileUrl }).eq('id', userSession.id);
        if (userError) throw userError;

        const fileToDelete = `${userSession.id}/${userSession.photo.split('/').pop()}`
        const { error: deleteError } = await client.storage.from(bucketName).remove([fileToDelete]);
        if (deleteError) throw deleteError;

        await userStore.fetchUserSession();
        userSession = userStore.getUserSession;
        addToast('success', 'File uploaded', 'Your photo has been uploaded successfully');
        // console.log('5. avatar-upload handleUploadSuccess done');
    } catch (error) {
        handleUploadError((error as Error).message);
    }
};

const handleUploadError = (errorMessage: string) => {
    addToast('error', 'File upload failed', errorMessage);
};

const handleFileSelected = async (files: any) => {
    // console.log('2. avatar-upload file selected', files);
    if (!files || files.length === 0) {
        return;
    }

    try {
        const file = files[0];

        const options = {
            maxSizeMB: maxFileSize / 1000000, //max file size before compression in MB
            maxWidthOrHeight: 1080,
            useWebWorker: true,
            fileType: 'image/jpeg',
            maxIteration: 20,
            initialQuality: 0.5,
            alwaysKeepResolution: false,
        };
        compressedFile.value = await imageCompression(file, options);
        // console.log('3. avatar-upload compressedFile sent', files);
    } catch (error) {
        console.error('Error during image compression:', error);
        handleUploadError('Failed to compress image');
    }
};
</script>