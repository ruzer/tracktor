#!/usr/bin/env node

/**
 * Comprehensive validation script for documentation cleanup
 * Tests user journeys, link functionality, content completeness, and user experience
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsRoot = path.resolve(__dirname, '../..');

// Define common user journeys to test
const userJourneys = [
  {
    name: "New User Getting Started",
    path: [
      'index.md',
      'user-guide/getting-started/index.md',
      'user-guide/getting-started/installation.md',
      'user-guide/getting-started/first-setup.md'
    ]
  },
  {
    name: "Developer Setup",
    path: [
      'index.md',
      'developer-guide/index.md',
      'developer-guide/development/setup.md',
      'developer-guide/contributing/index.md'
    ]
  },
  {
    name: "API Documentation Access",
    path: [
      'index.md',
      'developer-guide/index.md',
      'developer-guide/api/index.md',
      'api-specs/openapi.yaml'
    ]
  },
  {
    name: "Feature Learning",
    path: [
      'index.md',
      'user-guide/index.md',
      'user-guide/features/index.md',
      'user-guide/features/vehicle-management.md'
    ]
  }
];

// Essential content that should exist after cleanup
const essentialContent = [
  {
    file: 'index.md',
    requiredSections: ['name: Tracktor', 'Quick Start', 'features:'],
    description: 'Main landing page'
  },
  {
    file: 'user-guide/getting-started/index.md',
    requiredSections: ['Installation', 'Setup'],
    description: 'User getting started guide'
  },
  {
    file: 'developer-guide/api/index.md',
    requiredSections: ['API', 'Authentication'],
    description: 'API documentation'
  },
  {
    file: 'developer-guide/contributing/index.md',
    requiredSections: ['Contributing', 'Guidelines'],
    description: 'Contributing guidelines'
  }
];

// Files that should redirect (not contain full content)
const redirectFiles = [
  {
    file: 'contributing.md',
    shouldRedirectTo: '/developer-guide/contributing/',
    description: 'Contributing redirect'
  },
  {
    file: 'deployment.md',
    shouldRedirectTo: '/developer-guide/deployment/',
    description: 'Deployment redirect'
  }
];

class ValidationResults {
  constructor() {
    this.results = {
      userJourneys: [],
      linkValidation: [],
      contentCompleteness: [],
      redirects: [],
      userExperience: []
    };
    this.overallSuccess = true;
  }

  addResult(category, result) {
    this.results[category].push(result);
    if (!result.success) {
      this.overallSuccess = false;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION SUMMARY');
    console.log('='.repeat(60));

    for (const [category, results] of Object.entries(this.results)) {
      const successful = results.filter(r => r.success).length;
      const total = results.length;
      const status = successful === total ? '✅' : '❌';
      
      console.log(`${status} ${category}: ${successful}/${total} passed`);
      
      // Show failed tests
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        failed.forEach(f => console.log(`   ❌ ${f.name}: ${f.error}`));
      }
    }

    console.log('\n' + '='.repeat(60));
    if (this.overallSuccess) {
      console.log('🎉 ALL VALIDATION TESTS PASSED!');
      console.log('Documentation cleanup is successful and user experience is improved.');
    } else {
      console.log('⚠️  SOME VALIDATION TESTS FAILED');
      console.log('Please address the issues above before considering cleanup complete.');
    }
    console.log('='.repeat(60));
  }
}

// Utility functions
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

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

// Test user journeys
function testUserJourneys(validator) {
  console.log('🚶 Testing user journeys...\n');

  for (const journey of userJourneys) {
    console.log(`Testing: ${journey.name}`);
    let journeySuccess = true;
    let missingFiles = [];

    for (const file of journey.path) {
      const fullPath = path.join(docsRoot, file);
      if (!fileExists(fullPath)) {
        journeySuccess = false;
        missingFiles.push(file);
        console.log(`  ❌ Missing: ${file}`);
      } else {
        console.log(`  ✅ Found: ${file}`);
      }
    }

    validator.addResult('userJourneys', {
      name: journey.name,
      success: journeySuccess,
      error: missingFiles.length > 0 ? `Missing files: ${missingFiles.join(', ')}` : null
    });

    console.log('');
  }
}

// Test link functionality
function testLinkFunctionality(validator) {
  console.log('🔗 Testing link functionality...\n');

  const filesToCheck = [
    'index.md',
    'user-guide/index.md',
    'developer-guide/index.md',
    'user-guide/getting-started/index.md',
    'developer-guide/api/index.md'
  ];

  for (const file of filesToCheck) {
    console.log(`Checking links in: ${file}`);
    const fullPath = path.join(docsRoot, file);
    
    if (!fileExists(fullPath)) {
      validator.addResult('linkValidation', {
        name: file,
        success: false,
        error: 'File not found'
      });
      continue;
    }

    const content = readFileContent(fullPath);
    const links = extractLinks(content);
    let brokenLinks = [];

    for (const link of links) {
      let targetPath = link.url;
      
      // Handle relative links
      if (targetPath.startsWith('./')) {
        const fileDir = path.dirname(file);
        targetPath = path.join(fileDir, targetPath.substring(2));
      } else if (targetPath.startsWith('../')) {
        const fileDir = path.dirname(file);
        targetPath = path.join(fileDir, targetPath);
      } else if (targetPath.startsWith('/')) {
        targetPath = targetPath.substring(1);
      }
      
      // Normalize path separators
      targetPath = targetPath.replace(/\\/g, '/');
      
      // Handle different file extensions and directory patterns
      let possiblePaths = [targetPath];
      
      if (!targetPath.endsWith('.md') && !targetPath.endsWith('/')) {
        possiblePaths.push(targetPath + '.md');
        possiblePaths.push(targetPath + '/index.md');
      } else if (targetPath.endsWith('/')) {
        possiblePaths.push(targetPath + 'index.md');
        possiblePaths.push(targetPath.slice(0, -1) + '.md');
      }
      
      let found = false;
      for (const possiblePath of possiblePaths) {
        const targetFullPath = path.join(docsRoot, possiblePath);
        if (fileExists(targetFullPath)) {
          found = true;
          break;
        }
      }
      
      if (!found) {
        brokenLinks.push(`${link.text} → ${link.url}`);
        console.log(`  ❌ Broken: ${link.text} → ${link.url} (tried: ${possiblePaths.join(', ')})`);
      } else {
        console.log(`  ✅ Valid: ${link.text} → ${link.url}`);
      }
    }

    validator.addResult('linkValidation', {
      name: file,
      success: brokenLinks.length === 0,
      error: brokenLinks.length > 0 ? `Broken links: ${brokenLinks.join(', ')}` : null
    });

    console.log('');
  }
}

// Test content completeness
function testContentCompleteness(validator) {
  console.log('📋 Testing content completeness...\n');

  for (const content of essentialContent) {
    console.log(`Checking: ${content.description}`);
    const fullPath = path.join(docsRoot, content.file);
    
    if (!fileExists(fullPath)) {
      validator.addResult('contentCompleteness', {
        name: content.description,
        success: false,
        error: 'File not found'
      });
      continue;
    }

    const fileContent = readFileContent(fullPath);
    let missingSections = [];

    for (const section of content.requiredSections) {
      if (!fileContent.includes(section)) {
        missingSections.push(section);
        console.log(`  ❌ Missing section: ${section}`);
      } else {
        console.log(`  ✅ Found section: ${section}`);
      }
    }

    validator.addResult('contentCompleteness', {
      name: content.description,
      success: missingSections.length === 0,
      error: missingSections.length > 0 ? `Missing sections: ${missingSections.join(', ')}` : null
    });

    console.log('');
  }
}

// Test redirects
function testRedirects(validator) {
  console.log('🔄 Testing redirects...\n');

  for (const redirect of redirectFiles) {
    console.log(`Checking: ${redirect.description}`);
    const fullPath = path.join(docsRoot, redirect.file);
    
    if (!fileExists(fullPath)) {
      validator.addResult('redirects', {
        name: redirect.description,
        success: false,
        error: 'Redirect file not found'
      });
      continue;
    }

    const content = readFileContent(fullPath);
    const hasRedirectScript = content.includes('window.location.href');
    const hasRedirectLink = content.includes(redirect.shouldRedirectTo);

    if (hasRedirectScript && hasRedirectLink) {
      console.log(`  ✅ Properly configured redirect to ${redirect.shouldRedirectTo}`);
      validator.addResult('redirects', {
        name: redirect.description,
        success: true,
        error: null
      });
    } else {
      let issues = [];
      if (!hasRedirectScript) issues.push('missing redirect script');
      if (!hasRedirectLink) issues.push('missing target link');
      
      console.log(`  ❌ Issues: ${issues.join(', ')}`);
      validator.addResult('redirects', {
        name: redirect.description,
        success: false,
        error: issues.join(', ')
      });
    }

    console.log('');
  }
}

// Test user experience improvements
function testUserExperience(validator) {
  console.log('👤 Testing user experience improvements...\n');

  // Test 1: Check that index.md is concise (not overly verbose)
  console.log('Testing: Main page conciseness');
  const indexPath = path.join(docsRoot, 'index.md');
  const indexContent = readFileContent(indexPath);
  
  if (indexContent) {
    const wordCount = indexContent.split(/\s+/).length;
    const isReasonableLength = wordCount < 800; // Reasonable limit for landing page
    
    console.log(`  Word count: ${wordCount} (target: <800)`);
    if (isReasonableLength) {
      console.log('  ✅ Main page is appropriately concise');
    } else {
      console.log('  ❌ Main page may be too verbose');
    }

    validator.addResult('userExperience', {
      name: 'Main page conciseness',
      success: isReasonableLength,
      error: !isReasonableLength ? `Too verbose: ${wordCount} words` : null
    });
  }

  // Test 2: Check getting started is streamlined
  console.log('\nTesting: Getting started streamlining');
  const gettingStartedPath = path.join(docsRoot, 'user-guide/getting-started/index.md');
  const gettingStartedContent = readFileContent(gettingStartedPath);
  
  if (gettingStartedContent) {
    const hasLinearPath = gettingStartedContent.includes('Installation') && 
                         gettingStartedContent.includes('Setup');
    const wordCount = gettingStartedContent.split(/\s+/).length;
    const isStreamlined = wordCount < 600; // Reasonable limit for getting started
    
    console.log(`  Word count: ${wordCount} (target: <600)`);
    console.log(`  Has linear path: ${hasLinearPath ? 'Yes' : 'No'}`);
    
    const success = hasLinearPath && isStreamlined;
    if (success) {
      console.log('  ✅ Getting started is properly streamlined');
    } else {
      console.log('  ❌ Getting started needs more streamlining');
    }

    validator.addResult('userExperience', {
      name: 'Getting started streamlining',
      success: success,
      error: !success ? 'Not sufficiently streamlined' : null
    });
  }

  // Test 3: Check that duplicate content is eliminated
  console.log('\nTesting: Content duplication elimination');
  
  // Check that contributing content is not duplicated
  const rootContributingPath = path.join(docsRoot, 'contributing.md');
  const devContributingPath = path.join(docsRoot, 'developer-guide/contributing/index.md');
  
  const rootContributing = readFileContent(rootContributingPath);
  const devContributing = readFileContent(devContributingPath);
  
  let duplicationEliminated = true;
  let duplicationIssues = [];

  if (rootContributing && devContributing) {
    // Root should be a redirect, not full content
    const rootIsRedirect = rootContributing.includes('window.location.href') || 
                          rootContributing.length < 500;
    
    if (!rootIsRedirect) {
      duplicationEliminated = false;
      duplicationIssues.push('Root contributing.md contains full content instead of redirect');
    }
  }

  if (duplicationEliminated) {
    console.log('  ✅ Content duplication properly eliminated');
  } else {
    console.log('  ❌ Content duplication issues found');
    duplicationIssues.forEach(issue => console.log(`    - ${issue}`));
  }

  validator.addResult('userExperience', {
    name: 'Content duplication elimination',
    success: duplicationEliminated,
    error: duplicationIssues.length > 0 ? duplicationIssues.join('; ') : null
  });

  console.log('');
}

// Main execution
async function main() {
  console.log('🔍 Starting comprehensive documentation cleanup validation...\n');
  
  const validator = new ValidationResults();

  // Run all validation tests
  testUserJourneys(validator);
  testLinkFunctionality(validator);
  testContentCompleteness(validator);
  testRedirects(validator);
  testUserExperience(validator);

  // Print results
  validator.printSummary();

  // Exit with appropriate code
  process.exit(validator.overallSuccess ? 0 : 1);
}

main().catch(console.error);