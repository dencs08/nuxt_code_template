<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Anime.js Test Component</h1>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <Button @click="fadeInElement">Fade In</Button>
      <Button @click="fadeOutElement">Fade Out</Button>
      <Button @click="slideInElement('left')"> Slide In Left </Button>
      <Button @click="slideInElement('right')"> Slide In Right </Button>
      <Button @click="slideInElement('top')"> Slide In Top </Button>
      <Button @click="slideInElement('bottom')"> Slide In Bottom </Button>
      <Button @click="scaleElement">Scale</Button>
      <Button @click="customAnimation"> Custom Animation </Button>
      <Button @click="runTimeline">Run Timeline</Button>
    </div>

    <div class="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
      <div
        ref="animatedElement"
        class="absolute inset-0 flex items-center justify-center bg-blue-500 text-white text-2xl font-bold"
      >
        Animated Element
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const animatedElement = ref<HTMLElement | null>(null);
const {
  fadeIn,
  fadeOut,
  slideIn,
  scale,
  customAnimate,
  createTimeline,
  anime,
} = useAnimations();

const fadeInElement = () => {
  if (animatedElement.value) {
    fadeIn(animatedElement.value, { duration: 1000 });
  }
};

const fadeOutElement = () => {
  if (animatedElement.value) {
    fadeOut(animatedElement.value, { duration: 1000 });
  }
};

const slideInElement = (direction: "left" | "right" | "top" | "bottom") => {
  if (animatedElement.value) {
    slideIn(animatedElement.value, direction, { duration: 1000 });
  }
};

const scaleElement = () => {
  if (animatedElement.value) {
    scale(animatedElement.value, { scale: [0, 1], duration: 1000 });
  }
};

const customAnimation = () => {
  if (animatedElement.value) {
    customAnimate(animatedElement.value, {
      translateX: anime.random(-100, 100),
      translateY: anime.random(-100, 100),
      rotate: anime.random(-360, 360),
      scale: anime.random(0.5, 1.5),
      duration: 1000,
    });
  }
};

const runTimeline = () => {
  if (animatedElement.value) {
    const timeline = createTimeline();

    timeline
      .add({
        targets: animatedElement.value,
        translateX: 250,
        easing: "easeInOutQuad",
        duration: 1000,
      })
      .add({
        targets: animatedElement.value,
        translateY: 50,
        rotate: 180,
        scale: 1.2,
        duration: 800,
      })
      .add({
        targets: animatedElement.value,
        translateX: 0,
        translateY: 0,
        rotate: 360,
        scale: 1,
        duration: 1000,
        easing: "easeOutElastic(1, .5)",
      });
  }
};
</script>
