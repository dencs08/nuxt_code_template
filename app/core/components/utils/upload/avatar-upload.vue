<template>
  <FileUpload
    mode="basic"
    :customUpload="true"
    @uploader="handleUpload"
    @select="handleFileSelected"
    :maxFileSize="maxFileSize"
    accept="image/*"
    :auto="true"
    chooseLabel="Change Avatar"
    :pt="{
      root: { class: 'flex !justify-start' },
      chooseButton: {
        class: 'p-button p-component p-button-outlined',
      },
    }"
  />
</template>

<script setup lang="ts">
import imageCompression from "browser-image-compression";
import type {
  FileUploadSelectEvent,
  FileUploadUploaderEvent,
} from "primevue/fileupload";

const { showToast } = useToastService();
const userStore = useUserStore();

const maxFileSize = 5 * 1024 * 1024; // 5MB max file size

const handleFileSelected = async (event: FileUploadSelectEvent) => {
  console.log("File selected:", event.files);
};

const handleUpload = async (event: FileUploadUploaderEvent) => {
  try {
    const file = event.files[0];

    // Compress the file
    const compressedFile = await compressFile(file);
    console.log("File compressed:", compressedFile.name);

    // Upload the compressed file
    const fileUrl = await uploadFile(compressedFile);

    // Update user's photo
    await updateUserPhoto(fileUrl);

    showToast({
      severity: "success",
      summary: "File uploaded",
      detail: "Your avatar has been updated",
    });
  } catch (error) {
    console.error("Error in handleUpload:", error);
    handleUploadError((error as Error).message);
  }
};

const compressFile = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: maxFileSize / 1024 / 1024,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
    fileType: "image/jpeg",
    maxIteration: 20,
    initialQuality: 0.5,
    alwaysKeepResolution: false,
  };
  return await imageCompression(file, options);
};

const uploadFile = async (file: File): Promise<string> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        const base64File = result.split(",")[1];
        const { data, error } = await useFetch("/api/upload", {
          method: "POST",
          body: {
            file: base64File,
            contentType: file.type,
          },
        });

        if (error.value) reject(error.value);
        resolve(data.value.response.publicUrl);
      } else {
        reject(new Error("Failed to read file as string"));
      }
    };
    fileReader.readAsDataURL(file);
  });
};

const updateUserPhoto = async (fileUrl: string) => {
  await userStore.fetchUser();
};

const handleUploadError = (errorMessage: string) => {
  console.error("Upload error:", errorMessage);
  showToast({
    severity: "error",
    summary: "File upload failed",
    detail: errorMessage,
  });
};
</script>
