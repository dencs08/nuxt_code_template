import anime, {
  type AnimeParams,
  type AnimeInstance,
  type AnimeTimelineInstance,
} from "animejs";

export const useAnimations = () => {
  const defaultDuration = 1000;
  const defaultEasing = "easeOutElastic(1, .5)";

  const fadeIn = (
    targets: AnimeParams["targets"],
    options: Partial<AnimeParams> = {}
  ): AnimeInstance => {
    return anime({
      targets,
      opacity: [0, 1],
      duration: options.duration || defaultDuration,
      easing: options.easing || defaultEasing,
      ...options,
    });
  };

  const fadeOut = (
    targets: AnimeParams["targets"],
    options: Partial<AnimeParams> = {}
  ): AnimeInstance => {
    return anime({
      targets,
      opacity: [1, 0],
      duration: options.duration || defaultDuration,
      easing: options.easing || defaultEasing,
      ...options,
    });
  };

  const slideIn = (
    targets: AnimeParams["targets"],
    direction: "left" | "right" | "top" | "bottom" = "left",
    options: Partial<AnimeParams> = {}
  ): AnimeInstance => {
    const translations: Record<string, [string, string]> = {
      left: ["100%", "0%"],
      right: ["-100%", "0%"],
      top: ["100%", "0%"],
      bottom: ["-100%", "0%"],
    };

    return anime({
      targets,
      translateX:
        direction === "left" || direction === "right"
          ? translations[direction]
          : 0,
      translateY:
        direction === "top" || direction === "bottom"
          ? translations[direction]
          : 0,
      duration: options.duration || defaultDuration,
      easing: options.easing || defaultEasing,
      ...options,
    });
  };

  const scale = (
    targets: AnimeParams["targets"],
    options: Partial<AnimeParams> & { scale?: [number, number] } = {}
  ): AnimeInstance => {
    return anime({
      targets,
      scale: options.scale || [0, 1],
      duration: options.duration || defaultDuration,
      easing: options.easing || defaultEasing,
      ...options,
    });
  };

  const customAnimate = (
    targets: AnimeParams["targets"],
    properties: Partial<AnimeParams>,
    options: Partial<AnimeParams> = {}
  ): AnimeInstance => {
    return anime({
      targets,
      ...properties,
      duration: options.duration || defaultDuration,
      easing: options.easing || defaultEasing,
      ...options,
    });
  };

  const createTimeline = (options: AnimeParams = {}): AnimeTimelineInstance => {
    return anime.timeline({
      duration: options.duration || defaultDuration,
      easing: options.easing || defaultEasing,
      ...options,
    });
  };

  return {
    fadeIn,
    fadeOut,
    slideIn,
    scale,
    customAnimate,
    createTimeline,
    anime,
  };
};
