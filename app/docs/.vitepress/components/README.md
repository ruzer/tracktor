# Custom Documentation Components

This directory contains custom Vue components for the Tracktor documentation.

## Available Components

### ApiEndpoint

Displays API endpoint information in a consistent format.

**Props:**

- `method` (required): HTTP method (GET, POST, PUT, DELETE, PATCH)
- `endpoint` (required): API endpoint path
- `description` (optional): Brief description of the endpoint
- `auth` (optional): Authentication requirements

**Usage:**

```vue
<ApiEndpoint
  method="GET"
  endpoint="/api/vehicles"
  description="Retrieve all vehicles"
  auth="PIN required"
>
  Additional content can go here
</ApiEndpoint>
```

### PlaceholderBlock

Indicates sections that require manual updates with clear instructions.

**Props:**

- `type` (required): Type of placeholder (screenshot, api-example, feature-description, configuration)
- `message` (required): Instructions for the update
- `priority` (optional): Priority level (high, medium, low) - defaults to medium

**Usage:**

```vue
<PlaceholderBlock
  type="screenshot"
  message="Add screenshot of vehicle management interface"
  priority="high"
>
  Additional instructions can be provided in the slot
</PlaceholderBlock>
```

### FeatureStatus

Shows the availability status of features.

**Props:**

- `status` (required): Feature status (available, beta, planned, deprecated)
- `version` (optional): Version information

**Usage:**

```vue
<FeatureStatus status="available" version="v1.0" />
<FeatureStatus status="beta" />
<FeatureStatus status="planned" />
```

## Component Guidelines

1. **Consistency**: Use these components consistently throughout the documentation
2. **Accessibility**: All components include proper ARIA labels and semantic HTML
3. **Responsive**: Components are designed to work on all screen sizes
4. **Theming**: Components respect VitePress light/dark theme switching

## Styling

Component styles are defined within each component file and also in the main `custom.css` file for global overrides and theme integration.
