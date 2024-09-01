<template>
  <footer aria-labelledby="footer-heading">
    <Divider />
    <div class="container mx-auto pt-5 md:pt-10">
      <div class="flex flex-row justify-between items-center">
        <div class="h-auto w-24">
          <Logo />
        </div>
        <I18nDropdown />
      </div>
      <Divider class="my-10" />
      <div class="xl:grid xl:grid-cols-3 xl:gap-8">
        <div class="grid gap-8 xl:col-span-2">
          <div
            class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-12 xl:gap-2"
          >
            <div v-for="(items, category) in links" :key="category">
              <h3
                class="text-sm font-semibold leading-6 text-gray-900 capitalize"
              >
                {{ category }}
              </h3>
              <ul role="list" class="mt-6 space-y-4 list-none">
                <li v-for="li in items" :key="li.label">
                  <NuxtLink
                    :to="li.route"
                    class="text-sm leading-6 text-gray-600 hover:text-gray-900"
                    >{{ li.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <SocialIcons class="flex mt-8 md:hidden" />
        <div class="mt-10 xl:mt-0">
          <h3 class="text-sm font-semibold leading-6 text-gray-900">
            Newsteller
          </h3>
          <p class="mt-2 text-sm leading-6 text-gray-600 mb-3">
            Najnowsze wiadomości, informacje z IT, oferty pracy i kursy.
          </p>
          <NewsletterInput />
        </div>
      </div>
      <Divider class="my-4 lg:my-6" />
      <div
        class="text-center md:flex md:items-center md:justify-between pb-4 lg:pb-6"
      >
        <div class="text-xs leading-5 text-gray-500">
          &copy; {{ currentYear }} Wszelkie prawa zastrzeżone.
        </div>
        <SocialIcons class="hidden md:flex" />
      </div>
    </div>
  </footer>
</template>

<script setup>
const { legalMenu } = useNavigation();

const currentYear = computed(() => new Date().getFullYear());

const links = ref({
  solutions: [
    { label: "Kategoria 1", route: "#" },
    { label: "Kategoria 2", route: "#" },
    { label: "Kategoria 3", route: "#" },
    { label: "Kategoria 4", route: "#" },
  ],
  support: [
    { label: "Kategoria 1", route: "#" },
    { label: "Kategoria 2", route: "#" },
    { label: "Kategoria 3", route: "#" },
    { label: "Kategoria 4", route: "#" },
  ],
  company: [
    { label: "Kategoria 1", route: "#" },
    { label: "Kategoria 2", route: "#" },
    { label: "Kategoria 3", route: "#" },
    { label: "Kategoria 4", route: "#" },
  ],
  legal: [],
});

links.value.legal = legalMenu.value;
</script>
