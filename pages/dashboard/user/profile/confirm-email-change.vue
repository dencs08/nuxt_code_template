<script setup lang="ts">
definePageMeta({
    layout: 'dashboard'
})

const { confirmEmailChange } = useAccount();
const { addToast } = useToastService();
const localePath = useLocalePath()
const status = ref({ completed: false, error: false, showCompleted: false });
onMounted(async () => {
    try {
        await confirmEmailChange();
        addToast('success', 'Email change confirmed', 'Your email has been successfully changed');
        setTimeout(() => {
            status.value.showCompleted = true;
        }, 500);
        status.value.completed = true;
        setTimeout(() => {
            navigateTo(localePath('/dashboard/profile'));
        }, 5500);
    } catch (error) {
        setTimeout(() => {
            status.value.showCompleted = true;
        }, 500);
        status.value.completed = true;
        status.value.error = true;
        addToast('error', 'Email change failed', 'Your email change failed');
    }
})
</script>

<template>
    <div class="">
        <div v-auto-animate class="grid place-content-center h-64 text-center">
            <div v-if="!status.completed">
                <div>
                    <h3 class="text-2xl mb-2">Confirming your email change...</h3>
                    <h4 class="mb-4">Please <b>stay on this page</b> until its completed.</h4>
                    <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
                </div>
            </div>
            <div v-if="status.showCompleted">
                <div v-if="!status.error">
                    <Icon name="ic:outline-check-circle-outline" class="text-6xl mb-2 text-green-500"></Icon>
                    <h3 class="text-2xl mb-2">Email change confirmed</h3>
                    <h4 class="mb-4">You will be redirected to your profile page in a second.</h4>
                </div>
                <div v-else>
                    <Icon name="ic:baseline-error-outline" class="text-6xl mb-2 text-red-500"></Icon>
                    <h3 class="text-2xl mb-2">Email change <span class="font-bold">failed</span></h3>
                    <h4 class="mb-4">You can try again.
                        <nuxt-link :to="localePath('/dashboard/profile')" class="text-blue-500 hover:underline"
                            @click.prevent="confirmEmailChange">here</nuxt-link>
                        or contact us for help
                        <nuxt-link :to="localePath('/contact')" class="text-blue-500 hover:underline">here</nuxt-link>
                    </h4>
                </div>
            </div>
        </div>
    </div>
</template>
