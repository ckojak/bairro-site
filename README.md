# Bairro Site - Instagram Gallery Integration

A local business community platform with dynamic Instagram gallery integration for collaborators.

## Features

### Instagram Gallery Integration
- ✅ Dynamic fetching and display of Instagram images from collaborator profiles
- ✅ Instagram URL validation with proper format checking
- ✅ Responsive grid layout for image galleries
- ✅ Privacy checks (only public profiles display images)
- ✅ Automatic caching (1 hour) with manual refresh capability
- ✅ Periodic auto-refresh every 30 minutes
- ✅ Admin panel for managing Instagram URLs
- ✅ XSS protection with HTML escaping

## Setup

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
```

The site will be available at `http://localhost:3000`

## Usage

### Main Site (`index.html`)
- Displays all collaborators with their Instagram galleries
- Each gallery shows up to 12 recent posts from the Instagram profile
- Click on any image to view it in full size
- Use the "Refresh" button to manually update gallery images
- Images are automatically refreshed every 30 minutes

### Admin Panel (`admin.html`)
Access the admin panel at `http://localhost:3000/admin.html` to:
- View all collaborators and their current Instagram URLs
- Update Instagram URLs for collaborators
- Validate Instagram URLs before saving
- See normalized URL format

## API Endpoints

### Public Endpoints

#### Get All Collaborators
```
GET /collaborators
```

#### Get Instagram Images for Collaborator
```
GET /api/instagram/:id
Query Parameters:
  - refresh=true (optional) - Force refresh cached data
```

#### Validate Instagram URL
```
POST /api/validate-instagram
Body: { "url": "https://www.instagram.com/username" }
```

### Admin Endpoints

#### Add New Collaborator
```
POST /admin/add-collaborator
Body: {
  "name": "Business Name",
  "email": "email@example.com",
  "description": "Description",
  "instagramUrl": "https://www.instagram.com/username",
  "facebookUrl": "https://www.facebook.com/page"
}
```

#### Update Instagram URL
```
PUT /admin/collaborator/:id/instagram
Body: { "instagramUrl": "https://www.instagram.com/username" }
```

## Instagram URL Format

Valid Instagram URLs must follow this format:
```
https://www.instagram.com/username
https://instagram.com/username
http://www.instagram.com/username
```

Usernames can contain:
- Letters (a-z, A-Z)
- Numbers (0-9)
- Periods (.)
- Underscores (_)

## Privacy & Security

### Privacy Features
- ✅ Only public Instagram profiles are displayed
- ✅ Private profiles show an appropriate message
- ✅ No authentication required for viewing public content
- ✅ Respects Instagram's public data policies

### Security Features
- ✅ Input validation for all Instagram URLs
- ✅ XSS protection with HTML escaping
- ✅ Error handling for failed requests
- ✅ Rate limiting through caching mechanism

## Technical Details

### Caching
- Instagram data is cached for 1 hour (configurable via `INSTAGRAM_CACHE_DURATION` in `.env`)
- Manual refresh clears the cache for that specific profile
- Automatic refresh occurs every 30 minutes in the browser

### Fallback Handling
When Instagram data cannot be fetched:
- Placeholder images are displayed
- Informative message explains the situation
- User can try manual refresh

### Responsive Design
- Mobile-first approach
- Grid layout adapts to screen size:
  - Desktop: Auto-fill columns (minimum 200px)
  - Tablet: Auto-fill columns (minimum 150px)
  - Mobile: 2 columns

## File Structure

```
bairro-site/
├── index.html              # Main site with Instagram galleries
├── admin.html              # Admin panel for managing Instagram URLs
├── index.js                # Express server with API endpoints
├── instagramValidator.js   # Instagram URL validation utilities
├── instagramFetcher.js     # Instagram data fetching logic
├── package.json            # Dependencies and scripts
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Development Notes

### Instagram API Considerations
Currently, the implementation uses publicly available Instagram data. For production use, consider:
- Using Instagram's official Graph API for more reliable data
- Implementing proper OAuth authentication
- Handling API rate limits
- Implementing webhook subscriptions for real-time updates

### Future Enhancements
- Add image lightbox/modal for better viewing experience
- Implement image carousel/slider option
- Add filters for different post types (photos, videos, reels)
- Include engagement metrics (likes, comments)
- Add search/filter capabilities
- Implement user roles and permissions for admin panel

## Troubleshooting

### Images Not Loading
- Verify the Instagram URL is correct and public
- Try the manual refresh button
- Check browser console for errors
- Ensure the profile is not private

### Validation Errors
- Ensure URL format is correct: `https://www.instagram.com/username`
- Check for typos in the username
- Remove any trailing slashes or query parameters

## License

ISC
