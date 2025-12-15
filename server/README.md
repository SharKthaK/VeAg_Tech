# VeAg Server - Backend API

The backend server for VeAg (Vacant Vectors Agriculture), providing RESTful APIs for crop disease detection, user management, case processing, and payment integration.

## 🌟 Overview

VeAg Server is a Node.js/Express backend that powers the VeAg platform with:
- User authentication and profile management
- Case registration and processing
- AI model integration via Gradio
- Subscription and payment handling (Razorpay)
- Cloud image storage (Cloudinary)
- MongoDB database management

## 🏗️ Tech Stack

### Core Technologies
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### Key Services
- **Cloudinary** - Image storage and management
- **Gradio Client** - ML model integration
- **Razorpay** - Payment gateway
- **Firebase Admin** - Authentication verification (optional)

### Utilities
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **express-validator** - Request validation
- **multer** - File upload handling
- **form-data** - Multipart form data

## 📁 Project Structure

```
server/
├── config/
│   ├── cloudinary.js           # Cloudinary configuration
│   └── db.js                   # MongoDB connection
├── controllers/
│   ├── caseController.js       # Case management logic
│   ├── cropController.js       # Crop data operations
│   ├── subscriptionController.js # Payment & subscription
│   └── userController.js       # User management
├── models/
│   ├── Case.js                 # Case schema
│   ├── CaseResult.js           # Analysis results schema
│   ├── Crop.js                 # Crop information schema
│   ├── NameHistory.js          # User name changes
│   ├── Subscription.js         # Subscription plans
│   ├── Transaction.js          # Payment transactions
│   └── User.js                 # User schema
├── routes/
│   ├── caseRoutes.js           # Case endpoints
│   ├── cropRoutes.js           # Crop endpoints
│   ├── subscriptionRoutes.js   # Subscription endpoints
│   └── userRoutes.js           # User endpoints
├── services/
│   └── gradioService.js        # Gradio ML integration
├── temp/                        # Temporary file storage
├── server.js                    # Application entry point
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher (local or Atlas)
- Cloudinary account
- Razorpay account (for payments)
- Gradio space deployed (for ML inference)

### Installation

1. **Navigate to server directory**
   ```bash
   cd VeAg_Project/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `server/` directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/veag
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veag
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Gradio Configuration
   GRADIO_SPACE_URL=sharkthak/VeAg
   # Or use your own Gradio space URL
   
   # CORS Configuration (optional)
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the server**

   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```
   
   The server will be available at `http://localhost:5000`

5. **Seed the database with default crops**
   
   After starting the server, seed initial crops using one of these methods:
   
   **Option 1: Using the provided script**
   ```bash
   # Linux/Mac
   chmod +x seed-crops.sh
   ./seed-crops.sh
   
   # Windows
   seed-crops.bat
   ```
   
   **Option 2: Using curl**
   ```bash
   curl -X POST http://localhost:5000/api/crops/seed
   ```
   
   **Option 3: Using Postman or similar tool**
   - Method: POST
   - URL: `http://localhost:5000/api/crops/seed`
   
   This adds default crops: Rice, Wheat, Maize

### Verify Installation

Check if the server is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "VeAg Server is running",
  "timestamp": "2024-12-15T10:30:00.000Z"
}
```

## 📡 API Endpoints

### User Management

#### Authenticate/Create User
```http
POST /api/users/auth
Content-Type: application/json

{
  "firebaseUid": "string",
  "email": "user@example.com",
  "name": "John Doe",
  "photoURL": "https://..."
}
```

#### Get User Profile
```http
GET /api/users/:userId
```

#### Update User Profile
```http
PUT /api/users/:userId
Content-Type: application/json

{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

#### Get Name History
```http
GET /api/users/:userId/name-history
```

### Case Management

#### Create New Case
```http
POST /api/cases
Content-Type: application/json

{
  "userId": "string",
  "cropName": "Rice",
  "diseaseObservation": "Brown spots on leaves",
  "images": ["data:image/jpeg;base64,...", "..."]
}
```

#### Get User Cases
```http
GET /api/cases/user/:userId
```

#### Get Case Details
```http
GET /api/cases/:caseId
```

#### Process Case with AI
```http
POST /api/cases/:caseId/process
```

#### Delete Case
```http
DELETE /api/cases/:caseId
```

### Subscription Management

#### Get Subscription Status
```http
GET /api/subscriptions/:userId
```

#### Create Payment Order
```http
POST /api/subscriptions/create-order
Content-Type: application/json

{
  "userId": "string",
  "planType": "premium"
}
```

#### Verify Payment
```http
POST /api/subscriptions/verify-payment
Content-Type: application/json

{
  "razorpay_order_id": "string",
  "razorpay_payment_id": "string",
  "razorpay_signature": "string",
  "userId": "string",
  "planType": "premium"
}
```

#### Get Transaction History
```http
GET /api/subscriptions/:userId/transactions
```

### Crop Information

#### Get All Crops
```http
GET /api/crops
```

#### Add New Crop
```http
POST /api/crops
Content-Type: application/json

{
  "name": "Wheat",
  "scientificName": "Triticum aestivum",
  "commonDiseases": ["Rust", "Blight"]
}
```

#### Seed Default Crops (Development)
```http
POST /api/crops/seed
```

Seeds the database with default crops (Rice, Wheat, Maize). Only works if no crops exist.

## 🗄️ Database Models

### User Model
```javascript
{
  userId: String (unique),
  email: String (unique),
  name: String,
  photoURL: String,
  firebaseUid: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Case Model
```javascript
{
  caseId: String (unique),
  userId: String,
  cropName: String,
  diseaseObservation: String,
  images: [{
    url: String,
    publicId: String
  }],
  status: String (pending|processing|completed|failed),
  createdAt: Date,
  updatedAt: Date
}
```

### CaseResult Model
```javascript
{
  caseId: String (unique),
  diseaseDetected: String,
  confidence: Number,
  recommendations: String,
  causes: [String],
  treatment: [String],
  prevention: [String],
  processedAt: Date
}
```

### Subscription Model
```javascript
{
  userId: String (unique),
  planType: String (free|premium),
  startDate: Date,
  endDate: Date,
  casesUsed: Number,
  casesLimit: Number,
  isActive: Boolean
}
```

### Transaction Model
```javascript
{
  userId: String,
  orderId: String,
  paymentId: String,
  amount: Number,
  currency: String,
  status: String (created|success|failed),
  planType: String,
  createdAt: Date
}
```

## 🤖 AI Model Integration

### Gradio Service

The server integrates with a Gradio-hosted ML model for disease detection:

**Process Flow:**
1. Client uploads images (base64)
2. Server uploads to Cloudinary
3. Server downloads images to temp directory
4. Gradio client processes images
5. Results saved to database
6. Temp files cleaned up

**Configuration:**
- Default Space: `sharkthak/VeAg`
- Custom spaces supported via `GRADIO_SPACE_URL`
- Automatic connection management
- Error handling and retry logic

**Supported Models:**
- Best Overall (automatic selection)
- ConvNeXt-Base
- EfficientNetV2-M
- DeiT-Small
- Ensemble (with custom weights)

**Note**: The Gradio model interface includes AI-powered treatment advice via Google Gemini API. This feature is not yet integrated into the main VeAg server/client but is available in the standalone model interface (`model/client/app.py`). Integration planned for v4.0.0.

## 💳 Payment Integration

### Razorpay Setup

1. **Create Razorpay Account**
   - Sign up at https://razorpay.com
   - Get API keys from Dashboard

2. **Configure Plans**
   ```javascript
   const plans = {
     free: {
       casesLimit: 5,
       price: 0
     },
     premium: {
       casesLimit: -1, // unlimited
       price: 999, // INR
       duration: 30 // days
     }
   };
   ```

3. **Payment Flow**
   - Create order → Get order_id
   - Client completes payment
   - Verify signature on server
   - Activate subscription

## ☁️ Cloudinary Configuration

### Setup

1. **Create Cloudinary Account**
   - Sign up at https://cloudinary.com
   - Get cloud name and API credentials

2. **Folder Structure**
   ```
   veag_cases/
   ├── <caseId>/
   │   ├── image_0
   │   ├── image_1
   │   └── ...
   ```

3. **Upload Configuration**
   - Format: JPEG/PNG
   - Max size: 10MB per image
   - Automatic optimization
   - Secure URLs

## 🔒 Security

### Environment Variables
- Never commit `.env` to version control
- Use different keys for development/production
- Rotate API keys regularly

### Data Validation
- Input validation with express-validator
- Mongoose schema validation
- File type and size checks

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Rate Limiting (Recommended)
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check MongoDB is running
   mongod --version
   
   # Or use MongoDB Atlas connection string
   MONGODB_URI=mongodb+srv://...
   ```

2. **Cloudinary Upload Errors**
   - Verify API credentials
   - Check image size (max 10MB)
   - Ensure base64 format is correct

3. **Gradio Connection Issues**
   - Verify Gradio space is running
   - Check `GRADIO_SPACE_URL` in `.env`
   - Ensure space is public or accessible

4. **Payment Verification Failed**
   - Verify Razorpay credentials
   - Check signature verification logic
   - Ensure webhook secret is correct

5. **CORS Errors**
   - Add client URL to CORS configuration
   - Verify `CLIENT_URL` in `.env`
   - Check browser console for specific errors

## 📦 Dependencies

### Production Dependencies
```json
{
  "@gradio/client": "^2.0.0",
  "cloudinary": "^2.8.0",
  "cors": "^2.8.5",
  "dotenv": "^16.4.1",
  "express": "^4.18.2",
  "express-validator": "^7.0.1",
  "form-data": "^4.0.5",
  "mongoose": "^8.1.1",
  "multer": "^2.0.2",
  "node-fetch": "^2.7.0",
  "razorpay": "^2.9.6"
}
```

## 🚀 Deployment

### Railway / Render / Heroku

1. **Prepare for deployment**
   ```bash
   # Ensure package.json has start script
   "scripts": {
     "start": "node server.js"
   }
   ```

2. **Set environment variables**
   - Add all `.env` variables in platform settings
   - Use production MongoDB URI
   - Update `CLIENT_URL` to production URL

3. **Deploy**
   ```bash
   git push railway main
   # or
   git push heroku main
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t veag-server .
docker run -p 5000:5000 --env-file .env veag-server
```

### MongoDB Atlas Setup

1. Create cluster at https://cloud.mongodb.com
2. Create database user
3. Whitelist IP addresses (or allow all: 0.0.0.0/0)
4. Get connection string
5. Update `MONGODB_URI` in `.env`

## 📊 Monitoring

### Logging
```javascript
// Development
console.log('Request received:', req.body);

// Production - use logging service
import winston from 'winston';
```

### Health Checks
- Endpoint: `/api/health`
- Monitor uptime
- Check database connectivity

## 🔄 Version History

- **v3.3.3** - Current version
  - Gradio integration
  - Subscription system
  - Enhanced error handling
  - Performance optimizations

## 📄 License

This project is part of the VeAg platform. All rights reserved.

## 🤝 Contributing

This is a final year project. For contributions or suggestions, please contact the project maintainers.

## 📞 Support

For issues or questions:
1. Check this README and troubleshooting section
2. Review client documentation (`../client/README.md`)
3. Check model documentation (`../model/README.md`)

---

**VeAg Server** - Powering AI-driven agriculture solutions.
