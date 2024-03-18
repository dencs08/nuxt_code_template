<template>
    <div :class="['vue3-marquee', { vertical, horizontal: !vertical, 'cursor-pointer': pauseOnClick }]"
        :style="getCurrentStyle" @mouseenter="hoverStarted" @mouseleave="hoverEnded" @mousedown="mouseDown"
        @mouseup="mouseUp" v-if="ready" :key="componentKey">
        <div class="transparent-overlay" aria-hidden="true" ref="marqueeOverlayContainer"></div>
        <div v-if="gradient" class="overlay" :class="{ vertical, horizontal: !vertical }" aria-hidden="true"></div>
        <div class="marquee" ref="marqueeContent">
            <slot></slot>
        </div>
        <div v-if="!animateOnOverflowOnly || animateOnOverflowOnly && !animateOnOverflowPause" class="marquee"
            aria-hidden="true">
            <slot></slot>
        </div>
        <template v-if="clone" v-for="num in cloneAmount">
            <div aria-hidden="true" class="marquee cloned">
                <slot></slot>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    vertical: Boolean,
    direction: String,
    duration: Number,
    delay: Number,
    loop: Number,
    clone: Boolean,
    gradient: Boolean,
    gradientColor: Array,
    gradientWidth: String,
    gradientLength: String,
    pauseOnHover: Boolean,
    pauseOnClick: Boolean,
    pause: Boolean,
    animateOnOverflowOnly: Boolean
});

// Refs
const cloneAmount = ref(0);
const minWidth = ref("100%");
const minHeight = ref("100%");
const componentKey = ref(0);
const verticalAnimationPause = ref(false);
const animateOnOverflowPause = ref(false);
const containerWidth = ref(0);
const contentWidth = ref(0);
const containerHeight = ref(0);
const contentHeight = ref(0);
const mouseOverMarquee = ref(false);
const mouseDownMarquee = ref(false);
const gradientLength = ref("200px");
const loopInterval = ref(null);
const loopCounter = ref(0);
const marqueeContent = ref(null);
const marqueeOverlayContainer = ref(null);
const ready = ref(false);

// Emits
const emit = defineEmits([
    "onComplete",
    "onLoopComplete",
    "onPause",
    "onResume",
    "onOverflowDetected",
    "onOverflowCleared"
]);

// Computed
const getCurrentStyle = computed(() => ({
    "--duration": `${props.duration || 10}s`,
    "--delay": `${props.delay || 0}s`,
    "--direction": props.direction || 'normal',
    "--pauseOnHover": mouseOverMarquee.value ? 'paused' : 'running',
    "--pauseOnClick": mouseDownMarquee.value ? 'paused' : 'running',
    "--pauseAnimation": props.pause || verticalAnimationPause.value || animateOnOverflowPause.value ? 'paused' : 'running',
    "--loops": props.loop === 0 ? 'infinite' : props.loop || 'infinite',
    "--gradient-color": `rgba(${props.gradientColor?.join(',') || '255,255,255'}, 1), rgba(${props.gradientColor?.join(',') || '255,255,255'}, 0)`,
    "--gradient-length": props.gradientLength || gradientLength.value || '100px',
    "--min-width": minWidth.value || '100px',
    "--min-height": minHeight.value || '100px',
    "--orientation": props.vertical ? 'scrollY' : 'scrollX'
}));

// Methods
const checkForClone = async () => {
    if (props.vertical) {
        verticalAnimationPause.value = true;
    }
    setInterval(() => {
        minWidth.value = "0%";
        minHeight.value = "0%";
        if (marqueeContent.value !== null && marqueeOverlayContainer.value !== null && marqueeContent.value && marqueeOverlayContainer.value) {
            if (props.vertical && "clientHeight" in marqueeContent.value && "clientHeight" in marqueeOverlayContainer.value) {
                contentHeight.value = marqueeContent.value.clientHeight;
                containerHeight.value = marqueeOverlayContainer.value.clientHeight;
                const localCloneAmount = Math.ceil(containerHeight.value / contentHeight.value);
                cloneAmount.value = isFinite(localCloneAmount) ? localCloneAmount : 0;
                verticalAnimationPause.value = false;
                return cloneAmount.value;
            } else if (!props.vertical && "clientWidth" in marqueeContent.value && "clientWidth" in marqueeOverlayContainer.value) {
                contentWidth.value = marqueeContent.value.clientWidth;
                containerWidth.value = marqueeOverlayContainer.value.clientWidth;
                if (props.animateOnOverflowOnly) {
                    if (contentWidth.value < containerWidth.value) {
                        animateOnOverflowPause.value = true;
                        emit("onOverflowDetected");
                    } else {
                        animateOnOverflowPause.value = false;
                        emit("onOverflowCleared");
                    }
                    return 0;
                }
                const localCloneAmount = Math.ceil(containerWidth.value / contentWidth.value);
                cloneAmount.value = isFinite(localCloneAmount) ? localCloneAmount : 0;
                return cloneAmount.value;
            } else {
                minWidth.value = "100%";
                minHeight.value = "100%";
                return 0;
            }
        } else {
            minWidth.value = "100%";
            minHeight.value = "100%";
            return 0;
        }
    }, 100);
};

const hoverStarted = () => {
    if (props.pauseOnHover) {
        mouseOverMarquee.value = true;
        emit("onPause");
    }
};
const hoverEnded = () => {
    if (props.pauseOnHover) {
        mouseOverMarquee.value = false;
        emit("onResume");
    }
};
const mouseDown = () => {
    if (props.pauseOnClick) {
        mouseDownMarquee.value = true;
        emit("onPause");
    }
};
const mouseUp = () => {
    if (props.pauseOnClick) {
        mouseDownMarquee.value = false;
        emit("onResume");
    }
};
const click = () => {
    if (props.pauseOnClick) {
        togglePause()
        emit("onPause");
    }
};
const togglePause = () => {
    mouseDownMarquee.value = !mouseDownMarquee.value;
};

const ForcesUpdate = async () => {
    await checkForClone();
    componentKey.value++;
};

const setupMarquee = async () => {
    if (props.vertical) {
        minHeight.value = "100%";
        minWidth.value = "auto";
        if (props.animateOnOverflowOnly) {
            console.warn("The `animateOnOverflowOnly` prop is not supported for vertical marquees.");
        }
    } else {
        minHeight.value = "auto";
        if (props.animateOnOverflowOnly) {
            minWidth.value = "auto";
        } else {
            minWidth.value = "100%";
        }
    }
    if (props.gradient) {
        if (props.gradientWidth) {
            console.warn("The `gradientWidth` prop has been deprecated and will be removed in a future release. Please use `gradientLength` instead.");
            gradientLength.value = props.gradientWidth;
        } else if (props.gradientLength) {
            gradientLength.value = props.gradientLength;
        }
    }
    if (props.clone || props.animateOnOverflowOnly) {
        await checkForClone();
        ForcesUpdate();
        ready.value = true;
    } else {
        ready.value = true;
    }
};

// Lifecycle
onMounted(async () => {
    setupMarquee();
    loopInterval.value = setInterval(() => {
        loopCounter.value++;
        if (props.loop !== 0 && loopCounter.value === props.loop) {
            emit("onComplete");
            clearInterval(loopInterval.value);
        }
        emit("onLoopComplete");
    }, props.duration * 1e3);
})

onBeforeUnmount(() => {
    clearInterval(loopInterval.value);
})

// Watchers
watch(contentWidth, async () => {
    if (props.clone) {
        ForcesUpdate();
    }
});
watch(containerWidth, async () => {
    if (props.clone || props.animateOnOverflowOnly) {
        ForcesUpdate();
    }
});
watch(() => props.pause, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        if (newVal) {
            emit("onResume");
        } else {
            emit("onPause");
        }
    }
});
</script>

<style>
.vue3-marquee {
    display: flex;
    position: relative;
    overflow: hidden;
}

.vue3-marquee.horizontal {
    overflow: hidden;
    flex-direction: row;
    width: 100%;
    height: max-content
}

.vue3-marquee.vertical {
    overflow: hidden;
    flex-direction: column;
    height: 100%;
    width: max-content
}

.vue3-marquee:hover>.marquee {
    animation-play-state: var(--pauseOnHover)
}

.vue3-marquee:active>.marquee {
    animation-play-state: var(--pauseOnClick)
}

.vue3-marquee>.marquee {
    flex: 0 0 auto;
    min-width: var(--min-width);
    min-height: var(--min-height);
    z-index: 1;
    animation: var(--orientation) var(--duration) linear var(--delay) var(--loops);
    animation-play-state: var(--pauseAnimation);
    animation-direction: var(--direction)
}

.vue3-marquee.horizontal>.marquee {
    display: flex;
    flex-direction: row;
    align-items: center
}

.vue3-marquee.vertical>.marquee {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

@keyframes scrollX {
    0% {
        transform: translate(0)
    }

    to {
        transform: translate(-100%)
    }
}

@keyframes scrollY {
    0% {
        transform: translateY(0)
    }

    to {
        transform: translateY(-100%)
    }
}

.vue3-marquee>.overlay {
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%
}

.vue3-marquee>.transparent-overlay {
    position: absolute;
    width: 100%;
    height: 100%
}

.vue3-marquee>.overlay:before,
.vue3-marquee>.overlay:after {
    content: "";
    position: absolute;
    z-index: 2
}

.vue3-marquee.horizontal>.overlay:before,
.vue3-marquee.horizontal>.overlay:after {
    background: linear-gradient(to right, var(--gradient-color));
    height: 100%;
    width: var(--gradient-length)
}

.vue3-marquee.vertical>.overlay:before,
.vue3-marquee.vertical>.overlay:after {
    background: linear-gradient(to bottom, var(--gradient-color));
    height: var(--gradient-length);
    width: 100%
}

.vue3-marquee.horizontal>.overlay:after {
    transform: rotate(180deg)
}

.vue3-marquee.vertical>.overlay:after {
    transform: rotate(-180deg)
}

.vue3-marquee>.overlay:before {
    left: 0;
    top: 0
}

.vue3-marquee.horizontal>.overlay:after {
    right: 0;
    top: 0
}

.vue3-marquee.vertical>.overlay:after {
    left: 0;
    bottom: 0
}
</style>