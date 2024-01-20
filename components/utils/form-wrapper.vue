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
    const start = Date.now();

    props.handleSubmit(data).then(() => {
      //always add fake 250ms time to request so formkit has time to show the spinner
      const duration = Date.now() - start;
      const delay = Math.max(0, 250 - duration);

      setTimeout(() => {
        reset();
        resolve();
      }, delay);
    }).catch((error) => {
      reject(error);
    });
  });
};

</script>

<template>
  <FormKit type="form" v-model="data" :submit-attrs="{ inputClass: 'w-full btn-dark' }" @submit="formSubmitted"
    :incomplete-message="false">
    <slot v-bind:getNode="getNode"></slot>
  </FormKit>
</template>
