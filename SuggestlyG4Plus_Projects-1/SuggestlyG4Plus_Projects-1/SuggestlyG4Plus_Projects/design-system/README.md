# Suggestly & Veridian Design System

A comprehensive design system that unifies the visual language and components for both Suggestly Vision Automation and Veridian Concierge applications.

## Overview

This design system provides:
- **Consistent Design Language**: Unified colors, typography, spacing, and components
- **Shared Components**: Reusable UI components that work across both applications
- **Utility Functions**: Common JavaScript utilities for both applications
- **Brand Integration**: Maintains distinct brand identities while sharing core design principles

## File Structure

```
design-system/
├── design-tokens.css     # Core variables and design tokens
├── components.css        # Shared UI components and utilities
├── shared-utils.js       # Common JavaScript utilities
└── README.md            # This documentation
```

## Design Tokens

### Color Palette

#### Veridian Luxury Colors
- `--veridian-gold`: #c9a961 (Primary luxury accent)
- `--veridian-gold-light`: #e5cf88 (Lighter gold variant)
- `--veridian-gold-dark`: #b8944f (Darker gold variant)
- `--veridian-dark`: #0a0f1b (Primary dark background)
- `--veridian-darker`: #1a1f2e (Secondary dark background)
- `--veridian-accent`: #8bb5d4 (Luxury accent blue)

#### Suggestly Industrial Colors
- `--suggestly-blue`: #2563eb (Primary industrial blue)
- `--suggestly-blue-light`: #3b82f6 (Lighter blue variant)
- `--suggestly-blue-dark`: #1d4ed8 (Darker blue variant)
- `--suggestly-dark`: #1e293b (Primary industrial dark)
- `--suggestly-darker`: #0f172a (Secondary industrial dark)
- `--suggestly-accent`: #06b6d4 (Industrial accent cyan)

### Typography

#### Font Families
- **Inter**: Modern, clean sans-serif for body text and UI elements
- **Playfair Display**: Elegant serif for headlines and luxury branding

#### Type Scale
- `--text-xs` to `--text-8xl`: Complete typographic hierarchy
- Responsive and accessible font sizes

### Spacing System

#### 8-Point Grid
- `--space-0` to `--space-64`: Consistent spacing scale
- Based on multiples of 4px for visual harmony

### Shadows
- `--shadow-sm` to `--shadow-2xl`: Comprehensive shadow system
- Subtle to dramatic elevation options

## Components

### Buttons

#### Primary Button (Veridian Style)
```html
<button class="btn btn-primary">Get Started</button>
```

#### Secondary Button (Suggestly Style)
```html
<button class="btn btn-secondary">Learn More</button>
```

#### Outline Buttons
```html
<button class="btn btn-outline">Veridian Outline</button>
<button class="btn btn-outline-blue">Suggestly Outline</button>
```

### Cards

#### Basic Card
```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content goes here.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Navigation

#### Basic Navigation
```html
<nav class="nav">
  <a href="#" class="nav-brand">Brand</a>
  <div class="nav-links">
    <a href="#" class="nav-link">Home</a>
    <a href="#" class="nav-link">About</a>
    <a href="#" class="nav-link">Contact</a>
  </div>
</nav>
```

### Special Effects

#### Glass Morphism (Veridian Luxury)
```html
<div class="glass">
  <h3>Luxury Glass Effect</h3>
  <p>Content with premium glass morphism effect</p>
</div>
```

## Utility Classes

### Typography
- `.text-xs` to `.text-8xl`: Font sizes
- `.font-thin` to `.font-black`: Font weights
- `.font-inter`, `.font-playfair`: Font families
- `.leading-tight` to `.leading-loose`: Line heights

### Colors
- `.text-veridian-gold`, `.text-suggestly-blue`: Text colors
- `.bg-veridian-gold`, `.bg-suggestly-blue`: Background colors
- `.bg-gradient-gold`, `.bg-gradient-blue`: Gradient backgrounds

### Layout
- `.flex`, `.flex-col`: Flexbox utilities
- `.grid`, `.grid-cols-1` to `.grid-cols-4`: Grid layouts
- `.p-0` to `.p-16`: Padding utilities
- `.m-0` to `.m-16`: Margin utilities

### Responsive
- `.hidden`, `.md:hidden`, `.lg:hidden`: Display utilities
- `.grid-cols-1-md`, `.grid-cols-2-md`: Responsive grids

### Animations
- `.animate-fade-in`: Fade in animation
- `.animate-slide-up`: Slide up animation
- `.animate-float`: Floating animation
- `.animate-glow`: Glow effect animation

## JavaScript Utilities (DSUtils)

### DOM Manipulation
```javascript
// Get elements
const element = DSUtils.getElement('.my-class');
const elements = DSUtils.getElements('.my-items');

// Class management
DSUtils.addClass(element, 'active');
DSUtils.removeClass(element, 'inactive');
DSUtils.toggleClass(element, 'toggled');

// Event handling
DSUtils.on(element, 'click', handleClick);
DSUtils.off(element, 'click', handleClick);
```

### Theme Management
```javascript
// Theme controls
DSUtils.theme.set('dark');
DSUtils.theme.set('light');
DSUtils.theme.toggle();
DSUtils.theme.init(); // Initialize theme from storage
```

### Form Validation
```javascript
const rules = {
  email: [
    DSUtils.validation.required,
    DSUtils.validation.email
  ],
  name: [
    DSUtils.validation.required,
    { validator: (val) => DSUtils.validation.minLength(val, 2), message: 'Name too short' }
  ]
};

const result = DSUtils.validation.validateForm(form, rules);
if (result.isValid) {
  // Form is valid
} else {
  // Show errors from result.errors
}
```

### API Utilities
```javascript
// API calls
try {
  const data = await DSUtils.api.get('/api/data');
  const response = await DSUtils.api.post('/api/submit', formData);
} catch (error) {
  console.error('API error:', error);
}
```

### Device Detection
```javascript
// Device detection
if (DSUtils.device.isMobile()) {
  // Mobile specific code
}

if (DSUtils.device.isDesktop()) {
  // Desktop specific code
}
```

## Implementation Guidelines

### For Suggestly Application
1. **Primary Colors**: Use `--suggestly-blue` as primary, `--suggestly-dark` for backgrounds
2. **Typography**: Use Inter font for most text, Playfair Display for hero sections
3. **Components**: Use secondary buttons, outline-blue buttons, industrial styling
4. **Utilities**: Leverage grid layouts, card components, form validation

### For Veridian Application
1. **Primary Colors**: Use `--veridian-gold` as primary, `--veridian-dark` for backgrounds
2. **Typography**: Use Playfair Display for headings, Inter for body text
3. **Components**: Use primary buttons, glass effects, luxury styling
4. **Utilities**: Leverage animations, glass morphism, premium components

### Shared Implementation
Both applications should:
1. Import the design system CSS first
2. Use shared JavaScript utilities
3. Follow the spacing and typography systems
4. Implement responsive design patterns
5. Maintain accessibility standards

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome for Android 90+
- **Progressive Enhancement**: Graceful degradation for older browsers

## Accessibility

- **ARIA Labels**: Proper labeling for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Compatible with major screen readers
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Management**: Proper focus handling and visual indicators

## Performance

- **CSS Variables**: Efficient theming and customization
- **Utility Classes**: Minimal CSS footprint
- **Tree Shaking**: Unused styles can be removed
- **Caching**: Static assets can be effectively cached
- **Lazy Loading**: Components can be loaded on demand

## Customization

### Adding New Colors
```css
:root {
  --custom-color: #your-color;
  --custom-color-light: #lighter-variant;
  --custom-color-dark: #darker-variant;
}
```

### Creating New Components
```css
.my-component {
  /* Use design tokens */
  background: var(--suggestly-blue);
  color: var(--white);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  /* Use utility classes */
  @extend .shadow-md;
}
```

### Extending JavaScript Utilities
```javascript
// Add custom utility
DSUtils.myCustomUtility = {
  doSomething: () => {
    // Custom functionality
  }
};
```

## Contributing

1. **Follow the Design Tokens**: Always use existing design tokens before adding new ones
2. **Maintain Consistency**: Keep components consistent with existing patterns
3. **Test Accessibility**: Ensure all new components are accessible
4. **Document Changes**: Update documentation when adding or modifying components
5. **Performance First**: Consider performance implications of changes

## Version History

### v1.0.0
- Initial design system release
- Core design tokens and variables
- Shared components and utilities
- Documentation and implementation guidelines

---

This design system serves as the foundation for both Suggestly and Veridian applications, ensuring consistency while allowing each brand to maintain its unique identity and user experience.
