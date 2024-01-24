<template>
    <BaseUpload :bucketName="bucketName" :path="filePath" @success="handleUploadSuccess" @error="handleUploadError"
        @file-selected="handleFileSelected" :upsert="true" />
</template>

<script setup lang="ts">
const client = useSupabaseClient();
const { addToast } = useToastService();
const userStore = useUsersStore();
let userSession = userStore.getUserSession;

const fileName = 'avatar.jpg'
const bucketName = 'user_avatars';

const filePath = `${userSession.id}/${fileName}`;

const handleUploadSuccess = async (fileUrl: string) => {
    try {
        //@ts-ignore
        const { error: userError } = await client.from('users').update({ photo: fileUrl }).eq('id', userSession.id);
        if (userError) throw userError;

        const fileToDelete = `${userSession.id}/${userSession.photo.split('/').pop()}`
        const { error: deleteError } = await client.storage.from(bucketName).remove([fileToDelete]);
        if (deleteError) throw deleteError;

        await userStore.fetchUserSession();
        userSession = userStore.getUserSession;
        addToast('success', 'Avatar uploaded', 'Your photo has been uploaded successfully');
    } catch (error) {
        handleUploadError((error as Error).message);
    }
};

const handleUploadError = (errorMessage: string) => {
    addToast('error', 'Avatar upload failed', errorMessage);
};

const handleFileSelected = (files: any) => {
};
</script>