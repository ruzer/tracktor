#!/usr/bin/env node

/**
 * Test script to verify redirects are working
 * This script checks that redirect pages exist and contain proper redirect logic
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsRoot = path.resolve(__dirname, '../..');

// Redirect mappings to test
const redirects = [
  {
    from: 'contributing.md',
    to: '/developer-guide/contributing/',
    description: 'Contributing guide redirect'
  },
  {
    from: 'deployment.md', 
    to: '/developer-guide/deployment/',
    description: 'Deployment guide redirect'
  }
];

console.log('🔄 Testing documentation redirects...\n');

let allRedirectsValid = true;

for (const redirect of redirects) {
  const filePath = path.join(docsRoot, redirect.from);
  
  console.log(`📄 Testing ${redirect.description}:`);
  console.log(`   From: ${redirect.from}`);
  console.log(`   To: ${redirect.to}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ Redirect file not found: ${redirect.from}`);
    allRedirectsValid = false;
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file contains redirect logic
  const hasRedirectScript = content.includes('window.location.href');
  const hasRedirectLink = content.includes(redirect.to);
  
  if (hasRedirectScript && hasRedirectLink) {
    console.log(`   ✅ Redirect properly configured`);
  } else {
    console.log(`   ❌ Redirect not properly configured`);
    if (!hasRedirectScript) {
      console.log(`      Missing redirect script`);
    }
    if (!hasRedirectLink) {
      console.log(`      Missing target link: ${redirect.to}`);
    }
    allRedirectsValid = false;
  }
  
  console.log('');
}

console.log('='.repeat(50));
if (allRedirectsValid) {
  console.log('✅ All redirects are properly configured!');
  process.exit(0);
} else {
  console.log('❌ Some redirects need attention.');
  process.exit(1);
}