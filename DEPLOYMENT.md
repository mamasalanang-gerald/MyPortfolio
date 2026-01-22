# Deployment Guide - Netlify

This guide will help you deploy your Angular portfolio to Netlify.

## Prerequisites

- GitHub account with your repository pushed
- Netlify account (sign up at https://netlify.com)
- Git installed locally

## Step 1: Push Your Code to GitHub

If you haven't already, push your project to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Connect to Netlify

### Option A: Using Netlify UI (Recommended)

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your portfolio repository
6. Netlify will auto-detect your build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/my-portfolio/browser`
7. Click **"Deploy site"**

### Option B: Using Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy your site
netlify deploy --prod
```

## Step 3: Configure Custom Domain (Optional)

1. In Netlify dashboard, go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow DNS configuration instructions

## Step 4: Enable HTTPS

Netlify automatically provides free HTTPS with Let's Encrypt. It's enabled by default.

## Build Configuration

The `netlify.toml` file in your project root contains:

- **Build command**: `npm run build` - Builds your Angular app
- **Publish directory**: `dist/my-portfolio/browser` - The output folder
- **Redirects**: All routes redirect to `index.html` for SPA routing

## Troubleshooting

### Build fails with "dist not found"

Make sure your `angular.json` output path matches the publish directory in `netlify.toml`.

### Routes not working (404 errors)

The `netlify.toml` includes redirect rules for SPA routing. If issues persist:
1. Check that `netlify.toml` is in your project root
2. Redeploy the site

### Environment Variables

If you need environment variables (like API keys):
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add your variables
3. Redeploy

## Continuous Deployment

Once connected to GitHub:
- Every push to your main branch automatically triggers a new build
- Netlify will deploy the new version automatically
- You can see build logs in the Netlify dashboard

## Performance Tips

- Your Angular build is optimized for production
- Assets are minified and tree-shaken
- Consider enabling Netlify's image optimization in Site settings

## Support

For more help:
- [Netlify Documentation](https://docs.netlify.com)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
