# Cloudinary Configuration Guide

## Overview
The VeAg Project uses Cloudinary for storing and managing case images. You need to configure Cloudinary credentials to enable image uploads.

## Setup Steps

### 1. Create Cloudinary Account
1. Go to https://cloudinary.com/
2. Sign up for a free account
3. Verify your email

### 2. Get Your Credentials
After logging in to Cloudinary Dashboard:
1. Go to Dashboard (https://cloudinary.com/console)
2. Find your credentials in the "Account Details" section:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Add Credentials to .env File
Open `server/.env` and replace the placeholder values:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=veag-project
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 4. Restart Server
After adding credentials, restart your Node.js server:
```bash
cd server
npm start
```

## Image Storage Structure
Images are stored in Cloudinary with the following structure:
- **Folder:** `veag_cases/{caseId}/`
- **Filename:** `image_0`, `image_1`, `image_2`, etc.
- **Full Path Example:** `veag_cases/1733712345001234/image_0`

## Testing
To test if Cloudinary is working:
1. Ensure server is running with credentials configured
2. Go to Register Case page
3. Select a crop and upload 1-2 images
4. Submit the case
5. Check Cloudinary Dashboard → Media Library → You should see a new folder `veag_cases`

## Troubleshooting

### Error: "Invalid API credentials"
- Double-check your Cloud Name, API Key, and API Secret
- Ensure no extra spaces in .env file
- Restart the server after changes

### Error: "Upload failed"
- Check your internet connection
- Verify Cloudinary account is active
- Check server console for detailed error messages

### Images not displaying
- Verify image URLs in MongoDB (should start with `https://res.cloudinary.com/`)
- Check browser console for CORS errors
- Ensure Cloudinary account has sufficient quota

## Free Tier Limits
Cloudinary free tier includes:
- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month

This should be sufficient for development and testing.

## Security Notes
- **Never commit** `.env` file to Git
- Keep API Secret confidential
- Consider using environment-specific keys for production
- Enable signed uploads for production environment

## Additional Configuration (Optional)

### Image Optimization
The current setup uploads images as-is. To enable optimization, modify `server/controllers/caseController.js`:

```javascript
const result = await cloudinary.uploader.upload(imageBase64, {
  folder: `veag_cases/${caseId}`,
  public_id: `image_${index}`,
  resource_type: 'image',
  quality: 'auto',           // Auto quality
  fetch_format: 'auto',      // Auto format (WebP when supported)
  transformation: [
    { width: 1200, crop: 'limit' }  // Max width 1200px
  ]
});
```

### Upload Presets (Advanced)
For more control, create upload presets in Cloudinary Dashboard:
1. Settings → Upload → Upload Presets
2. Create new preset with desired transformations
3. Use preset name in upload configuration

## Support
For Cloudinary documentation: https://cloudinary.com/documentation
