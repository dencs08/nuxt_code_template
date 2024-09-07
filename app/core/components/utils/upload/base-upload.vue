<template>
  <FileUpload
    :mode="mode"
    :name="name"
    customUpload
    @uploader="handleUploadPlaceholder"
    :accept="accept"
    :maxFileSize="maxFileSize"
    :auto="auto"
    :chooseLabel="chooseLabel"
    :pt="pt"
  />
</template>

<script setup lang="ts">
import { type FileUploadUploaderEvent } from "primevue/fileupload";

const props = defineProps({
  mode: {
    type: String as () => "basic" | "advanced",
    default: "basic",
  },
  name: {
    type: String,
    default: "file",
  },
  accept: {
    type: String,
    default: "image/*",
  },
  maxFileSize: {
    type: Number,
    default: 1000000, // 1MB
  },
  auto: {
    type: Boolean,
    default: true,
  },
  chooseLabel: {
    type: String,
    default: "Upload File",
  },
  pt: {
    type: Object,
    default: () => ({
      label: { class: "text-sm font-medium font-body" },
      chooseButton: {
        class:
          "flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-surface-0 font-bold py-1.5 px-3 rounded cursor-pointer transition border-0 shadow-sm ring-1 ring-inset dark:ring-surface-0/25 ring-surface-0/40 focus:ring-2 focus:ring-inset focus:ring-surface-300 sm:text-sm sm:leading-6",
      },
      input: { class: "hidden" },
      uploadIcon: { class: "" },
    }),
  },
  bucketName: {
    type: String,
    default: "public",
  },
  path: {
    type: String,
    default: "",
  },
  upsert: {
    type: Boolean,
    default: false,
  },
  addTimestamp: {
    type: Boolean,
    default: true,
  },
  fileForUpload: {
    type: Object as () => File | null,
    default: null,
  },
});

const emit = defineEmits([
  "success",
  "error",
  "file-selected",
  "file-ready-for-upload",
]);
watch(
  () => props.fileForUpload,
  (newFile) => {
    if (newFile) {
      internalUploadHandler(newFile as File);
    }
  },
  { immediate: false }
);

const internalUploadHandler = async (
  fileOrEvent: File | FileUploadUploaderEvent
) => {
  if (fileOrEvent) {
    performUpload(fileOrEvent as File);
  } else {
    emit("error", "No file available for upload");
  }
};

const performUpload = async (file: File) => {
  try {
    let extension = file.type.split("/").pop();
    let filePath = `${props.path}`;
    if (props.addTimestamp) {
      const timestamp = Date.now();
      filePath = `${filePath}_${timestamp}.${extension}`;
    } else {
      filePath = `${filePath}.${extension}`;
    }

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        const base64File = result.split(",")[1];
        const { data, error } = await useFetch("/api/upload", {
          method: "POST",
          body: {
            bucketName: props.bucketName,
            filePath,
            file: base64File,
            upsert: props.upsert,
            contentType: file.type,
          },
        });

        if (error.value) throw error.value;

        // Ensure that data.value and data.value.publicUrl exist before emitting
        if (data.value && data.value.response.publicUrl) {
          emit("success", data.value.response.publicUrl);
        } else {
          throw new Error("Upload successful, but public URL is missing");
        }
      } else {
        throw new Error("Failed to read file as string");
      }
    };
    fileReader.readAsDataURL(file);
  } catch (error) {
    emit("error", (error as Error).message);
  }
};

const handleUploadPlaceholder = (event: FileUploadUploaderEvent) => {
  const files = Array.isArray(event.files) ? event.files : [event.files];
  emit("file-selected", files);
};
</script>
