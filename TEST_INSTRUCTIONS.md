# Testing Instructions

## Start the Dev Server

1. Open a terminal/PowerShell in the project directory
2. Run:
   ```bash
   npm run dev
   ```
3. You should see output like:
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```
4. Open the URL shown (usually http://localhost:5173) in your browser

## If you see errors:

- **Port already in use**: Try `npm run dev -- --port 3000` to use a different port
- **Module not found**: Run `npm install` to ensure all dependencies are installed
- **TypeScript errors**: Check the error message and let me know what it says

## Quick Test Checklist:

1. ✅ App loads without errors
2. ✅ Header shows "Switch Week" dropdown and "New Week" button
3. ✅ Click "New Week" → Date picker modal opens
4. ✅ Select start and end dates → Click "Create Week"
5. ✅ Week switches and day cards update
6. ✅ Switch between weeks using dropdown
7. ✅ Tasks persist when switching weeks

