<template>
  <Body
    class="overflow-hidden gradient-radial bg-gradient-to-r from-primary-500 to-secondary-500"
  >
    <div class="overflow-hidden">
      <div
        class="h-screen w-screen flex flex-col justify-center md:justify-end items-start"
      >
        <div
          class="text-center md:text-left flex flex-col items-center md:block max-w-3xl lg:max-w-4xl px-8 md:px-24 py-0 xs:py-40 space-y-3"
        >
          <div class="block md:hidden">
            <h1 class="text-7xl xs:text-8xl text-accent-300 font-bold">
              {{ error.statusCode }}
            </h1>
          </div>
          <h2
            class="uppercase text-surface-700 lg:text-surface-900 text-4xl sm:text-6xl md:text-8xl font-bold lg:mix-blend-overlay"
          >
            {{ error.message }}
          </h2>
          <p class="md:text-lg text-surface-50">
            We're sorry, but something went wrong. Please try again later or
            contact support if the problem persists.
          </p>
          <MyButton @click="handleError" styling="light">Go Back</MyButton>
        </div>
      </div>
    </div>
    <!-- Error animation -->
    <div
      class="hidden md:block absolute top-1/4 xl:top-[38%] left-1/2 md:left-[55%] 2xl:left-[65%] w-full -translate-y-1/2 -translate-x-1/2 cursor-none pointer-events-none z-[-9999] scale-[15%] xs:scale-[35%] md:scale-75 xl:scale-100 glitch"
    >
      <h1
        class="text-accent-200 text-center mt-0 uppercase font-bold md:rotate-[28deg] md:-skew-x-[25deg]"
        ref="glitchedHeader"
        :style="{ textShadow: longShadow }"
      >
        {{ error.statusCode }}
      </h1>
      <div
        class="glitch-window absolute top-0 left-[-2px] w-full overflow-hidden bg-transparent"
        ref="glitchWindow"
      ></div>
      <div
        class="shadow-window absolute top-[40px] left-[1px] w-full !bg-transparent overflow-hidden z-[-1] blur-lg"
        ref="shadowWindow"
      ></div>
    </div>
  </Body>
</template>

<script setup lang="ts">
//TODO create custom messages for different error codes
// TODO change to a more user-friendly error design
const props = defineProps({
  error: Object,
});

const router = useRouter();
const glitchedHeader = ref(null);
const glitchWindow = ref(null);
const shadowWindow = ref(null);
const shadowColor = ref(null);

const handleError = () => {
  clearError({ redirect: "/" });
};

onMounted(() => {
  if (glitchedHeader.value && glitchWindow.value && shadowWindow.value) {
    const clone = glitchedHeader.value.cloneNode(true);
    glitchWindow.value.appendChild(clone);

    const shadowClone = glitchedHeader.value.cloneNode(true);
    shadowClone.removeAttribute("style");
    shadowWindow.value.appendChild(shadowClone);

    const h1Color = window.getComputedStyle(glitchedHeader.value).color;
    const rgb = h1Color.match(/\d+/g);
    const hexColor = rgb
      ? `#${((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1)}`
      : "#000000";
    shadowColor.value = darkenColor(hexColor, -15);
  }
});

const longShadow = computed(() => {
  let shadow = "";
  for (let i = 0; i < 30; i++) {
    shadow += `${i > 0 ? "," : ""}${i}px ${i}px 0 ${shadowColor.value}`;
  }
  return shadow;
});

function darkenColor(color: string, percent: number) {
  color = color.slice(1);

  const num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
</script>

<style scoped lang="scss">
$background-color: #f9f8f8;
$headline-color: #f1f1f1;
$size: 35em;

div.glitch {
  h1 {
    font-size: $size;
  }
}

.glitch-window {
  color: $headline-color;
  text-shadow:
    2px 0 $background-color,
    -1px 0 yellow,
    -2px 0 green;
  animation: crt-me 1500ms infinite linear alternate-reverse;
}

.shadow-window {
  h1 {
    color: rgba(26, 26, 26, 0.5) !important;
    text-shadow: rgba(100, 100, 100, 0) !important;
  }
}

@keyframes crt-me {
  0% {
    clip: rect(0.24 * $size, 9999px, 0.59 * $size, 0);
  }

  10% {
    clip: rect(0.7 * $size, 9999px, 0.48 * $size, 0);
  }

  20% {
    clip: rect(0.53 * $size, 9999px, 0.48 * $size, 0);
  }

  30% {
    clip: rect(0.17 * $size, 9999px, 0.61 * $size, 0);
  }

  40% {
    clip: rect(0.4 * $size, 9999px, 0.61 * $size, 0);
  }

  50% {
    clip: rect(0.38 * $size, 9999px, 0.53 * $size, 0);
  }

  60% {
    clip: rect(0.62 * $size, 9999px, 0.9 * $size, 0);
  }

  70% {
    clip: rect(0.21 * $size, 9999px, 0.91 * $size, 0);
  }

  80% {
    clip: rect(0.61 * $size, 9999px, 1.01 * $size, 0);
  }

  90% {
    clip: rect(0.27 * $size, 9999px, 0.8 * $size, 0);
  }

  100% {
    clip: rect(0.75 * $size, 9999px, 0.5 * $size, 0);
  }
}
</style>
