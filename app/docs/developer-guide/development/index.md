# Development Guide

This section provides comprehensive guidance for developers working on the Tracktor application, covering setup, coding standards, testing, and debugging practices.

## Quick Start

New to the project? Start here:

1. **[Development Setup](./setup.md)** - Complete environment setup guide
2. **[Coding Standards](./coding-standards.md)** - Code style and conventions
3. **[Testing Guide](./testing.md)** - Testing strategies and best practices
4. **[Debugging Guide](./debugging.md)** - Debugging tools and techniques

## Development Workflow

### Getting Started

```bash
# Clone and setup
git clone <repository-url>
cd tracktor
npm install
npm run setup

# Start development
npm run dev
```

### Daily Development

```bash
# Start development servers
npm run dev

# Run tests
npm test

# Format and lint code
npm run format
npm run lint

# Check types
npm run check
```

## Project Structure

```
tracktor/
├── app/
│   ├── backend/           # Node.js/Express backend
│   ├── frontend/          # SvelteKit frontend
│   └── docs/              # VitePress documentation
├── docker/                # Docker configuration
├── scripts/               # Build and setup scripts
└── docs/                  # Additional documentation
```

## Technology Stack

### Frontend

- **SvelteKit 2.x**: Full-stack framework
- **TypeScript**: Type safety and tooling
- **Tailwind CSS**: Utility-first styling
- **Vite**: Build tool and dev server

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Sequelize**: ORM for database operations
- **SQLite**: Database engine

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **tsx**: TypeScript execution
- **Concurrently**: Run multiple processes

## Key Concepts

### Workspace Management

The project uses npm workspaces to manage multiple packages:

```bash
# Install dependencies for all workspaces
npm install

# Run commands in specific workspace
npm run dev --workspace=backend
npm run build --workspace=frontend

# Run commands across all workspaces
npm run lint --workspaces
```

### Environment Configuration

- Centralized environment variables in root `.env`
- Automatic environment setup with `npm run setup`
- Development and production configurations
- SvelteKit public variables with `PUBLIC_` prefix

### Database Management

- Migration-based schema management
- Transactional migrations for data integrity
- Seeder system for development data
- SQLite for simplicity and performance

## Development Practices

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Consistent code style and error prevention
- **Prettier**: Automated code formatting
- **Git Hooks**: Pre-commit validation (when configured)

### Testing Strategy

- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full application workflow testing
- **Type Checking**: Compile-time error prevention

### Performance

- **Hot Module Replacement**: Instant development feedback
- **Code Splitting**: Optimized bundle sizes
- **Tree Shaking**: Remove unused code
- **Source Maps**: Development debugging support

## Common Tasks

### Adding New Features

1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement feature with tests
3. Update documentation
4. Submit pull request

### Database Changes

1. Create migration: `npm run db:create-migration`
2. Implement up/down migrations
3. Test migration: `npm run db:migrate`
4. Update seeders if needed

### API Development

1. Define TypeScript interfaces
2. Implement controller and service layers
3. Add input validation
4. Write tests
5. Update API documentation

### Frontend Development

1. Create Svelte components
2. Implement state management
3. Add styling with Tailwind
4. Ensure responsive design
5. Test across browsers

## Debugging

### Development Servers

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Express server)
- **Hot Reload**: Automatic for both frontend and backend

### Debugging Tools

- **VS Code Debugger**: Integrated debugging support
- **Browser DevTools**: Frontend debugging and inspection
- **Node.js Inspector**: Backend debugging
- **Database Browser**: SQLite inspection tools

### Logging

```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Enable SQL query logging
SHOW_SQL=true npm run dev:backend
```

## Troubleshooting

### Common Issues

- **Port conflicts**: Change ports in `.env`
- **Permission errors**: Fix npm permissions
- **Database issues**: Reset and remigrate
- **TypeScript errors**: Clear cache and rebuild
- **CORS errors**: Update allowed origins

### Getting Help

1. Check this documentation
2. Review existing issues in the repository
3. Ask questions in team channels
4. Create detailed bug reports

## Contributing

### Before You Start

- Read the [Coding Standards](./coding-standards.md)
- Set up your development environment
- Familiarize yourself with the project structure
- Review existing code patterns

### Development Process

1. **Plan**: Discuss significant changes before implementation
2. **Code**: Follow established patterns and standards
3. **Test**: Ensure all tests pass and add new tests
4. **Document**: Update documentation for new features
5. **Review**: Submit pull requests for code review

### Code Review Guidelines

- Focus on code quality and maintainability
- Ensure proper error handling
- Verify test coverage
- Check documentation updates
- Validate performance implications

This development guide provides the foundation for productive work on the Tracktor application. For specific technical details, refer to the individual guide sections.
