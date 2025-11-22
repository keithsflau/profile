# SecSci Portal

A web portal for displaying and accessing all science experiment repositories in the SecSci branch.

## Overview

This portal provides a centralized interface to browse and access all interactive virtual science experiments in the SecSci repository. It features a modern, responsive design optimized for educational use.

## Features

- **Repository Listing**: Displays all available science experiments
- **Search Functionality**: Search experiments by name, description, or tags
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, science-themed interface with smooth animations
- **Easy Navigation**: Quick access to all experiments

## Deployment

### GitHub Pages Deployment

1. **Push to Repository**:
   ```bash
   git add SecSci/photosynthesis/
   git commit -m "Add SecSci portal"
   git push origin SecSci
   ```

2. **Enable GitHub Pages**:
   - Go to repository settings: `https://github.com/keithsflau/SecSci/settings/pages`
   - Select source: **Branch: SecSci**
   - Select folder: **/photosynthesis**
   - Click **Save**

3. **Access Portal**:
   - The portal will be available at: `https://keithsflau.github.io/SecSci/photosynthesis/`

### Local Development

1. **Navigate to directory**:
   ```bash
   cd SecSci/photosynthesis
   ```

2. **Open in browser**:
   - Simply open `index.html` in a web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (with http-server)
     npx http-server -p 8000
     ```

3. **Access at**: `http://localhost:8000`

## Adding New Repositories

To add a new repository to the portal, edit `script.js` and add an entry to the `repositories` array:

```javascript
{
    name: "Your Experiment Name",
    description: "Description of your experiment",
    icon: "🔬", // Choose an appropriate emoji
    url: "./your-experiment/", // Relative path or full URL
    branch: "SecSci",
    tags: ["biology", "chemistry", "physics"], // Relevant tags
    status: "active"
}
```

## File Structure

```
SecSci/photosynthesis/
├── index.html          # Main portal page
├── styles.css          # Styling and animations
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Customization

### Changing Colors

Edit `styles.css` and modify the color variables:
- Primary color: `#3498db` (blue)
- Text color: `#2c3e50` (dark gray)
- Background: Gradient with light blue tones

### Adding GitHub API Integration

To dynamically fetch repositories from GitHub:

1. Uncomment the `fetchRepositoriesFromGitHub()` function in `script.js`
2. Note: This requires a CORS proxy or backend API due to browser CORS restrictions
3. Alternatively, use GitHub Actions to generate the repository list and commit it

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This portal is part of the SecSci educational platform.

## Repository

- GitHub: `keithsflau/SecSci`
- Branch: `SecSci`
- Path: `/photosynthesis`

