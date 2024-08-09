// composables/useBusiness.ts
import publicConfig from "@/config/common/business";

export const useBusiness = () => {
  const name = ref(publicConfig.businessName);
  const url = ref(publicConfig.businessUrl);

  const email = ref(publicConfig.businessEmail);
  const phone = ref(publicConfig.businessPhone);

  const city = ref(publicConfig.businessCity);
  const zip = ref(publicConfig.businessZip);
  const street = ref(publicConfig.businessStreet);

  const address = computed(() => {
    return `${street.value}, ${zip.value} ${city.value}`;
  });

  const supportEmail = ref(publicConfig.businessSupportEmail);

  // Return all the refs and computed properties
  return {
    name,
    url,
    email,
    phone,
    city,
    zip,
    street,
    address,
    supportEmail,
  };
};
