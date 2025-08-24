# Pull Request Guidelines

This guide provides detailed instructions for creating, reviewing, and managing pull requests in the Tracktor project. Following these guidelines ensures a smooth contribution process and maintains code quality.

## Before Creating a Pull Request

### Pre-submission Checklist

- [ ] **Issue Reference**: Link to a related issue or create one if none exists
- [ ] **Branch Strategy**: Create a feature branch from the latest `main` branch
- [ ] **Code Quality**: Follow our [Coding Standards](/developer-guide/development/coding-standards.md)
- [ ] **Testing**: Write and run tests for your changes
- [ ] **Documentation**: Update relevant documentation
- [ ] **Self-Review**: Review your own code before submission

### Branch Naming Convention

Use descriptive branch names that indicate the type and scope of changes:

```bash
# Feature branches
feature/vehicle-search-functionality
feature/fuel-efficiency-calculator
feature/maintenance-reminders

# Bug fix branches
fix/authentication-middleware-error
fix/database-connection-timeout
fix/responsive-layout-issues

# Documentation branches
docs/api-documentation-update
docs/setup-guide-improvements
docs/architecture-diagrams

# Refactoring branches
refactor/service-layer-cleanup
refactor/component-structure-improvement
refactor/database-query-optimization
```

## Pull Request Structure

### Title Format

Use clear, descriptive titles that follow this format:

```
type(scope): brief description

Examples:
feat(vehicles): add advanced search and filtering
fix(auth): resolve PIN validation middleware issue
docs(api): update OpenAPI specification for fuel logs
test(services): add comprehensive vehicle service tests
refactor(components): improve form component reusability
```

### Description Template

Use this template for your pull request description:

```markdown
## 📋 Description

Brief description of the changes made and why they were necessary.

## 🔗 Related Issues

- Fixes #123
- Closes #456
- Related to #789

## 🚀 Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test improvements

## 🧪 Testing

### Test Coverage

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

### Test Instructions

1. Step-by-step instructions for testing the changes
2. Include any specific test data or setup required
3. Mention any edge cases that should be tested

## 📸 Screenshots (if applicable)

### Before

[Screenshot of the current state]

### After

[Screenshot of the changes]

## 🔍 Code Review Checklist

- [ ] Code follows the project's coding standards
- [ ] Self-review completed
- [ ] Code is properly commented
- [ ] No debugging code left in the codebase
- [ ] Error handling is appropriate
- [ ] Performance impact considered
- [ ] Security implications reviewed

## 📖 Documentation

- [ ] Code comments added for complex logic
- [ ] API documentation updated (if applicable)
- [ ] User documentation updated (if applicable)
- [ ] README updated (if applicable)
- [ ] Migration guide provided (for breaking changes)

## 🚨 Breaking Changes

If this PR introduces breaking changes, describe:

1. What breaks and why
2. Migration path for existing users
3. Timeline for deprecation (if applicable)

## 📝 Additional Notes

Any additional information that reviewers should know about this PR.
```

## Code Quality Requirements

### Automated Checks

All pull requests must pass these automated checks:

#### Linting and Formatting

```bash
# ESLint checks
npm run lint

# Prettier formatting
npm run format

# TypeScript type checking
npm run check
```

#### Testing Requirements

```bash
# All tests must pass
npm test

# Minimum test coverage thresholds
# - Statements: 80%
# - Branches: 75%
# - Functions: 80%
# - Lines: 80%
```

#### Build Verification

```bash
# Frontend build
npm run build --workspace=frontend

# Backend build
npm run build --workspace=backend

# Documentation build
npm run docs:build --workspace=docs
```

### Manual Code Review Criteria

#### Code Quality

- **Readability**: Code is clear and self-documenting
- **Maintainability**: Follows established patterns and conventions
- **Modularity**: Proper separation of concerns
- **Reusability**: Components and functions are reusable where appropriate
- **Error Handling**: Comprehensive error handling and validation
- **Performance**: No obvious performance issues introduced

#### Security Review

- **Input Validation**: All user inputs are properly validated
- **Authentication**: Security measures are not bypassed
- **Data Exposure**: No sensitive data is exposed
- **SQL Injection**: Database queries are properly parameterized
- **XSS Prevention**: User content is properly sanitized

#### Testing Quality

- **Coverage**: Adequate test coverage for new code
- **Test Quality**: Tests are meaningful and test the right behavior
- **Edge Cases**: Important edge cases are covered
- **Test Isolation**: Tests don't depend on external state
- **Test Documentation**: Tests are well-documented and understandable

## Review Process

### Reviewer Assignment

- **Automatic Assignment**: GitHub automatically assigns reviewers based on CODEOWNERS
- **Self-Assignment**: Team members can self-assign for review
- **Expertise-Based**: Assign reviewers with relevant domain expertise
- **Minimum Reviews**: At least one approval required for merge

### Review Timeline

- **Initial Review**: Within 2 business days of submission
- **Follow-up Reviews**: Within 1 business day of updates
- **Urgent Fixes**: Same-day review for critical bug fixes
- **Large Features**: May require multiple review cycles

### Review Types

#### Code Review

Focus on:

- Code quality and adherence to standards
- Logic correctness and potential bugs
- Performance implications
- Security considerations
- Maintainability and readability

#### Design Review

Focus on:

- Architecture alignment
- API design consistency
- User experience considerations
- Database schema changes
- Integration patterns

#### Documentation Review

Focus on:

- Accuracy and completeness
- Clarity and usefulness
- Code examples and snippets
- API documentation updates
- User guide improvements

## Feedback and Iteration

### Providing Feedback

#### Constructive Comments

```markdown
# ✅ Good feedback

Consider using a more descriptive variable name here. Instead of `data`,
perhaps `vehicleData` would make the code more readable.

# ✅ Good feedback with suggestion

This function is doing multiple things. Consider splitting it into:

1. `validateVehicleData()` for validation
2. `saveVehicle()` for persistence

# ❌ Poor feedback

This is wrong.

# ❌ Poor feedback

Bad code.
```

#### Comment Categories

Use these prefixes to categorize feedback:

- **🐛 Bug**: Potential bugs or logical errors
- **💡 Suggestion**: Improvements or alternative approaches
- **❓ Question**: Clarification needed
- **🔧 Nitpick**: Minor style or preference issues
- **🚨 Blocker**: Must be fixed before merge
- **💭 Thought**: General observations or ideas

#### Code Suggestions

Use GitHub's suggestion feature for small changes:

````markdown
```suggestion
const vehicleCount = vehicles.length;
```
````

````

### Addressing Feedback

#### Response Guidelines
- **Acknowledge**: Respond to all feedback, even if you disagree
- **Explain**: Provide reasoning for your approach when questioned
- **Implement**: Make requested changes or explain why you won't
- **Ask Questions**: Seek clarification when feedback is unclear
- **Be Gracious**: Thank reviewers for their time and input

#### Making Changes
```bash
# Make changes based on feedback
git add .
git commit -m "address review feedback: improve error handling"

# Push updates to the same branch
git push origin feature/your-feature-name
````

#### Resolving Conversations

- **Mark as Resolved**: Only the comment author should resolve conversations
- **Explain Resolution**: Comment on how the feedback was addressed
- **Request Re-review**: Ask for re-review after significant changes

## Merge Requirements

### Merge Criteria

All of the following must be satisfied before merge:

#### Automated Checks

- [ ] All CI/CD checks pass
- [ ] No merge conflicts with target branch
- [ ] Branch is up to date with target branch
- [ ] All required status checks pass

#### Review Requirements

- [ ] At least one approving review from a maintainer
- [ ] No unresolved conversations
- [ ] All feedback addressed or acknowledged
- [ ] No changes requested by reviewers

#### Quality Gates

- [ ] Test coverage meets minimum thresholds
- [ ] No new linting errors introduced
- [ ] Documentation updated for user-facing changes
- [ ] Breaking changes properly documented

### Merge Strategies

#### Squash and Merge (Preferred)

Use for most feature branches to maintain clean history:

```bash
# Creates a single commit with all changes
git merge --squash feature/your-feature-name
```

#### Merge Commit

Use for significant features or when preserving commit history is important:

```bash
# Preserves individual commits
git merge --no-ff feature/your-feature-name
```

#### Rebase and Merge

Use for small, clean commits that add value to history:

```bash
# Replays commits without merge commit
git rebase main
git merge --ff-only feature/your-feature-name
```

## Special Cases

### Hotfixes

For critical production issues:

1. **Create from Main**: Branch directly from `main`
2. **Minimal Changes**: Keep changes as small as possible
3. **Expedited Review**: Request immediate review
4. **Fast-Track Merge**: Can be merged with single approval
5. **Follow-up**: Create issue for proper fix if needed

```bash
# Hotfix branch naming
git checkout -b hotfix/critical-security-patch
git checkout -b hotfix/database-connection-fix
```

### Documentation-Only Changes

For documentation updates:

1. **Simplified Review**: Focus on content accuracy and clarity
2. **Fast Approval**: Can be approved by any team member
3. **Direct Merge**: Can be merged immediately after approval
4. **Batch Updates**: Multiple doc changes can be batched together

### Dependency Updates

For package updates:

1. **Automated PRs**: Dependabot creates automated PRs
2. **Security Updates**: Prioritize security-related updates
3. **Testing Required**: Ensure all tests pass with new versions
4. **Breaking Changes**: Review for breaking changes in major updates

## Troubleshooting

### Common Issues

#### Merge Conflicts

```bash
# Update your branch with latest main
git checkout main
git pull upstream main
git checkout feature/your-feature-name
git rebase main

# Resolve conflicts and continue
git add .
git rebase --continue
git push --force-with-lease origin feature/your-feature-name
```

#### Failed CI Checks

```bash
# Run checks locally to debug
npm run lint
npm run check
npm test
npm run build

# Fix issues and push updates
git add .
git commit -m "fix: resolve CI check failures"
git push origin feature/your-feature-name
```

#### Outdated Branch

```bash
# Sync with upstream main
git fetch upstream
git rebase upstream/main
git push --force-with-lease origin feature/your-feature-name
```

### Getting Help

If you encounter issues with the PR process:

1. **Check Documentation**: Review this guide and related docs
2. **Ask in Comments**: Comment on your PR asking for help
3. **GitHub Discussions**: Use discussions for general questions
4. **Contact Maintainers**: Reach out to project maintainers directly

## Best Practices Summary

### For Contributors

- **Start Small**: Begin with small, focused changes
- **Communicate Early**: Discuss large changes before implementation
- **Test Thoroughly**: Ensure your changes work as expected
- **Document Changes**: Update documentation for user-facing changes
- **Be Responsive**: Address feedback promptly and professionally

### For Reviewers

- **Be Timely**: Review PRs within the expected timeframe
- **Be Constructive**: Provide helpful, actionable feedback
- **Be Thorough**: Check code quality, tests, and documentation
- **Be Respectful**: Maintain a positive and professional tone
- **Be Educational**: Help contributors learn and improve

### For Maintainers

- **Set Expectations**: Clearly communicate requirements and timelines
- **Provide Guidance**: Help contributors navigate the process
- **Maintain Standards**: Ensure consistent quality across all contributions
- **Recognize Contributions**: Acknowledge and appreciate contributor efforts
- **Foster Community**: Create a welcoming environment for all contributors

Following these pull request guidelines helps maintain code quality, facilitates effective collaboration, and ensures a positive contribution experience for everyone involved in the Tracktor project.
