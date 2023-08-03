<script setup>
const props = defineProps({
  handleSubmit: {
    type: Function,
    required: true,
  },
});

const data = reactive({})
const nodes = ref([])

const getNode = (node) => {
  nodes.value.push(node)
}

const reset = () => {
  nodes.value.forEach(node => {
    node.reset()
  })
  nodes.value = []
}

const formSubmitted = (data) => {
  return new Promise((resolve, reject) => {
    props.handleSubmit(data).then(() => {
      reset();
      resolve();
    }).catch((error) => {
      reject(error);
    });
  });
};
</script>

<template>
  <FormKit type="form" v-model="data" :submit-attrs="{ inputClass: 'w-full btn-dark' }" @submit="formSubmitted" :incomplete-message="false">
    <slot v-bind:getNode="getNode"></slot>
  </FormKit>
</template>
