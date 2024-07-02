import { z } from 'zod';
import {registerSchema} from '@/utils/schemas';

export type RegisterForm = z.infer<typeof registerSchema>;