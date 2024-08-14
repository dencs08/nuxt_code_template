import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(3).max(25),
  lastName: z.string().min(3).max(25),
  phone: z.string().min(9).max(15),
});

export default userSchema;
