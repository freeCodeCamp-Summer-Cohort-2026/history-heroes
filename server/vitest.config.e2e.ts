import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * The e2e config relies on supertest, allowing vite tests to test
 * against a live test database instance that is brought up just for testing. This is a more realistic test than unit tests, as it tests the entire back-end stack.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    // this is required as to not cause issues with the e2e testing, which hits the same DB instance for all e2e specs.
    fileParallelism: false,
    include: ['**/*.e2e-spec.ts'],
    globalSetup: ['./test/global-setup.e2e.ts'],
    env: {
      DATABASE_STORAGE: 'data/test.sqlite',
    },
  },
});
