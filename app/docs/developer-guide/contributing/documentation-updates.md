# Documentation Updates

This guide covers how to contribute to the Tracktor documentation, including user guides, developer documentation, API references, and other project documentation. Good documentation is essential for project success and user adoption.

## Documentation Structure

### Documentation Organization

The Tracktor project maintains documentation in several locations:

```
app/docs/                           # Main VitePress documentation site
├── .vitepress/                     # VitePress configuration
│   ├── config.js                   # Site configuration
│   ├── theme/                      # Custom theme files
│   └── components/                 # Vue components for docs
├── user-guide/                     # End-user documentation
│   ├── getting-started/            # Installation and setup
│   ├── features/                   # Feature-specific guides
│   ├── tutorials/                  # Step-by-step tutorials
│   └── troubleshooting/            # Common issues and solutions
├── developer-guide/                # Technical documentation
│   ├── architecture/               # System architecture
│   ├── api/                        # API documentation
│   ├── development/                # Development guides
│   ├── deployment/                 # Deployment instructions
│   └── contributing/               # Contribution guidelines
├── api-specs/                      # OpenAPI specifications
│   ├── openapi.yaml               # Complete API specification
│   └── schemas/                    # Individual schema definitions
├── assets/                         # Documentation assets
│   ├── images/                     # Screenshots and diagrams
│   └── videos/                     # Tutorial videos
└── templates/                      # Documentation templates
    ├── feature-documentation.md    # Template for new features
    ├── api-endpoint.md            # Template for API docs
    └── troubleshooting-entry.md   # Template for troubleshooting
```

### Documentation Types

#### User Documentation

- **Getting Started Guides**: Help new users set up and use the application
- **Feature Guides**: Detailed explanations of application features
- **Tutorials**: Step-by-step instructions for common tasks
- **Troubleshooting**: Solutions for common problems and issues
- **FAQ**: Frequently asked questions and answers

#### Developer Documentation

- **Architecture Guides**: System design and technical architecture
- **API Documentation**: Complete API reference and examples
- **Development Setup**: Environment configuration and tools
- **Coding Standards**: Code quality guidelines and conventions
- **Contributing Guides**: How to contribute to the project

#### Technical References

- **OpenAPI Specifications**: Machine-readable API definitions
- **Database Schema**: Data model documentation
- **Configuration References**: Environment and configuration options
- **Deployment Guides**: Production deployment instructions

## Contributing to Documentation

### Getting Started

#### Setting Up Documentation Environment

```bash
# Clone the repository
git clone https://github.com/your-username/tracktor.git
cd tracktor

# Install dependencies
npm install

# Start documentation development server
npm run docs:dev --workspace=docs

# Open browser to http://localhost:5173
```

#### Documentation Development Workflow

```bash
# Create a documentation branch
git checkout -b docs/your-documentation-update

# Make your changes
# Edit markdown files in app/docs/

# Preview changes locally
npm run docs:dev --workspace=docs

# Build documentation to check for errors
npm run docs:build --workspace=docs

# Commit and push changes
git add .
git commit -m "docs: update user guide for vehicle management"
git push origin docs/your-documentation-update

# Create pull request
```

### Writing Guidelines

#### Markdown Standards

Use consistent Markdown formatting:

````markdown
# Page Title (H1 - only one per page)

Brief introduction paragraph explaining what this page covers.

## Main Section (H2)

Content for the main section.

### Subsection (H3)

More detailed content.

#### Sub-subsection (H4)

Even more specific content.

## Code Examples

Use fenced code blocks with language specification:

```typescript
// TypeScript example
interface Vehicle {
  id: string;
  make: string;
  model: string;
}
```
````

```bash
# Bash commands
npm install
npm run dev
```

## Lists and Tables

### Unordered Lists

- Use hyphens for consistency
- Keep items concise
- Use parallel structure

### Ordered Lists

1. Number lists when order matters
2. Use consistent formatting
3. Include clear instructions

### Tables

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |

## Links and References

- [Internal Link](./other-page.md)
- [External Link](https://example.com)
- [Section Link](#main-section)

````

#### Writing Style Guide

##### Tone and Voice
- **Clear and Concise**: Use simple, direct language
- **Helpful and Friendly**: Write as if helping a colleague
- **Professional**: Maintain a professional but approachable tone
- **Inclusive**: Use inclusive language that welcomes all users
- **Action-Oriented**: Focus on what users can do

##### Language Guidelines
```markdown
# ✅ Good Examples
Click the "Save" button to save your changes.
Navigate to the Settings page.
The API returns a JSON response.
This feature helps you track fuel efficiency.

# ❌ Avoid
Click on the "Save" button in order to save your changes.
You should navigate to the Settings page.
The API will return a JSON response.
This feature allows you to track fuel efficiency.
````

##### Technical Writing Best Practices

- **Use Active Voice**: "Click the button" instead of "The button should be clicked"
- **Be Specific**: "Enter your vehicle's make and model" instead of "Enter vehicle information"
- **Provide Context**: Explain why something is important, not just how to do it
- **Use Examples**: Include concrete examples and code snippets
- **Structure Information**: Use headings, lists, and tables to organize content

### Content Types

#### User Guides

Focus on helping users accomplish their goals:

```markdown
# Adding Your First Vehicle

This guide walks you through adding a vehicle to your Tracktor account.

## Before You Begin

Make sure you have:

- Your vehicle's registration information
- The current odometer reading
- Insurance policy details (optional)

## Step-by-Step Instructions

### 1. Navigate to Vehicle Management

1. Log in to your Tracktor account
2. Click the "Vehicles" tab in the main navigation
3. Click the "Add Vehicle" button

### 2. Enter Vehicle Information

Fill out the vehicle form with the following information:

**Required Fields:**

- **Make**: The vehicle manufacturer (e.g., Toyota, Honda)
- **Model**: The specific model name (e.g., Camry, Civic)
- **Year**: The manufacturing year
- **License Plate**: Your vehicle's license plate number

**Optional Fields:**

- **VIN**: Vehicle Identification Number (17 characters)
- **Color**: Vehicle color for easy identification
- **Current Odometer**: Current mileage reading

### 3. Save Your Vehicle

1. Review the information for accuracy
2. Click "Save Vehicle"
3. Your vehicle will appear in the vehicle list

## What's Next?

Now that you've added your vehicle, you can:

- [Log your first fuel purchase](./fuel-tracking.md)
- [Record maintenance activities](./maintenance-logs.md)
- [Add insurance information](./insurance-management.md)

## Troubleshooting

**Problem**: "License plate already exists" error
**Solution**: Each license plate must be unique. Check if you've already added this vehicle or contact support if you believe this is an error.
```

#### API Documentation

Provide comprehensive API reference information:

````markdown
# Vehicle Management API

## Create Vehicle

Creates a new vehicle in the system.

### HTTP Request

```http
POST /api/vehicles
```
````

### Request Headers

| Header         | Required | Description                |
| -------------- | -------- | -------------------------- |
| `Content-Type` | Yes      | Must be `application/json` |
| `X-User-PIN`   | Yes      | User authentication PIN    |

### Request Body

```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "licensePlate": "ABC123",
  "vin": "1HGBH41JXMN109186",
  "color": "Blue",
  "odometer": 15000
}
```

### Request Parameters

| Parameter      | Type    | Required | Description                       |
| -------------- | ------- | -------- | --------------------------------- |
| `make`         | string  | Yes      | Vehicle manufacturer              |
| `model`        | string  | Yes      | Vehicle model                     |
| `year`         | integer | Yes      | Manufacturing year (1900-current) |
| `licensePlate` | string  | Yes      | Unique license plate              |
| `vin`          | string  | No       | 17-character VIN                  |
| `color`        | string  | No       | Vehicle color                     |
| `odometer`     | integer | No       | Current mileage                   |

### Response

#### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "licensePlate": "ABC123",
    "vin": "1HGBH41JXMN109186",
    "color": "Blue",
    "odometer": 15000,
    "createdAt": "2023-12-01T10:00:00Z",
    "updatedAt": "2023-12-01T10:00:00Z"
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid vehicle data",
    "details": {
      "year": "Year must be between 1900 and 2023"
    }
  }
}
```

### Code Examples

#### JavaScript/TypeScript

```typescript
const response = await fetch("/api/vehicles", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-User-PIN": userPin,
  },
  body: JSON.stringify({
    make: "Toyota",
    model: "Camry",
    year: 2023,
    licensePlate: "ABC123",
  }),
});

const vehicle = await response.json();
```

#### cURL

```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "X-User-PIN: your-pin" \
  -d '{
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "licensePlate": "ABC123"
  }'
```

````

#### Developer Guides
Focus on technical implementation details:

```markdown
# Setting Up the Development Environment

This guide helps developers set up a local development environment for the Tracktor project.

## Prerequisites

### Required Software
Before starting, ensure you have the following installed:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (included with Node.js)
- **Git**: Version 2.x or higher ([Download](https://git-scm.com/))

### Verify Installation
```bash
# Check versions
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
git --version   # Should show 2.x.x or higher
````

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tracktor.git
cd tracktor
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

### 3. Environment Configuration

```bash
# Run setup script
npm run setup

# Or manually copy environment file
cp .env.example .env
```

### 4. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed with demo data (optional)
npm run db:seed
```

### 5. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend  # Backend on port 3000
npm run dev:frontend # Frontend on port 5173
```

## Development Workflow

### Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test your changes: `npm test`
4. Commit your changes: `git commit -m "feat: add new feature"`
5. Push and create PR: `git push origin feature/your-feature`

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run check
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
SERVER_PORT=3001
```

#### Database Issues

```bash
# Reset database
rm app/backend/tracktor.db
npm run db:migrate
npm run db:seed
```

For more troubleshooting help, see the [Debugging Guide](./debugging.md).

````

### Visual Content

#### Screenshots
- **Consistent Style**: Use consistent browser, theme, and window size
- **High Quality**: Use high-resolution images (at least 1920x1080)
- **Annotations**: Add callouts and annotations to highlight important elements
- **Alt Text**: Include descriptive alt text for accessibility
- **File Naming**: Use descriptive filenames (e.g., `vehicle-form-validation-error.png`)

#### Diagrams
Use Mermaid for technical diagrams:

```markdown
## System Architecture

```mermaid
graph TB
    subgraph "Frontend"
        A[SvelteKit App]
        B[Components]
        C[Stores]
    end

    subgraph "Backend"
        D[Express API]
        E[Controllers]
        F[Services]
    end

    subgraph "Database"
        G[SQLite]
    end

    A --> D
    B --> C
    E --> F
    F --> G
````

````

#### Code Snippets
- **Syntax Highlighting**: Always specify the language for code blocks
- **Complete Examples**: Provide working, complete examples when possible
- **Comments**: Add explanatory comments to complex code
- **Error Handling**: Show proper error handling in examples

### Documentation Components

#### Custom Vue Components
The documentation site includes custom components for enhanced content:

```markdown
<!-- API Endpoint Component -->
<ApiEndpoint
  method="POST"
  endpoint="/api/vehicles"
  description="Create a new vehicle"
/>

<!-- Feature Status Component -->
<FeatureStatus
  status="stable"
  version="1.0.0"
  description="Vehicle management is fully implemented and stable"
/>

<!-- Placeholder Block Component -->
<PlaceholderBlock
  type="screenshot"
  description="Screenshot of vehicle form validation"
/>
````

## Review and Quality Assurance

### Documentation Review Process

#### Self-Review Checklist

Before submitting documentation changes:

- [ ] **Accuracy**: Information is correct and up-to-date
- [ ] **Completeness**: All necessary information is included
- [ ] **Clarity**: Content is clear and easy to understand
- [ ] **Grammar**: Proper grammar and spelling
- [ ] **Links**: All links work and point to correct locations
- [ ] **Code Examples**: All code examples are tested and work
- [ ] **Screenshots**: Images are current and high-quality
- [ ] **Structure**: Content is well-organized with proper headings

#### Peer Review

Documentation changes go through the same review process as code:

1. **Create Pull Request**: Submit changes via GitHub PR
2. **Automated Checks**: Link validation and build verification
3. **Peer Review**: At least one team member reviews content
4. **Feedback**: Address reviewer comments and suggestions
5. **Approval**: Merge after approval from reviewers

### Quality Standards

#### Content Quality

- **Accuracy**: Information must be correct and current
- **Usefulness**: Content should help users accomplish their goals
- **Completeness**: Cover all necessary information without overwhelming
- **Consistency**: Use consistent terminology and formatting
- **Accessibility**: Content should be accessible to all users

#### Technical Quality

- **Link Validation**: All internal and external links must work
- **Code Testing**: All code examples must be tested and functional
- **Build Verification**: Documentation must build without errors
- **Cross-References**: Related content should be properly linked
- **Search Optimization**: Content should be discoverable via search

## Maintenance and Updates

### Keeping Documentation Current

#### Regular Maintenance Tasks

- **Link Checking**: Verify all links are still valid
- **Screenshot Updates**: Update screenshots when UI changes
- **Code Example Updates**: Ensure code examples work with current versions
- **Content Review**: Review content for accuracy and relevance
- **User Feedback**: Address user questions and suggestions

#### Documentation Lifecycle

1. **Creation**: New documentation for features or processes
2. **Updates**: Regular updates as features evolve
3. **Review**: Periodic comprehensive reviews
4. **Archival**: Remove or archive outdated content
5. **Migration**: Move content when structure changes

### Automation and Tools

#### Automated Checks

The documentation pipeline includes:

- **Link Validation**: Automated checking of internal and external links
- **Build Verification**: Ensure documentation builds successfully
- **Spell Checking**: Automated spell checking for content
- **Style Checking**: Consistent formatting and style validation

#### Documentation Tools

- **VitePress**: Static site generator for documentation
- **Mermaid**: Diagram generation from text
- **Vue Components**: Custom components for enhanced content
- **GitHub Actions**: Automated building and deployment

## Getting Help

### Resources for Documentation Contributors

- **VitePress Documentation**: [https://vitepress.dev/](https://vitepress.dev/)
- **Markdown Guide**: [https://www.markdownguide.org/](https://www.markdownguide.org/)
- **Mermaid Documentation**: [https://mermaid.js.org/](https://mermaid.js.org/)
- **Writing Style Guides**: Various online resources for technical writing

### Support Channels

- **GitHub Issues**: Report documentation bugs or request improvements
- **GitHub Discussions**: Ask questions about documentation
- **Pull Request Comments**: Get feedback on specific documentation changes
- **Team Communication**: Reach out to maintainers for guidance

Contributing to documentation is a valuable way to help the Tracktor project and its community. Good documentation makes the project more accessible and helps users and developers be more successful with the application.
