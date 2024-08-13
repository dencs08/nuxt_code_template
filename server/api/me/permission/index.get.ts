import { getBackendClient } from "~~/lib/backend";
import { defineWrappedResponseHandler } from "~~/server/utils/defaultHandler";

export default defineWrappedResponseHandler(async (event) => {
  const client = await getBackendClient(event, true);

  try {
    const permissions = await client.getMePermissions();
    return permissions;
  } catch (error) {
    throw error;
  }
}, 0);

// export default defineEventHandler(async (event) => {
//   const client = await getBackendClient(event, true);
//   try {
//     const response = await client.getMePermissions();
//     return { response };
//   } catch (error: any) {
//     throw createError({
//       statusCode: error.code,
//       message: (error as Error).message,
//     });
//   }
// });
