<template>
  <div>
    <ConfirmActionDialog
      v-model:visible="isVisible"
      :config="config"
      @confirm="handleConfirm"
      @reject="handleReject"
    />
    <ConfirmPopup group="popup"></ConfirmPopup>
    <ConfirmDialog></ConfirmDialog>

    <ExtendedConfirmDialog
      group="changes"
      :pt="{ root: { class: 'xs:w-[35rem]' } }"
    >
      <template #body="{ message }">
        <div v-for="(user, index) in message.message" :key="index" class="mt-4">
          <div class="flex gap-1">
            <p class="font-semibold text-surface-700 dark:text-surface-50">
              {{ user.email }}
            </p>
            <p
              class="text-xs font-light text-surface-600 dark:text-surface-100/75"
            >
              ({{ user.userName }}):
            </p>
          </div>
          <ul class="list-decimal list-inside">
            <li
              v-for="(change, i) in user.changes"
              :key="i"
              class="flex items-center gap-2 ml-2"
            >
              <i class="pi pi-circle-fill text-primary-500 text-[4px]"></i>
              <p class="text-surface-600 dark:text-surface-200">
                {{ change.key }}:
              </p>
              <p class="text-surface-700 dark:text-surface-0 font-bold">
                {{ change.oldValue }}
              </p>
              <i class="pi pi-arrow-right text-xs text-primary-500"></i>
              <p class="text-surface-700 dark:text-surface-0 font-bold">
                {{ change.newValue }}
              </p>
            </li>
          </ul>
        </div>
      </template>
    </ExtendedConfirmDialog>

    <ExtendedConfirmDialog
      group="password"
      :pt="{ root: { class: 'xs:w-[35rem]' } }"
    >
      <template #body="{ message }">
        <div class="text-sm">
          {{ message.message }}
        </div>
        <div class="w-full mt-4">
          <p class="text-xs mb-1">Type your password to confirm the action:</p>
          <Password
            v-model="password"
            toggleMask
            :feedback="false"
            placeholder="Password"
          />
        </div>
      </template>

      <template #footer="{ message, acceptCallback, rejectCallback }">
        <div
          class="flex items-center justify-end gap-2 p-4 border-t bg-surface-50/40 dark:bg-surface-900/35 border-surface-100 dark:border-surface-600"
        >
          <Button
            label="Confirm"
            @click="checkPassword(acceptCallback, rejectCallback)"
            :class="message.acceptClass"
          ></Button>
          <Button
            label="Cancel"
            outlined
            severity="secondary"
            @click="rejectCallback"
          ></Button>
        </div>
      </template>
    </ExtendedConfirmDialog>
  </div>
</template>
<script setup lang="ts">
const { isVisible, config, handleConfirm, handleReject } = useGlobalDialog();

const { verifyPassword } = useAuthentication();
const { addToast } = useToastService();
const { CustomError } = useCustomError();

const password = ref();
const checkPassword = async (
  acceptCallback: Function,
  rejectCallback: Function
) => {
  try {
    if (!password.value)
      throw new CustomError("Password is required", "PASSWORD_REQUIRED");
    await verifyPassword(password.value);
    addToast(
      "success",
      "Account deletion confirmed",
      "Your account will now be permanentaly deleted, you will be logged out automatically.",
      30000
    );
    acceptCallback();
  } catch (error: any) {
    addToast("error", "Account deletion failed", error.message);
  }
};
</script>
<style lang="scss"></style>
