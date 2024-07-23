export default {
    root: {
        class: [
            // Shape
            'rounded-md',

            // Spacing
            'py-2 pr-4 pl-1',

            // Color
            // 'bg-surface-0 dark:bg-surface-900',
            // 'border border-surface-200 dark:border-surface-700',

            // Misc
            'overflow-x-auto'
        ]
    },
    menu: {
        class: [
            // Flex & Alignment
            'flex items-center flex-nowrap',

            // Spacing
            'm-0 p-0 list-none leading-none'
        ]
    },
    action: {
        class: [
            // Flex & Alignment
            'flex items-center',

            // Shape
            'rounded-md',

            // Color
            'text-surface-600 dark:text-white/70',

            // States
            'focus-visible:outline-none focus-visible:outline-offset-0',
            'focus-visible:ring focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50',

            // Transitions
            'transition-shadow duration-200',

            // Misc
            'text-decoration-none'
        ]
    },
    icon: {
        class: 'text-surface-600 dark:text-white/70'
    },
    separator: {
        class: [
            // Flex & Alignment
            'flex items-center',

            // Spacing
            'mx-1 scale-75',

            // Color
            'text-surface-500 dark:text-surface-200/50'
        ]
    }
};
