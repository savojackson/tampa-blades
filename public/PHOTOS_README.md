# Photo Organization Guide

This document explains how to organize photos in the Tampa Blades application.

## 📁 Folder Structure

```
public/
├── gallery/          # Gallery page photos
├── events/           # Event photos and thumbnails
├── members/          # User avatars and profile pictures
├── backgrounds/      # Background images for hero sections
└── logos/            # Brand logos and icons
```

## 🖼️ Photo Guidelines

### Gallery Photos (`/gallery/`)
- **Purpose**: Photos displayed on the Gallery page
- **Recommended**: High-quality skating event photos
- **Formats**: JPG, PNG, WebP
- **Sizes**: 800x600px or larger
- **Examples**: 
  - `skating-event-1.jpg`
  - `community-meetup.jpg`
  - `skate-park-session.jpg`

### Event Photos (`/events/`)
- **Purpose**: Event-specific images for event cards
- **Recommended**: Event venue photos, previous event highlights
- **Formats**: JPG, PNG
- **Sizes**: 400x300px for thumbnails
- **Examples**:
  - `friday-night-skate.jpg`
  - `skate-park-meetup.jpg`
  - `beginners-session.jpg`

### Member Avatars (`/members/`)
- **Purpose**: User profile pictures and default avatars
- **Recommended**: Square format, clear faces
- **Formats**: JPG, PNG
- **Sizes**: 200x200px or larger (square)
- **Examples**:
  - `default-avatar.jpg`
  - `user-1-avatar.jpg`
  - `admin-avatar.jpg`

### Background Images (`/backgrounds/`)
- **Purpose**: Hero section backgrounds and page backgrounds
- **Recommended**: Wide format, skating-related imagery
- **Formats**: JPG, PNG
- **Sizes**: 1920x1080px or larger
- **Examples**:
  - `hero-background.jpg`
  - `skating-sunset.jpg`
  - `community-background.jpg`

### Logos (`/logos/`)
- **Purpose**: Brand logos and icons
- **Recommended**: PNG with transparency
- **Formats**: PNG, SVG
- **Sizes**: Various sizes for different uses
- **Examples**:
  - `tampa-blades-logo.png`
  - `favicon.ico`
  - `logo-small.png`

## 📝 Usage in Code

### In React Components:
```jsx
// Gallery photos
<img src="/gallery/skating-event-1.jpg" alt="Skating Event" />

// Event photos
<img src="/events/friday-night-skate.jpg" alt="Friday Night Skate" />

// Member avatars
<img src="/members/user-avatar.jpg" alt="User Avatar" />

// Background images
<div style={{ backgroundImage: "url('/backgrounds/hero-background.jpg')" }}>

// Logos
<img src="/logos/tampa-blades-logo.png" alt="Tampa Blades Logo" />
```

## 🔄 Replacing Current Images

The application currently uses Unsplash URLs. To replace them:

1. **Add your photos** to the appropriate folders
2. **Update the image paths** in the code from:
   ```jsx
   src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"
   ```
   To:
   ```jsx
   src="/events/friday-night-skate.jpg"
   ```

## 📋 Current Image Locations in Code

- **Landing Page Events**: Lines 22, 31, 40 in App.tsx
- **Welcome Section**: Line 115 in App.tsx
- **AppCarousel**: Lines 2377-2473 in App.tsx

## 🎯 Best Practices

1. **Optimize images** for web (compress JPGs, use WebP when possible)
2. **Use descriptive filenames** (e.g., `friday-night-skate-2024.jpg`)
3. **Include alt text** for accessibility
4. **Maintain consistent aspect ratios** within each category
5. **Keep file sizes reasonable** (under 500KB for most images) 