<template>
    <teleport to="body">
        <transition-group name="fade" tag="div">
            <!-- Dynamic notifications -->
            <div v-for="toast in toasts" :key="my_toast.id" :style="{ top: `${my_toast.position + 10}px` }"
                 @click="removeToast(my_toast.id)" class="fixed right-1 z-[10000] min-w-[200px] w-full max-w-[350px]">
                <div class="px-4">
                    <div :class="{
                        'pointer-events-auto w-full overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5': true,
                        'bg-white': my_toast.type === 'default',
                        'bg-green-400': my_toast.type === 'success',
                        'bg-red-400': my_toast.type === 'danger',
                        'bg-yellow-400': my_toast.type === 'info',
                    }">
                        <div class="p-4 flex gap-2">
                            <div class="flex items-center">
                                <Icon v-if="my_toast.type === 'success'" name="ic:round-check-circle-outline"
                                      class="h-5 w-5 text-gray-100" />
                                <Icon v-if="my_toast.type === 'danger'" name="ic:round-error-outline"
                                      class="h-5 w-5 text-gray-100" />
                                <Icon v-if="my_toast.type === 'info'" name="ic:round-info" class="h-5 w-5 text-gray-100" />
                            </div>
                            <div :class="{
                                'text-white': my_toast.type === 'info' || my_toast.type === 'success' || my_toast.type === 'danger',
                                'text-gray-900': my_toast.type === 'default',
                            }">
                              {{ my_toast.message }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition-group>
    </teleport>
</template>
<script setup>
// const { toasts, removeToast } = useToast();
</script>