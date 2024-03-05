<template>
    <div :class="['marquee', { vertical: props.vertical, horizontal: !props.vertical, 'cursor-pointer': props.pauseOnClick }]"
        :style="marqueeStyle" :key="componentKey" @mouseenter="hoverStart" @mouseleave="hoverEnd" @click="togglePause">
        <div ref="marqueeOverlay" class="marquee-overlay" v-if="props.gradient"></div>
        <div ref="marqueeContent"
            :class="['marquee-content', { vertical: props.vertical, horizontal: !props.vertical }]">
            <slot></slot>
        </div>
        <!-- <div v-if="!animateOnOverflowOnly || (animateOnOverflowOnly && !animateOnOverflowPause)"
            class="additional-content">
            <slot></slot>
        </div> -->
        <div v-if="clone" v-for="num in cloneAmount" :key="num" aria-hidden="true" class="marquee-content cloned">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    vertical: Boolean,
    direction: { type: String, default: 'normal' },
    duration: { type: Number, default: 20 },
    delay: { type: Number, default: 0 },
    loop: { type: Number, default: Infinity },
    clone: Boolean,
    gradient: Boolean,
    gradientColor: { type: Array, default: () => [255, 255, 255] },
    gradientWidth: String,
    gradientLength: { type: String, default: '200px' },
    pauseOnHover: Boolean,
    pauseOnClick: Boolean,
    pause: Boolean,
    animateOnOverflowOnly: Boolean
});
defineEmits([
    "onComplete",
    "onLoopComplete",
    "onPause",
    "onResume",
    "onOverflowDetected",
    "onOverflowCleared"
]);

const isPaused = ref(false);
const cloneAmount = ref(0);
const componentKey = ref(0);

const contentWidth = ref(0);
const containerWidth = ref(0);
const contentHeight = ref(0);
const containerHeight = ref(0);

const minWidth = ref("100%");
const minHeight = ref("100%");

const marqueeContent = ref<HTMLElement | null>(null);
const marqueeOverlayContainer = ref<HTMLElement | null>(null);
const marqueeOverlay = ref<HTMLElement | null>(null);
const children = ref<HTMLElement[]>([]);

const verticalAnimationPause = ref(false);
const animateOnOverflowPause = ref(false);

onMounted(async () => {
    children.value = Array.from(marqueeContent.value.children) as HTMLElement[];
    console.log(children.value);

    nextTick(() => {
        if (marqueeContent.value) {
            children.value = Array.from(marqueeContent.value.children) as HTMLElement[];
        }
    });
});

const marqueeStyle = computed(() => {
    const baseStyles = {
        '--duration': `${props.duration}s`,
        '--delay': `${props.delay}s`,
        '--direction': props.direction,
        '--loops': props.loop === Infinity ? 'infinite' : props.loop.toString(),
        '--gradient-color': props.gradient ? `linear-gradient(${props.vertical ? 'to bottom' : 'to right'}, rgba(${props.gradientColor.join(',')}, 1), rgba(${props.gradientColor.join(',')}, 0))` : '',
        '--gradient-length': props.gradientLength,
        '--pauseAnimation': `${isPaused.value ? 'paused' : 'running'}`,
        '--min-width': `${minWidth.value}`,
        '--min-height': `${minHeight.value}`
    };

    // Additional styles based on vertical orientation
    const orientationStyles = props.vertical ? {
        '--orientation': 'scrollY'
    } : {
        '--orientation': 'scrollX',
    };

    return {
        ...baseStyles,
        ...orientationStyles
    };
});

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

const ForcesUpdate = async () => {
    await checkForClone();
    componentKey.value++;
};

const checkForClone = async () => {
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
}

function hoverStart() {
    if (props.pauseOnHover) {
        isPaused.value = true;
    }
}

function hoverEnd() {
    if (props.pauseOnHover) {
        isPaused.value = false;
    }
}

function mouseDown() {
    if (props.pauseOnClick) {
        isPaused.value = true;
    }
}

function mouseUp() {
    if (props.pauseOnClick) {
        isPaused.value = false;
    }
}

function togglePause() {
    if (props.pauseOnHover && isPaused.value == true) return;
    isPaused.value = !isPaused.value;
}
</script>

<style>
.marquee {
    display: flex;
    position: relative;
    overflow: hidden;
}

.marquee>.marquee-content {
    /* display: flex;
    flex: 0 0 auto; */
    z-index: 1;
    animation: var(--orientation) var(--duration) linear var(--delay) var(--loops);
    animation-play-state: var(--pauseAnimation);
    animation-direction: var(--direction)
}

.marquee>.marquee-content.vertical {
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    align-items: left;
}

.marquee>.marquee-content.horizontal {
    overflow-x: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
}

.marquee>.marquee-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--gradient-color);
    mask-image: var(--gradient-color);
    -webkit-mask-image: var(--gradient-color);
    mask-size: var(--gradient-length) 100%;
    -webkit-mask-size: var(--gradient-length) 100%;
}


.marquee>.transparent-overlay {
    position: absolute;
    width: 100%;
    height: 100%
}

.marquee>.marquee-overlay:before,
.marquee>.marquee-overlay:after {
    content: "";
    position: absolute;
    z-index: 2
}

.marquee.horizontal>.marquee-overlay:before,
.marquee.horizontal>.marquee-overlay:after {
    background: linear-gradient(to right, var(--gradient-color));
    height: 100%;
    width: var(--gradient-length)
}

.marquee.vertical>.marquee-overlay:before,
.marquee.vertical>.marquee-overlay:after {
    background: linear-gradient(to bottom, var(--gradient-color));
    height: var(--gradient-length);
    width: 100%
}

.marquee.horizontal>.marquee-overlay:after {
    transform: rotate(180deg)
}

.marquee.vertical>.marquee-overlay:after {
    transform: rotate(-180deg)
}

.marquee>.marquee-overlay:before {
    left: 0;
    top: 0
}

.marquee.horizontal>.marquee-overlay:after {
    right: 0;
    top: 0
}

.marquee.vertical>.marquee-overlay:after {
    left: 0;
    bottom: 0
}

@keyframes scrollX {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-100%);
    }
}

@keyframes scrollY {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(-100%);
    }
}
</style>