<script setup>
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div>
    <div class="rounded-lg overflow-hidden">
      <TableUsers />

      <label for="chkbox1">Remember Me</label>
      <Checkbox inputId="chkbox1" />

      <span id="chkbox2">Remember Me</span>
      <Checkbox aria-labelledby="chkbox2" />

      <Checkbox aria-label="Remember Me" />
      <RadioButton />
    </div>
  </div>
</template>