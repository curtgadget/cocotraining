import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  // No sessions needed; avoids the adapter requiring a KV namespace binding.
  session: false,
});
