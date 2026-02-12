---
name: investigate
description: Investigate a URL or page using Playwright browser
user_invocable: true
arguments:
  - name: url
    description: "URL or path to investigate (e.g., /agents, https://example.com)"
    required: true
---

# Browser Investigation

You are investigating **$ARGUMENTS.url** using playwright-cli.

## Steps

### 1. Resolve URL
- If the URL starts with `/`, prepend `http://localhost:3000`
- If the URL starts with `http`, use as-is
- Check if the dev server is running on :3000; if not, suggest `npm run dev`

### 2. Navigate
- Open and navigate: `playwright-cli open <url>`
- Take a screenshot: `playwright-cli screenshot`

### 3. Inspect
- Get the accessibility tree: `playwright-cli snapshot`
- Check for console errors: `playwright-cli console`
- Check for failed network requests: `playwright-cli network`

### 4. Report
- Summarize what you see: layout, content, errors
- If there are console errors or network failures, list them
- Suggest fixes if issues are found

## Notes
- Use `playwright-cli` commands, not MCP tools
- Take screenshots at each significant step
- Close the browser when done: `playwright-cli close`
