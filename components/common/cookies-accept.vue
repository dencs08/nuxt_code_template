<template>
  <Dialog v-model:visible="visible" :position="position" :modal="false" :draggable="false"
    class="bg-white rounded-xl shadow-xl mb-5 max-sm:mx-3 sm:ml-5" :style="{ width: '30rem' }">
    <template #container="{ closeCallback }">
      <div>
        <div class="flex flex-col px-10 py-7 gap-5">
          <h4 class="text-2xl font-bold">Cookie Consent</h4>
          <p>This website uses cookies to ensure you get the best experience on our website. Do you accept?</p>
          <div class="flex items-center gap-2">
            <Button label="Accept" size="small" @click="acceptCookies"></Button>
            <Button label="Reject" size="small" outlined @click="rejectCookies"></Button>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
type PositionType = "bottomleft" | "center" | "top" | "bottom" | "left" | "right" | "topleft" | "topright" | "bottomright";
const position = ref<PositionType>('bottomleft');
const visible = ref(false);

onMounted(() => {
  openPosition('bottomleft')
});

const openPosition = (pos: PositionType) => {
  position.value = pos;
  visible.value = true;
}

const acceptCookies = () => {
  // console.log('accept');
  visible.value = false;
}

const rejectCookies = () => {
  // console.log('reject');
  visible.value = false;
}
</script>

<style></style>