<template>
  <footer aria-labelledby="footer-heading">
    <hr class="w-full text-black" />
    <div class="container mx-auto py-10">
      <div class="flex flex-row justify-between items-center">
        <div class="h-auto w-24">
          <Logo />
        </div>
        <I18nDropdown />
      </div>
      <hr class="w-full text-black my-10" />
      <div class="xl:grid xl:grid-cols-3 xl:gap-8">
        <div class="grid gap-8 xl:col-span-2">
          <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-12 xl:gap-2">
            <div v-for="(items, category) in links" :key="category">
              <h3 class="text-sm font-semibold leading-6 text-gray-900 capitalize">{{ category }}</h3>
              <ul role="list" class="mt-6 space-y-4 list-none">
                <li v-for="li in items" :key="li.name">
                  <NuxtLink :to="li.href" class="text-sm leading-6 text-gray-600 hover:text-gray-900">{{ li.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-10 xl:mt-0">
          <h3 class="text-sm font-semibold leading-6 text-gray-900">Newsteller</h3>
          <p class="mt-2 text-sm leading-6 text-gray-600 mb-3">Najnowsze wiadomości, informacje z IT, oferty pracy i
            kursy.</p>
          <!-- <FormWrapper :handleSubmit="onSubmit" :submit-attrs="{ inputClass: 'w-full sm:w-auto md:w-1/2 btn-primary' }"
            submit-label="Sign in">
            <template #default="{ getNode }">
              <div class="mb-1.5">
                <FormKit class="w-full" type='primeInputText' name='email' validation='required' placeholder='Email'
                  @node="getNode" />
              </div>
            </template>
</FormWrapper> -->
        </div>
      </div>
      <div class="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
        <div class="flex space-x-6 md:order-2">
          <a v-for="item in social" :key="item.name" :href="item.href"
            class="text-gray-400 hover:text-primary-500 hover:scale-110 transition-all">
            <span class="sr-only">{{ item.name }}</span>
            <Icon :name="item.icon" class="h-6 w-auto" />
          </a>
        </div>
        <p class="mt-8 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
          &copy; {{ currentYear }} Wszelkie prawa zastrzeżone.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { legal, social } = useNavigation();

const currentYear = computed(() => new Date().getFullYear());

const links = ref(
  {
    solutions: [
      { name: 'Kategoria 1', href: '#' },
      { name: 'Kategoria 2', href: '#' },
      { name: 'Kategoria 3', href: '#' },
      { name: 'Kategoria 4', href: '#' },
    ],
    support: [
      { name: 'Kategoria 1', href: '#' },
      { name: 'Kategoria 2', href: '#' },
      { name: 'Kategoria 3', href: '#' },
      { name: 'Kategoria 4', href: '#' },
    ],
    company: [
      { name: 'Kategoria 1', href: '#' },
      { name: 'Kategoria 2', href: '#' },
      { name: 'Kategoria 3', href: '#' },
      { name: 'Kategoria 4', href: '#' },
    ],
    legal: []
  }
);

links.value.legal = legal.value;

const onSubmit = async (data) => {
  // const response = await handleSubmit(authStore.logout, data, 'User successfully logged out');
}
</script>