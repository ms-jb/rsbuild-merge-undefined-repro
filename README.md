# Rsbuild mergeRsbuildConfig Undefined Bug Reproduction

This repository demonstrates a regression in Rsbuild 1.6.3 where `mergeRsbuildConfig` fails when the second parameter is `undefined`.

## Issue

PR [#6496](https://github.com/web-infra-dev/rsbuild/pull/6496) fixed handling of undefined nested properties within config objects, but it doesn't handle the case where the entire `config` parameter passed to `mergeRsbuildConfig` is `undefined`.

**This is a regression** - the same code worked correctly in Rsbuild 1.5.6.

## Reproduce

```bash
npm install
node reproduce-bug.cjs
```

### Expected Output (1.5.6)

```
✅ Success! Merged config: { output: { distPath: { root: 'dist' } }, server: { port: 3000 } }
```

### Actual Output (1.6.3)

```
❌ Error: Cannot destructure property 'dev' of 'config' as it is undefined.
```

## Scenario

This commonly occurs in monorepos where:
1. A build script manages multiple apps
2. Config overrides are stored in a map
3. Some apps don't have custom overrides (returns `undefined`)

```javascript
const configOverrides = {
  'app-with-override': { server: { port: 3001 } }
  // 'default-app' has no override
};

const appName = 'default-app';
const override = configOverrides[appName]; // undefined

// This fails in 1.6.3
mergeRsbuildConfig(baseConfig, override);
```

## Workaround

Add a guard condition:

```javascript
const merged = overrideConfig 
  ? mergeRsbuildConfig(baseConfig, overrideConfig) 
  : baseConfig;
```

## Environment

- @rsbuild/core: 1.6.3
- Node: 20.x
- OS: Linux/Ubuntu

## Related

- PR #6496 - Fixed nested undefined properties but not root-level undefined config parameter
