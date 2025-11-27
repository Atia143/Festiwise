Integration testing for /api/submit

Overview

This document explains how to test the internal form proxy endpoint `POST /api/submit` locally.

Prerequisites

- Node.js installed (v16+ recommended)
- Project dependencies installed: `npm install`
- Dev server available: `npm run dev` (default port 3000)

Options

A) Test the proxy behavior (recommended):
- The proxy expects a server-only environment variable `WEB3FORMS_ACCESS_KEY` if you want the proxy to forward to Web3Forms.
- Set the key in your shell (do NOT commit this to source control):

```bash
export WEB3FORMS_ACCESS_KEY="your-web3forms-access-key"
```

- Start the dev server:

```bash
npm run dev
```

- Run the test script that posts to the local proxy:

```bash
node scripts/test-submit.js
```

This will POST a JSON payload to `http://localhost:3000/api/submit` and print the response.

B) Test the proxy without forwarding to Web3Forms:
- If you do not set `WEB3FORMS_ACCESS_KEY`, the proxy will respond with an error indicating misconfiguration.
- This still validates the routing, validation, and rate-limiting behavior.

C) Using curl (quick check):

```bash
curl -i -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","message":"hello from curl","subject":"curl test"}'
```

Notes

- The proxy includes a simple in-memory rate limiter (5 requests/min per IP) — for repeated tests, wait or adjust the script.
- For CI or staging tests, add `WEB3FORMS_ACCESS_KEY` as a secret in the environment and run the same script against your staging URL.
- If you want me to run the test here, please provide a test `WEB3FORMS_ACCESS_KEY` (or instruct me to proceed without forwarding), and confirm you want me to run the dev server and execute the script from this environment.
