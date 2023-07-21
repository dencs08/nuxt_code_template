<template>
    <div id="app">
        <div ref="dropzone" class="dropzone"></div>
    </div>
</template>
  
<script setup>
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

const dropzone = ref(null);
const emit = defineEmits(['update:file'])
onMounted(() => {
    createDropzone();
});

const { uploadFile } = useFile()
const uploadedFileName = ref('');

function createDropzone() {
    dropzone.value = new Dropzone(dropzone.value, {
        url: async (files) => {
            const file = files[0];
            const response = await uploadFile(file);
            uploadedFileName.value = response.name;
            emit('update:file', uploadedFileName.value);  // emit the event here
            return response.path;
        },
        method: "post",
        maxFilesize: 4, // MB
        maxFiles: 1,
        acceptedFiles: ".pdf,.doc,.docx,,.jpg,.png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        dictDefaultMessage: `Drag and drop files here or click to upload`,
        addRemoveLinks: true,
        init: function () {
            this.on("success", function (file, response) {
                // console.log("File uploaded successfully", file, response);
            });

            this.on("error", function (file, errorMessage) {
                // console.error("Error uploading file", file, errorMessage);
            });
        },
    });
}
</script>
  
<style scoped>
.dropzone {
    min-height: 150px;
    color: #525252;
    border: 2px dashed #dedede;
    border-radius: 10px;
    background: #fff;
    padding: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>