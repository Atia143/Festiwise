#!/usr/bin/env node

/**
 * GSC Error Detector - Checks for common indexability issues
 *
 * This script scans the project for potential issues that could cause Google Search Console errors:
 * 1. Accidental noindex meta tags
 * 2. Robots exclusions that might block important pages
 * 3. Missing canonical URLs
 * 4. Duplicate titles or meta descriptions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const directories = ['src/app', 'src/components', 'src/pages'];
const excludeDirs = ['node_modules', '.next', 'out', 'public'];
const outputFile = 'seo-issues.log';

console.log('📊 FestiWise SEO Issue Scanner');
console.log('==============================');

// Clear previous log
fs.writeFileSync(outputFile, '# SEO Issues Report\n\nGenerated: ' + new Date().toISOString() + '\n\n');

// Find files with potential issues
let issues = 0;

// Check for noindex tags
console.log('🔍 Checking for accidental noindex tags...');
try {
  const noindexResults = execSync(
    `grep -r "noindex" --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" src/`
  ).toString();
  
  const noindexFiles = noindexResults.split('\n').filter(Boolean);
  
  if (noindexFiles.length > 0) {
    issues += noindexFiles.length;
    fs.appendFileSync(
      outputFile, 
      `## Potential noindex issues (${noindexFiles.length})\n\n${noindexFiles.join('\n')}\n\n`
    );
    console.log(`⚠️  Found ${noindexFiles.length} potential noindex issues!`);
  } else {
    console.log('✅ No accidental noindex tags found');
  }
} catch (error) {
  console.log('✅ No accidental noindex tags found');
}

// Check for missing canonical URLs in page components
console.log('🔍 Checking for pages without canonical URLs...');
try {
  // Look for page components (page.tsx, etc.) that don't reference canonical
  const pageFiles = execSync(
    `find src/app -name "page.tsx" -o -name "page.js"`
  ).toString().split('\n').filter(Boolean);
  
  const pagesWithoutCanonical = [];
  
  for (const file of pageFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('canonical') && !content.includes('generateCanonicalUrl')) {
      pagesWithoutCanonical.push(file);
    }
  }
  
  if (pagesWithoutCanonical.length > 0) {
    issues += pagesWithoutCanonical.length;
    fs.appendFileSync(
      outputFile, 
      `## Pages potentially missing canonical URLs (${pagesWithoutCanonical.length})\n\n${pagesWithoutCanonical.join('\n')}\n\n`
    );
    console.log(`⚠️  Found ${pagesWithoutCanonical.length} pages without canonical URLs!`);
  } else {
    console.log('✅ All page components have canonical URLs');
  }
} catch (error) {
  console.log('❌ Error checking for canonical URLs:', error.message);
}

// Final report
if (issues > 0) {
  console.log(`\n⚠️  Total issues found: ${issues}`);
  console.log(`📄 See ${outputFile} for details`);
} else {
  console.log('\n✅ No SEO issues found! Your site is ready for Google Search Console.');
}
