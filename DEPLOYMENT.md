# VS Code Clone - Deployment Guide

This guide provides comprehensive instructions for building, testing, and deploying the VS Code Clone editor application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Building for Production](#building-for-production)
4. [Testing](#testing)
5. [Deployment Options](#deployment-options)
6. [Performance Optimization](#performance-optimization)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying the application, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **pnpm**: Version 8.0 or higher (package manager)
- **Git**: For version control
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

### Verify Installation

```bash
node --version    # Should be v18.0.0 or higher
pnpm --version    # Should be 8.0.0 or higher
git --version     # Should be 2.30.0 or higher
```

---

## Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vscode-clone
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all required packages including:
- React 19
- TypeScript
- Monaco Editor
- Tailwind CSS 4
- Zustand
- And other dependencies

### 3. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### 4. Development Workflow

During development, the application supports:
- **Hot Module Replacement (HMR)**: Changes are reflected instantly
- **TypeScript Checking**: Real-time type checking
- **Source Maps**: Full debugging capabilities

---

## Building for Production

### 1. Build the Application

```bash
pnpm build
```

This command will:
- Compile TypeScript to JavaScript
- Bundle React components
- Optimize CSS with Tailwind
- Generate production-ready assets in the `dist/` directory

### 2. Preview Production Build

```bash
pnpm preview
```

This starts a local server serving the production build for testing.

### 3. Build Output

The build process generates:
- `dist/public/` - Static assets (CSS, JS, images)
- `dist/index.html` - Main HTML file
- Source maps for debugging (optional)

---

## Testing

### 1. Type Checking

Verify TypeScript compilation:

```bash
pnpm check
```

### 2. Manual Testing Checklist

Before deployment, test the following features:

**File Management:**
- [ ] Create new files (Ctrl+N)
- [ ] Open files from sidebar
- [ ] Close files (Ctrl+W)
- [ ] Delete files
- [ ] Verify dirty state indicators

**Editing:**
- [ ] Syntax highlighting for multiple languages
- [ ] Code editing and updates
- [ ] Cursor position tracking
- [ ] Line number display

**Navigation:**
- [ ] Command Palette (Ctrl+K Ctrl+P)
- [ ] Find (Ctrl+F)
- [ ] Go to Line (Ctrl+G)
- [ ] Tab switching (Ctrl+Tab)

**UI Components:**
- [ ] Sidebar toggle (Ctrl+B)
- [ ] Settings panel (Ctrl+,)
- [ ] Keyboard shortcuts (Ctrl+Shift+?)
- [ ] Status bar information

**Search & Replace:**
- [ ] Find text
- [ ] Replace text
- [ ] Replace all
- [ ] Regex support
- [ ] Case sensitivity
- [ ] Whole word matching

### 3. Performance Testing

Monitor performance metrics:

```bash
# Check bundle size
pnpm build

# Measure performance in browser DevTools
# - Lighthouse audit
# - Performance tab
# - Network tab
```

### 4. Cross-Browser Testing

Test on multiple browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

---

## Deployment Options

### Option 1: Static Hosting (Recommended for Web)

The application is a static React app and can be deployed to any static hosting service.

#### Netlify

1. Connect your Git repository to Netlify
2. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
3. Deploy automatically on push

#### Vercel

1. Import project from Git
2. Vercel auto-detects the build setup
3. Deploy with one click

#### AWS S3 + CloudFront

1. Build the application: `pnpm build`
2. Upload `dist/` to S3 bucket
3. Configure CloudFront distribution
4. Set cache headers for optimal performance

#### GitHub Pages

1. Update `vite.config.ts` with your repository name
2. Build: `pnpm build`
3. Deploy using GitHub Actions

### Option 2: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t vscode-clone .
docker run -p 80:80 vscode-clone
```

### Option 3: Node.js Server

For advanced deployments with backend integration:

```bash
pnpm build
pnpm start
```

This starts a Node.js server on port 3000.

---

## Performance Optimization

### 1. Code Splitting

The application uses dynamic imports for optimal code splitting:
- Components load on demand
- Reduced initial bundle size
- Faster time to interactive

### 2. Caching Strategy

Configure cache headers:

```
# Static assets (long-term cache)
/assets/*
Cache-Control: public, max-age=31536000, immutable

# HTML (no cache)
/index.html
Cache-Control: no-cache, no-store, must-revalidate

# API responses (if applicable)
/api/*
Cache-Control: public, max-age=3600
```

### 3. Compression

Enable gzip compression on your server:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 4. Content Delivery Network (CDN)

Use a CDN for global distribution:
- CloudFlare
- AWS CloudFront
- Akamai
- Fastly

### 5. Monitoring

Set up monitoring and analytics:
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- User analytics (Plausible, Fathom)

---

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_APP_TITLE=VS Code Clone
VITE_APP_LOGO=/logo.svg
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

---

## Security Considerations

### 1. Content Security Policy (CSP)

Add CSP headers to prevent XSS attacks:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline';
```

### 2. HTTPS

Always use HTTPS in production:
- Obtain SSL certificate from Let's Encrypt
- Redirect HTTP to HTTPS
- Enable HSTS headers

### 3. Dependencies

Keep dependencies up to date:

```bash
pnpm update
pnpm audit
```

### 4. Code Review

Implement code review process before deployment:
- Pull request reviews
- Automated testing
- Security scanning

---

## Troubleshooting

### Common Issues

#### 1. Build Fails with TypeScript Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

#### 2. Monaco Editor Not Loading

Ensure `@monaco-editor/react` is properly installed:

```bash
pnpm add @monaco-editor/react
pnpm build
```

#### 3. Styles Not Applied

Clear browser cache and rebuild:

```bash
# Hard refresh in browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
pnpm build
```

#### 4. Performance Issues

Profile the application:

```bash
# Use Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to Performance tab
# 3. Record and analyze
```

#### 5. CORS Issues

If deploying with backend:

```javascript
// Configure CORS headers on your server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
```

---

## Monitoring & Maintenance

### 1. Health Checks

Implement health check endpoint:

```bash
# Test deployment
curl https://your-domain.com/
```

### 2. Error Tracking

Monitor errors in production:
- Set up Sentry for error tracking
- Configure alerts for critical errors
- Review error logs regularly

### 3. Performance Metrics

Track key metrics:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

### 4. User Feedback

Collect user feedback:
- In-app feedback widget
- Support email
- GitHub issues

---

## Rollback Procedure

If deployment fails:

1. Identify the issue
2. Revert to previous version:
   ```bash
   git revert <commit-hash>
   pnpm build
   # Deploy previous version
   ```
3. Investigate root cause
4. Fix and test thoroughly
5. Deploy again

---

## Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Support & Resources

- **Documentation**: See [README.md](./README.md)
- **Issues**: Report bugs on GitHub
- **Discussions**: Join community discussions
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Checklist Before Production Deployment

- [ ] All tests pass
- [ ] TypeScript compilation successful
- [ ] No console errors or warnings
- [ ] Performance optimized
- [ ] Security review completed
- [ ] Environment variables configured
- [ ] Monitoring and error tracking set up
- [ ] Backup and rollback plan ready
- [ ] Documentation updated
- [ ] Team notified of deployment

---

**Last Updated**: January 2026
**Version**: 1.0.0
