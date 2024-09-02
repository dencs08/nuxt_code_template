import { defineWrappedResponseHandler } from "../../../../../server/utils/defaultHandler";
import { getBackendClient } from "~~/lib/backend";

// export default defineWrappedResponseHandler(async (event) => {
//   const client = await getBackendClient(event, true);

//   try {
//     const response = await client.getRoles();
//     // const response = await getRoles(event);

//     return response;
//   } catch (err: any) {
//     throw createError({
//       statusCode: err.code,
//       statusMessage: err.message,
//     });
//   }
// }, 0);

export default defineEventHandler(async (event) => {
  const client = await getBackendClient(event, false);

  try {
    const response = await client.getRoles();
    return { response };
  } catch (err: any) {
    throw createError({
      statusCode: err.code,
      statusMessage: err.message,
    });
  }
});
