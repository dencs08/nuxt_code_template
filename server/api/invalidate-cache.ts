export default defineEventHandler(async (event) => {
  const storage = useStorage("cache");
  try {
    // Fetch keys for both nitro:handlers and nitro:functions
    const handlerKeys = await storage.getKeys("nitro:handlers");
    const functionKeys = await storage.getKeys("nitro:functions");

    // Combine both sets of keys
    const cacheKeys = [...handlerKeys, ...functionKeys];

    // Remove all cache items concurrently
    await Promise.all(cacheKeys.map((element) => storage.removeItem(element)));

    return { success: true };
  } catch (error: any) {
    console.error("Error invalidating cache:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to invalidate cache",
    });
  }
});
