<template>
    <div>
        <DashboardSidebar />
        <div class="lg:pl-64">
            <main class="pt-20 min-h-screen">
                <div class="px-4 sm:px-6 lg:px-8 pb-8">
                    <slot></slot>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped></style>