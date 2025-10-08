# Validation & Quality Checks

This project uses automated checks to prevent broken code from being deployed.

## 🛡️ Protection Layers

### 1. **Pre-Commit Hook** (Fast - ~2 seconds)
Runs automatically on `git commit`:
- ✅ ESLint checks
- ✅ Code formatting validation

**Bypass** (not recommended):
```bash
git commit --no-verify
```

---

### 2. **Pre-Push Hook** (Thorough - ~10 seconds)
Runs automatically on `git push`:
- ✅ ESLint checks
- ✅ TypeScript type checking
- ✅ Build validation

**Bypass** (not recommended):
```bash
git push --no-verify
```

---

### 3. **Vercel Build** (Final - ~2 minutes)
Runs on every push to main:
- ✅ Full production build
- ✅ Model download test
- ✅ Type checking
- ✅ Linting

**Cannot be bypassed** - ensures deployment safety.

---

## 📝 Manual Validation Commands

### Quick Lint Check
```bash
npm run lint
```

### Auto-Fix Lint Issues
```bash
npm run lint:fix
```

### Type Check
```bash
npm run type-check
```

### Full Validation (Pre-Push)
```bash
npm run validate
```

### Test Everything
```bash
npm test
```

---

## 🔧 Common Issues & Fixes

### ESLint Errors

**Problem:**
```
Error: Unexpected any. Specify a different type.
```

**Fix:**
```typescript
// ❌ Bad
.forEach((r: any) => ...)

// ✅ Good
.forEach((r) => ...)  // Let TypeScript infer
```

---

**Problem:**
```
Warning: 'variableName' is defined but never used.
```

**Fix:**
```javascript
// Remove the unused import/variable
```

---

### Type Errors

**Problem:**
```
Type 'X' is not assignable to type 'Y'
```

**Fix:**
1. Check the type definition
2. Add proper type annotations
3. Use type assertions if necessary: `value as Type`

---

### Husky Not Running

**Problem:** Git hooks not triggering

**Fix:**
```bash
# Reinstall husky
npm run prepare

# Verify hooks exist
ls -la .husky/
```

---

## 🚀 Recommended Workflow

### Before Starting Work
```bash
git pull
npm install
npm run download-model  # If needed
```

### During Development
```bash
npm run dev  # Start dev server

# In another terminal, watch for issues
npm run lint  # Check periodically
```

### Before Committing
```bash
# Auto-fix what you can
npm run lint:fix

# Check everything
npm run validate

# If all pass, commit
git add .
git commit -m "Your message"
```

### Before Pushing
```bash
# Pre-push hook runs automatically
git push origin main

# Or run validation manually first
npm run validate && git push
```

---

## 📊 What Each Check Does

| Check | Speed | What It Catches | When It Runs |
|-------|-------|----------------|--------------|
| **ESLint** | Fast (~2s) | Code style, unused vars, `any` types | Pre-commit |
| **TypeScript** | Medium (~5s) | Type errors, missing types | Pre-push |
| **Build** | Slow (~30s) | Import errors, build failures | Pre-push |
| **Tests** | Variable | Logic errors, regressions | Manual |

---

## 🎯 Strict Mode Recommendations

For extra safety, add these to your workflow:

### Pre-Commit (Already Enabled)
- ✅ Lint checking

### Pre-Push (Already Enabled)
- ✅ Lint + Type check

### Optional: Add Tests to Pre-Push
```bash
# Edit .husky/pre-push
npm run validate && npm test
```

⚠️ **Warning:** This adds ~10 seconds to push time

---

## 🔍 Debugging Failed Checks

### Check Failed: ESLint

1. See specific errors:
   ```bash
   npm run lint
   ```

2. Auto-fix if possible:
   ```bash
   npm run lint:fix
   ```

3. Review changes and commit

### Check Failed: TypeScript

1. See type errors:
   ```bash
   npm run type-check
   ```

2. Fix types manually (no auto-fix)

3. Re-run to verify:
   ```bash
   npm run type-check
   ```

### Check Failed: Build

1. Try building locally:
   ```bash
   npm run build:local
   ```

2. Check for:
   - Missing dependencies
   - Import path errors
   - Environment issues

---

## 💡 Tips

### Skip Checks for Hotfixes (Emergency Only)
```bash
# Skip pre-commit
git commit --no-verify

# Skip pre-push
git push --no-verify
```

⚠️ **Use sparingly** - Vercel will still fail if there are errors.

### Run All Checks Before Big Changes
```bash
npm run validate && npm test
```

### Keep Dependencies Updated
```bash
npm outdated
npm update
```

---

## 🏆 Best Practices

1. **Always run `npm run validate` before pushing**
2. **Never bypass hooks unless emergency**
3. **Fix lint errors immediately** - don't accumulate tech debt
4. **Use `npm run lint:fix`** for auto-fixable issues
5. **Test locally before pushing** to save CI time

---

## 📦 Files in This System

- `.husky/pre-commit` - Fast lint checks
- `.husky/pre-push` - Full validation
- `package.json` - Validation scripts
- `eslint.config.mjs` - Linting rules
- `tsconfig.json` - TypeScript config

---

## 🔄 CI/CD Pipeline

```
Local Dev
   ↓
Pre-Commit Hook (ESLint)
   ↓
Git Commit
   ↓
Pre-Push Hook (Validate)
   ↓
Git Push
   ↓
Vercel Build (Full Check)
   ↓
Deployment ✅
```

---

**Last Updated:** 2025-10-08
**Maintained By:** Development Team
