export default defineEventHandler(async (event) => {
  const storage = useStorage("cache");
  try {
    const handlerKeys = await storage.getKeys("nitro:handlers");
    const functionKeys = await storage.getKeys("nitro:functions");

    const cacheKeys = [...handlerKeys, ...functionKeys];

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
