/**
 * This script demonstrates the regression in Rsbuild 1.6.3
 * where mergeRsbuildConfig fails when passed undefined as the second parameter.
 * 
 * This worked correctly in 1.5.6 but fails in 1.6.3+
 */

const { mergeRsbuildConfig } = require('@rsbuild/core');

console.log('Testing mergeRsbuildConfig with undefined parameter...\n');

const baseConfig = {
  output: {
    distPath: {
      root: 'dist'
    }
  },
  server: {
    port: 3000
  }
};

// Simulate a scenario where config override might be undefined
// This is common in monorepos where not all apps have custom configs
const configOverrides = {
  'app-with-override': {
    server: { port: 3001 }
  }
  // Note: 'default-app' doesn't have an override
};

const appName = 'default-app'; // This app doesn't exist in configOverrides
const overrideConfig = configOverrides[appName]; // Returns undefined

console.log('Base config:', JSON.stringify(baseConfig, null, 2));
console.log('Override config:', overrideConfig);
console.log('\nAttempting to merge...\n');

try {
  const merged = mergeRsbuildConfig(baseConfig, overrideConfig);
  console.log('✅ Success! Merged config:', JSON.stringify(merged, null, 2));
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('\nThis is a regression in 1.6.3!');
  console.error('Workaround: Check if override is defined before calling mergeRsbuildConfig');
  process.exit(1);
}
