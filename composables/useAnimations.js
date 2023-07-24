export function useAnimations() {
    const animation = ({type, delay, index = 0, visible = false}) => {
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
                delay: (delay + (100 * index + 1)),
                type: 'easeInOut',
                stiffness: 1250,
                damping: 100,
                mass: 0.2,
                opacity: {
                    delay: (delay + (100 * index + 1)),
                    duration: type === 'fade' ? 500 : 250,
                },
            }
        };

        return {
            initial: directionConfig[type].initial,
            [visible ? "visibleOnce" : "enter"]: {
                ...directionConfig[type].enter,
                ...transition
            }
        };
    };

    const slideTop = (params) => animation({...params, type: 'top'});
    const slideLeft = (params) => animation({...params, type: 'left'});
    const slideRight = (params) => animation({...params, type: 'right'});
    const slideBottom = (params) => animation({...params, type: 'bottom'});
    const pop = (params) => animation({...params, type: 'pop'});
    const fade = (params) => animation({...params, type: 'fade'});

    return { slideTop, slideLeft, slideRight, slideBottom, pop, fade };
}
