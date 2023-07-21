<template>
    <div>
        <DashboardSidebar />
        <div class="lg:pl-56">
            <main class="pt-20 min-h-screen">
                <div class="px-4 sm:px-6 lg:px-8 pb-8">
                    <Breadcrumbs class="mb-2"/>
                    <slot></slot>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped></style>