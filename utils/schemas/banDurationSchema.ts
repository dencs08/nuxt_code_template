import { z } from "zod";

const banDurationSchema = z.object({
  duration: z.string().refine(
    (value) => {
      const regex = /^(\d+([dhms]|ms|us|ns))+$/;
      if (!regex.test(value)) return false;

      const parts = value.match(/(\d+)([dhms]|ms|us|ns)/g);
      if (!parts) return false;

      const uniqueUnits = new Set(parts.map((part) => part.replace(/\d+/, "")));
      return uniqueUnits.size === parts.length; // Ensure each unit is used only once
    },
    {
      message:
        "Invalid duration format. Use a combination of numbers followed by time units (ns, us, ms, s, m, h). Each unit should be used only once.",
    }
  ),
});

export default banDurationSchema;
