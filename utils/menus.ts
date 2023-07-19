export function useNavigation() {
    const localePath = useLocalePath()

    const navigation = computed(() => [
        { name: 'Test', to: localePath('/lang-test') },
        { name: 'Tt', to: localePath('/te-st') },
    ])

    return { navigation }
}