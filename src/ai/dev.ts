import { config } from 'dotenv';
config();

import '@/ai/flows/generate-maximal-pairs.ts';
import '@/ai/flows/generate-minimal-pairs.ts';
import '@/ai/flows/generate-multiple-oppositions.ts';
import '@/ai/flows/generate-cycles-targets.ts';
import '@/ai/flows/generate-complexity-targets.ts';
import '@/ai/flows/calculate-sonority-difference.ts';
import '@/ai/flows/transcribe-to-ipa.ts';
