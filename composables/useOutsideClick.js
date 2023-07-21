export default function useOutsideClick() {
    const dropdown = ref(null);
    const toggleButton = ref(null);
    const toggleValue = ref(false);

    onClickOutside(
        dropdown,
        (event) => {
            // Check if the clicked element is the toggle button or a child of the toggle button
            if (toggleButton.value.contains(event.target)) {
                return;
            }
            toggle();
        },
    );

    function toggle() {
        toggleValue.value = !toggleValue.value;
    }

    return { dropdown, toggleButton, toggleValue, toggle };
}