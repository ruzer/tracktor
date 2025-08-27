#!/usr/bin/env node

/**
 * Link validation script for Tracktor documentation
 * Validates that all internal links point to existing files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsRoot = path.resolve(__dirname, '../..');

// Files to check for links
const filesToCheck = [
  'index.md',
  'contributing.md',
  'deployment.md',
  'user-guide/index.md',
  'developer-guide/index.md'
];

// Extract markdown links from content
function extractLinks(content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const [, text, url] = match;
    if (!url.startsWith('http') && !url.startsWith('mailto:')) {
      links.push({ text, url });
    }
  }
  
  return links;
}

// Check if a file exists
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

// Validate links in a file
function validateFile(filePath) {
  const fullPath = path.join(docsRoot, filePath);
  
  if (!fileExists(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const links = extractLinks(content);
  let allValid = true;
  
  console.log(`\n📄 Checking ${filePath}:`);
  
  for (const link of links) {
    let targetPath = link.url;
    
    // Handle relative links starting with ./
    if (targetPath.startsWith('./')) {
      const fileDir = path.dirname(filePath);
      targetPath = path.join(fileDir, targetPath.substring(2));
    } else if (targetPath.startsWith('/')) {
      // Absolute links from root
      targetPath = targetPath.substring(1);
    }
    
    // Normalize path separators
    targetPath = targetPath.replace(/\\/g, '/');
    
    // Add .md extension if not present and not a directory
    if (!targetPath.endsWith('.md') && !targetPath.endsWith('/')) {
      const withMd = targetPath + '.md';
      const withIndex = targetPath + '/index.md';
      
      if (fileExists(path.join(docsRoot, withMd))) {
        targetPath = withMd;
      } else if (fileExists(path.join(docsRoot, withIndex))) {
        targetPath = withIndex;
      }
    } else if (targetPath.endsWith('/')) {
      targetPath = targetPath + 'index.md';
    }
    
    const targetFullPath = path.join(docsRoot, targetPath);
    
    if (fileExists(targetFullPath)) {
      console.log(`  ✅ ${link.text} → ${link.url}`);
    } else {
      console.log(`  ❌ ${link.text} → ${link.url} (target not found: ${targetPath})`);
      allValid = false;
    }
  }
  
  return allValid;
}

// Main validation
console.log('🔍 Validating documentation links...\n');

let allFilesValid = true;

for (const file of filesToCheck) {
  if (!validateFile(file)) {
    allFilesValid = false;
  }
}

console.log('\n' + '='.repeat(50));
if (allFilesValid) {
  console.log('✅ All links are valid!');
  process.exit(0);
} else {
  console.log('❌ Some links are broken. Please fix them before proceeding.');
  process.exit(1);
}