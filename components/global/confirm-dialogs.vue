<template>
    <div>
        <ConfirmPopup group="popup"></ConfirmPopup>
        <ConfirmDialog></ConfirmDialog>

        <ExtendedConfirmDialog group="changes" :pt="{ root: { class: 'xs:w-[35rem]' } }">
            <template #body="{ message }">
                <div v-for="(user, index) in message.message" :key="index" class="mt-4">
                    <div class="flex gap-1">
                        <p class="font-semibold text-surface-700 dark:text-surface-50 ">{{ user.email }}</p>
                        <p class="text-xs font-light text-surface-600 dark:text-surface-100/75">({{
                            user.userName }}):</p>
                    </div>
                    <ul class="list-decimal list-inside">
                        <li v-for="(change, i) in user.changes" :key="i" class="flex items-center gap-2 ml-2">
                            <i class="pi pi-circle-fill text-primary-500 text-[4px]"></i>
                            <p class="text-surface-600 dark:text-surface-200">{{ change.key }}:</p>
                            <p class="text-surface-700 dark:text-surface-0 font-bold"> {{ change.oldValue }}</p>
                            <i class="pi pi-arrow-right text-xs text-primary-500"></i>
                            <p class="text-surface-700 dark:text-surface-0 font-bold"> {{ change.newValue }}</p>
                        </li>
                    </ul>
                </div>
            </template>
        </ExtendedConfirmDialog>

        <ExtendedConfirmDialog group="password" :pt="{ root: { class: 'xs:w-[35rem]' } }">
            <template #body="{ message }">
                <div class="text-sm">
                    {{ message.message }}
                </div>
                <div class="w-full mt-2">
                    <p class="text-xs mb-1">Type your password to confirm the action:</p>
                    <Password v-model="password" toggleMask :feedback="false" placeholder="Password" :pt="{
                        input: { class: 'w-full' },
                    }" />
                </div>
            </template>
        </ExtendedConfirmDialog>
    </div>
</template>
<script setup>
const password = ref('');
const checkPassword = (acceptCallback, rejectCallback) => {
    const correctPassword = 'correctPassword'; // Replace with the correct password
    if (password.value === correctPassword) {
        acceptCallback();
    } else {
        rejectCallback();
    }
};
</script>
<style lang="scss"></style>