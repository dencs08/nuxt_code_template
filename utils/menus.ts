export function useNavigation() {
    const localePath = useLocalePath()

    const navigation = computed(() => [
        { name: 'Kontakt', to: localePath('/contact') },
    ])

    const legal = computed(() => [
        { name: 'Polityka prywatności', href: localePath('/privacy-policy') },
        { name: 'Warunki korzystania', href: localePath('/terms-and-conditions') },
        { name: 'Polityka ciasteczek', href: localePath('/cookies-policy')},
        { name: 'Ustawienia ciasteczek', href: localePath('/contact') },
    ])

    const social = computed(() => [
        {
            name: 'Facebook',
            href: '#',
            icon: 'ic:round-facebook'
        },
        {
            name: 'Instagram',
            href: '#',
            icon:  'mdi:instagram'
        },

        {
            name: 'LinkedIn',
            href: '#',
            icon:  'mdi:linkedin'
        },
    ])

    const dashboardNavigation = computed(() =>[
        {
            name: 'Main',
            items: [
                {
                    name: 'Dashboard',
                    to: localePath('/dashboard/home'),
                    icon: 'ic:round-home'
                },
                {
                    name: 'Reports',
                    to: localePath('/dashboard/reports'),
                    icon: 'ic:round-data-saver-off',
                    children: [
                        {
                            name: 'test',
                            to: localePath('/dashboard/reports/test')
                        },
                        {
                            name: 'test2',
                            to: localePath('/dashboard/reports/test2')
                        }
                    ]
                },
                {
                    name: 'Marketing',
                    to: localePath('/dashboard/marketing'),
                    icon: 'ic:round-people'
                },
            ]
        },
        {
            name: 'Administrative',
            items: [
                {
                    name: 'Users',
                    to: localePath('/dashboard/users'),
                    icon: 'ic:round-data-saver-off',
                    children: [
                        {
                            name: 'Create user',
                            to: localePath('/dashboard/users')
                        },
                    ]
                },
            ]
        }
    ])

    const dashboardSettings = computed(() =>[
        {
            name: 'Settings',
            items: [
                {
                    name: 'Settings',
                    to: localePath('/dashboard/settings'),
                    icon: 'ic:round-settings',
                    children: [
                        {
                            name: 'Sample settings',
                            to: localePath('/dashboard/settings')
                        },
                    ]
                },
            ]
        }
    ])

    return { navigation, legal, social, dashboardNavigation, dashboardSettings }
}