<template>
  <Body class="overflow-hidden bg-dark-900">
    <div class="overflow-hidden">
      <div
        class="h-screen w-screen flex flex-col justify-center md:justify-end items-start z-[999]"
      >
        <div
          class="w-full text-center flex flex-col items-center px-8 md:px-24 py-0 xs:py-40 space-y-3 z-[999]"
        >
          <h2
            class="uppercase text-surface-50 text-4xl sm:text-6xl md:text-8xl font-bold"
          >
            {{ getUserFriendlyErrorMessage(error.statusCode) }}
          </h2>
          <p class="md:text-lg text-surface-100">
            {{ getUserFriendlyErrorDescription(error.statusCode) }}
          </p>
          <MyButton @click="handleError" styling="primary">Go Back</MyButton>
        </div>
      </div>
    </div>
    <div
      class="block absolute top-1/2 left-1/2 -mt-48 md:-mt-24 w-full -translate-y-1/2 -translate-x-1/2 cursor-none pointer-events-none z-[-9999] glitch"
    >
      <h1
        class="text-light-50 text-center mt-0 uppercase font-bold"
        ref="glitchedHeader"
      >
        {{ error.statusCode }}
      </h1>
      <div
        class="glitch-window absolute top-0 left-[-5px] w-full overflow-hidden"
        ref="glitchWindow"
      ></div>
    </div>
    <div
      class="absolute inset-0 z-[10] bg-gradient-to-b from-black/25 via-black/90 to-black pointer-events-none h-screen"
    ></div>
  </Body>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object,
});

const router = useRouter();
const glitchedHeader = ref(null);
const glitchWindow = ref(null);

const handleError = () => {
  clearError({ redirect: "/" });
};

const getUserFriendlyErrorMessage = (statusCode: number): string => {
  const errorMessages: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Page Not Found",
    500: "Internal Server Error",
  };
  return errorMessages[statusCode] || "Oops! Something went wrong";
};

const getUserFriendlyErrorDescription = (statusCode: number): string => {
  const errorDescriptions: Record<number, string> = {
    400: "The request couldn't be understood. Please check your input and try again.",
    401: "You need to be logged in to access this page. Please sign in and try again.",
    403: "You don't have permission to access this page. If you think this is a mistake, please contact support.",
    404: "We couldn't find the page you're looking for. It might have been moved or deleted.",
    500: "Our servers encountered an unexpected error. Please try again later or contact support if the problem persists.",
  };
  return (
    errorDescriptions[statusCode] ||
    "We're sorry, but something went wrong. Please try again later or contact support if the problem persists."
  );
};

onMounted(() => {
  if (glitchedHeader.value && glitchWindow.value) {
    const clone = glitchedHeader.value.cloneNode(true);
    glitchWindow.value.appendChild(clone);

    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "dev"
    ) {
      console.log(props.error);
    }
  }
});
</script>

<style lang="scss">
$background-color: #828282;
$headline-color: #343434;

:root {
  --size: clamp(20em, 50vw, 100em);
}

@media (max-width: 768px) {
  :root {
    --size: clamp(5em, 35vw, 50em);
  }
}

div.glitch {
  h1 {
    font-size: var(--size);
  }
}

.glitch-window {
  color: $headline-color;
  text-shadow:
    2px 0 $background-color,
    -1px 0 rgb(213, 213, 121),
    -2px 0 rgb(60, 162, 60);
  animation: crt-me 750ms infinite linear alternate-reverse;
}

@keyframes crt-me {
  0% {
    clip: rect(calc(0.24 * var(--size)), 9999px, calc(0.59 * var(--size)), 0);
  }

  10% {
    clip: rect(calc(0.7 * var(--size)), 9999px, calc(0.48 * var(--size)), 0);
  }

  20% {
    clip: rect(calc(0.53 * var(--size)), 9999px, calc(0.48 * var(--size)), 0);
  }

  30% {
    clip: rect(calc(0.17 * var(--size)), 9999px, calc(0.61 * var(--size)), 0);
  }

  40% {
    clip: rect(calc(0.4 * var(--size)), 9999px, calc(0.61 * var(--size)), 0);
  }

  50% {
    clip: rect(calc(0.38 * var(--size)), 9999px, calc(0.53 * var(--size)), 0);
  }

  60% {
    clip: rect(calc(0.62 * var(--size)), 9999px, calc(0.9 * var(--size)), 0);
  }

  70% {
    clip: rect(calc(0.21 * var(--size)), 9999px, calc(0.91 * var(--size)), 0);
  }

  80% {
    clip: rect(calc(0.61 * var(--size)), 9999px, calc(1.01 * var(--size)), 0);
  }

  90% {
    clip: rect(calc(0.27 * var(--size)), 9999px, calc(0.8 * var(--size)), 0);
  }

  100% {
    clip: rect(calc(0.75 * var(--size)), 9999px, calc(0.5 * var(--size)), 0);
  }
}
</style>
