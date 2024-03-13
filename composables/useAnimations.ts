/**
 * `useAnimations` is a composable function that provides a set of animation methods.
 * Each method returns an animation configuration object that can be used with the `v-motion` directive in Vue templates.
 * 
 * @example
 * ```vue
 * <section class="container mx-auto min-h-screen grid place-content-center text-center">
 *   <h1 v-motion="slideTop({ delay: 400 })">
 *     Some h1 text
 *   </h1>
 *   <div class="flex flex-row gap-2 justify-center">
 *     <p v-for="(word, index) in words" :key="index" class="text-2xl"
 *       v-motion="fade({ delay: 500, index: index })">
 *       {{ word }}
 *     </p>
 *   </div>
 * </section>
 *
 * <script setup>
 * import { useAnimations } from '@/path/to/useAnimations';
 *
 * const { slideTop, slideLeft, slideRight, fade, slideBottom } = useAnimations();
 * const words = ['hello', 'こんにちは', 'bonjour', 'hej', 'hola', 'ciao'];
 * </script>
 * ```
 * 
 * @returns {Object} An object containing the following methods:
 * - `slideTop(params: AnimationParams)`: Returns an animation configuration for a slide from top animation.
 * - `slideLeft(params: AnimationParams)`: Returns an animation configuration for a slide from left animation.
 * - `slideRight(params: AnimationParams)`: Returns an animation configuration for a slide from right animation.
 * - `slideBottom(params: AnimationParams)`: Returns an animation configuration for a slide from bottom animation.
 * - `pop(params: AnimationParams)`: Returns an animation configuration for a pop animation.
 * - `fade(params: AnimationParams)`: Returns an animation configuration for a fade animation.
 * 
 * Each method accepts an `AnimationParams` object as a parameter, which has the following properties:
 * - `animationType: AnimationType`: The type of the animation. Can be 'top', 'left', 'right', 'bottom', 'pop', or 'fade'.
 * - `type: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear'`: The easing type of the animation. Defaults to 'easeInOut'.
 * - `delay: number`: The delay before the animation starts, in milliseconds.
 * - `index: number`: The index of the element, used to calculate the delay for staggered animations. Defaults to 0.
 * - `interval: number`: Delay between staggered elements in the animation in milliseconds. Defaults to 100.
 * - `visible: boolean`: If true, the animation will only play once when the element becomes visible. Defaults to false.
 * - `duration: number`: The duration of the animation, in milliseconds. Defaults to 250.
 * - `stiffness: number`: The stiffness of the animation. Defaults to 1250.
 * - `damping: number`: The damping of the animation. Defaults to 100.
 * - `mass: number`: The mass of the animation. Defaults to 0.2.
 */

interface AnimationParams {
    animationType?: AnimationType;
    type?: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear';
    delay?: number;
    index?: number;
    interval?: number;
    visible?: boolean;
    duration?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
}

type AnimationType = 'top' | 'left' | 'right' | 'bottom' | 'pop' | 'fade';

export function useAnimations() {
    const animation = ({animationType,type = 'easeInOut', delay = 0, index = 0, interval = 100, visible = false, duration = 250, stiffness = 1250, damping = 100, mass = 0.2}: AnimationParams) => {
        const directionConfig = {
            top: {initial: {y:-100, opacity: 0}, enter: {y:0, opacity:1}},
            left: {initial: {x:-100, opacity: 0}, enter: {x:0, opacity:1}},
            right: {initial: {x:100, opacity: 0}, enter: {x:0, opacity:1}},
            bottom: {initial: {y:100, opacity: 0}, enter: {y:0, opacity:1}},
            pop: {initial: {scale: 0.5, opacity: 0}, enter: {scale: 1, opacity:1}},
            fade: {initial: {opacity: 0}, enter: {opacity:1}},
        };
        const transition = {
            transition: {
                delay: (delay + (interval * index + 1)),
                type: type,
                stiffness: stiffness,
                damping: damping,
                mass: mass,
                opacity: {
                    delay: (delay + (interval * index + 1)),
                    duration: duration,
                },
            }
        };

        return {
            initial: directionConfig[animationType as keyof typeof directionConfig].initial,
            [visible ? "visibleOnce" : "enter"]: {
                ...directionConfig[animationType as keyof typeof directionConfig].enter,
                ...transition
            }
        };
    };

    const slideTop = (params: AnimationParams) => animation({...params, animationType: 'top'});
    const slideLeft = (params: AnimationParams) => animation({...params, animationType: 'left'});
    const slideRight = (params: AnimationParams) => animation({...params, animationType: 'right'});
    const slideBottom = (params: AnimationParams) => animation({...params, animationType: 'bottom'});
    const pop = (params: AnimationParams) => animation({...params, animationType: 'pop'});
    const fade = (params: AnimationParams) => animation({...params, animationType: 'fade'});

    return { slideTop, slideLeft, slideRight, slideBottom, pop, fade };
}
