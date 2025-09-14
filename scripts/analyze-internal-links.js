#!/usr/bin/env node

/**
 * Internal Link Analyzer - Find opportunities to improve internal linking
 *
 * This script analyzes page content and suggests where additional internal links 
 * could be added to strengthen pages that might have crawling or indexing issues.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔗 FestiWise Internal Link Analyzer');
console.log('===================================');

// Get all page components
const getPageFiles = () => {
  try {
    return execSync('find src/app -name "page.tsx" -o -name "page.js"')
      .toString()
      .split('\n')
      .filter(Boolean);
  } catch (error) {
    console.error('Error finding page files:', error);
    return [];
  }
};

// Extract main text content (simplified)
const extractContentFromFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Simple extraction of text between JSX tags (this is a simplified approach)
    const textContent = content
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '') // Remove comments
      .match(/>([^<>]+)</g) || [];
    
    return textContent
      .map(match => match.slice(1, -1).trim())
      .filter(text => text.length > 10)
      .join(' ');
  } catch (error) {
    return '';
  }
};

// Analyze internal link opportunities
const analyzeInternalLinks = () => {
  const pageFiles = getPageFiles();
  console.log(`Found ${pageFiles.length} page files to analyze`);
  
  // Extract key information from each page
  const pageInfo = pageFiles.map(filePath => {
    // Get the route from the file path
    const routePath = filePath
      .replace(/^src\/app/, '')
      .replace(/\/(page\.tsx|page\.js)$/, '')
      .replace(/\/\(.*?\)/, '') // Remove route groups
      || '/';
    
    // Count incoming links (simplified approach - grep for the route path)
    let incomingLinks = 0;
    try {
      const grepResult = execSync(
        `grep -r "${routePath}" --include="*.tsx" --include="*.js" src/ | grep -v "${filePath}" | wc -l`
      ).toString().trim();
      incomingLinks = parseInt(grepResult, 10) || 0;
    } catch (error) {
      // Ignore errors
    }
    
    // Extract content
    const content = extractContentFromFile(filePath);
    
    // Extract key topics based on most common meaningful words
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        !['this', 'that', 'with', 'from', 'have', 'your'].includes(word)
      );
    
    // Count word frequency
    const wordFrequency = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Get top topics
    const topics = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
    
    return {
      filePath,
      routePath,
      incomingLinks,
      topics,
      contentLength: content.length
    };
  });
  
  // Find pages with few incoming links
  const pagesNeedingLinks = pageInfo
    .filter(page => page.incomingLinks < 3 && page.contentLength > 200) // Threshold
    .sort((a, b) => a.incomingLinks - b.incomingLinks);
  
  if (pagesNeedingLinks.length === 0) {
    console.log('✅ All pages have sufficient internal links!');
    return;
  }
  
  console.log(`\n⚠️ Found ${pagesNeedingLinks.length} pages that need more internal links:`);
  
  // For each page needing links, find other pages with matching topics
  pagesNeedingLinks.forEach(page => {
    console.log(`\n📄 ${page.routePath} (${page.incomingLinks} incoming links)`);
    console.log(`   Key topics: ${page.topics.join(', ')}`);
    
    // Find potential pages to link from
    const potentialLinkSources = pageInfo
      .filter(otherPage => 
        otherPage.filePath !== page.filePath &&
        otherPage.incomingLinks > 3 &&
        page.topics.some(topic => otherPage.topics.includes(topic))
      )
      .slice(0, 3);
    
    if (potentialLinkSources.length > 0) {
      console.log('   Suggested places to add links from:');
      potentialLinkSources.forEach(source => {
        console.log(`   - ${source.routePath} (matches topics: ${
          source.topics.filter(t => page.topics.includes(t)).join(', ')
        })`);
      });
    } else {
      console.log('   No clear topic matches. Consider adding links from popular pages.');
    }
  });
};

// Run the analysis
analyzeInternalLinks();
