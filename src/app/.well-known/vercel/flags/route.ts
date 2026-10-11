import * as flags from '@/flags';
import { createFlagsDiscoveryEndpoint, getProviderData } from 'flags/next';

export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags));
