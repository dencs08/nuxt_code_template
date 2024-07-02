import { z } from 'zod';
import {userSchema} from '@/utils/schemas';

export type UserForm = z.infer<typeof userSchema>;
