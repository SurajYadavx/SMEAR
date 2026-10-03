# Migration Backup - Smear Catalog Integration

**Date:** 2026-10-03
**Reason:** Migration to the new, clean, normalized Smear Pathology JSON catalog, removing all dependencies on the raw legacy scraped BookMyTest/Metropolis source structures.

## Files Backed Up
- `src/cart.js`
- `src/packages.js`
- `src/package-detail.js`
- `src/blood-tests.js`
- `src/global-search.js`

## Rollback Instructions
To rollback the frontend to the pre-migration state:
1. Copy the contents of this backup's `src/` folder back into the root `src/` folder, overwriting the modified files.
2. The legacy `public/data/` files (e.g. `packages.json`, `health-tests.json`) have been intentionally left in place and will be utilized by the legacy frontend code again.
