#!/usr/bin/env node
/**
 * Small integration test for /api/submit
 * Usage:
 *   1. Start your dev server: `npm run dev` (listening on http://localhost:3000)
 *   2. Set env var locally if you want to test forwarding to Web3Forms (server proxy requires WEB3FORMS_ACCESS_KEY):
 *      export WEB3FORMS_ACCESS_KEY="<your-key>"
 *   3. Run this script:
 *      node scripts/test-submit.js
 *
 * The script will post a JSON payload to http://localhost:3000/api/submit and print the response.
 */

const fetch = require('node-fetch');

const URL = process.env.TEST_SUBMIT_URL || 'http://localhost:3000/api/submit';

async function run() {
  console.log(`Posting to ${URL}`);

  const payload = {
    email: `test+${Date.now()}@example.com`,
    name: 'Integration Tester',
    subject: 'Integration Test - FestiWise',
    message: 'This is a test submission from the integration test script.'
  };

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('Status:', res.status);
    try {
      console.log('Response JSON:', JSON.parse(text));
    } catch {
      console.log('Response text:', text);
    }
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(1);
  }
}

run();
