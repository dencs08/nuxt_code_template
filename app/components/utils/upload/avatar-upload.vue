<template>
  <BaseUpload
    :bucketName="bucketName"
    :path="filePath"
    :fileForUpload="compressedFile"
    @success="handleUploadSuccess"
    @error="handleUploadError"
    @file-selected="handleFileSelected"
    :upsert="true"
    :maxFileSize="maxFileSize"
  />
</template>

<script setup lang="ts">
import imageCompression from "browser-image-compression";

const { addToast } = useToastService();
const userStore = useUserStore();
let userSession = userStore.getUser;
const compressedFile = ref(null);
const fileName = "avatar";
const bucketName = "user_avatars";
const maxFileSize = 20000000; // 20MB before compression
const filePath = `${userSession.id}/${fileName}`;

const handleUploadSuccess = async (fileUrl: string) => {
  try {
    compressedFile.value = null;

    const { data, error } = await useFetch("/api/me/photo", {
      method: "POST",
      body: { photoUrl: fileUrl },
    });

    if (error.value) throw error.value;

    const fileToDelete = `${userSession.id}/${userSession.photo.split("/").pop()}`;
    await useFetch("/api/upload", {
      method: "DELETE",
      body: { bucketName, filePath: fileToDelete },
    });

    await userStore.fetchUser();
    userSession = userStore.getUser;
    addToast(
      "success",
      "File uploaded",
      "Your photo has been uploaded successfully"
    );
  } catch (error) {
    handleUploadError((error as Error).message);
  }
};

const handleUploadError = (errorMessage: string) => {
  addToast("error", "File upload failed", errorMessage);
};

const handleFileSelected = async (files: any) => {
  if (!files || files.length === 0) {
    return;
  }
  try {
    const file = files[0];
    const options = {
      maxSizeMB: maxFileSize / 1000000,
      maxWidthOrHeight: 1080,
      useWebWorker: true,
      fileType: "image/jpeg",
      maxIteration: 20,
      initialQuality: 0.5,
      alwaysKeepResolution: false,
    };
    compressedFile.value = await imageCompression(file, options);
  } catch (error) {
    console.error("Error during image compression:", error);
    handleUploadError("Failed to compress image");
  }
};
</script>
