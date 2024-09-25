import { z } from "zod";
const uploadSchema = z.object({
  file: z.string(),
  contentType: z.string(),
});

export default uploadSchema;
