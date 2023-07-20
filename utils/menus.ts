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

    return { navigation, legal, social }
}