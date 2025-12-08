# Razorpay Integration Setup Instructions

## 🔐 Setting Up Razorpay Credentials

The subscription management system is now fully implemented, but you need to add your Razorpay credentials to make it work.

### Step 1: Get Razorpay API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in to your account
3. Navigate to **Settings → API Keys**
4. Click on **Generate Test Key** (for testing) or **Generate Live Key** (for production)
5. You will get two keys:
   - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
   - **Key Secret**

### Step 2: Add Keys to .env File

Open `server/.env` file and replace the placeholder values:

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

**⚠️ IMPORTANT**: 
- Never commit these keys to Git
- Keep your Key Secret confidential
- Use Test mode keys for development

### Step 3: Restart the Server

After adding the keys, restart your server:
```bash
cd server
npm run dev
```

### Step 4: Add Razorpay Key to Client .env

Create or update `client/.env` file:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

Note: Only the Key ID is needed on the client side, NOT the Key Secret.

## 📋 Features Implemented

### 1. Subscription Management
- Premium Plan: ₹10/month with 10% discount = ₹9/month
- Purchase 1-12 months at a time
- Extend existing subscriptions
- View days remaining in current plan

### 2. Payment Integration
- Secure Razorpay payment gateway
- Signature verification for security
- Automatic order ID generation
- Support for multiple payment methods

### 3. Transaction History
- View all past transactions
- See transaction status (success/failed/pending)
- Display Razorpay payment IDs
- Show order IDs and amounts
- Date and time of each transaction

### 4. Plan History Timeline
- Visual timeline of all subscriptions
- Shows new purchases and extensions
- Active/expired status indicators
- Duration and amount for each subscription
- Start and end dates

### 5. Database Collections

#### Subscriptions Collection
- userId, planName, monthsPurchased
- startDate, endDate, isActive
- amountPaid, orderId, transactionId
- purchaseType (new/extension)

#### Transactions Collection
- userId, userEmail, orderId
- razorpayOrderId, razorpayPaymentId, razorpaySignature
- amount, currency, monthsPurchased
- status (created/pending/success/failed)
- paymentMethod, failureReason

## 🧪 Testing the Payment Flow

### Test Mode (Recommended for Development)

1. Use Razorpay test keys (starting with `rzp_test_`)
2. Use test card numbers:
   - **Success**: 4111 1111 1111 1111
   - **Failure**: 4111 1111 1111 1112
   - CVV: Any 3 digits
   - Expiry: Any future date

3. Test scenarios:
   - ✅ Successful payment
   - ❌ Failed payment
   - 🚫 Payment cancellation
   - 🔄 Extending active subscription
   - 🆕 Purchasing first subscription

### Payment Flow Steps

1. User selects number of months (1-12)
2. Clicks "Purchase Plan" or "Extend Plan"
3. Razorpay checkout modal opens
4. User completes payment
5. Payment signature verified on server
6. Subscription created/extended in database
7. Transaction record saved
8. UI updates with new subscription status

## 🔒 Security Features

- ✅ Razorpay signature verification
- ✅ Server-side payment validation
- ✅ Secure API endpoints
- ✅ Transaction status tracking
- ✅ Failed payment handling
- ✅ Payment cancellation tracking

## 📊 API Endpoints

All subscription endpoints are under `/api/subscriptions`:

- `GET /:userId/active` - Get active subscription
- `GET /:userId/history` - Get subscription history
- `GET /:userId/transactions` - Get transaction history
- `POST /create-order` - Create Razorpay order
- `POST /verify-payment` - Verify and process payment
- `POST /payment-failure` - Handle payment failures

## 🚀 Going Live

When ready for production:

1. Generate **Live API Keys** from Razorpay dashboard
2. Replace test keys with live keys in `.env`
3. Update `VITE_RAZORPAY_KEY_ID` in client `.env`
4. Test thoroughly with real payments (small amounts first)
5. Enable webhooks for payment notifications (optional)

## 💡 Notes

- Subscription automatically extends if user already has active plan
- Expired subscriptions are automatically marked as inactive
- All transactions are stored regardless of success/failure
- Payment modal dismissal is tracked as cancellation
- Timeline UI shows complete subscription journey

## 🐛 Troubleshooting

**Error: key_id is mandatory**
- Solution: Add `RAZORPAY_KEY_ID` to `server/.env`

**Payment modal not opening**
- Solution: Check browser console, ensure Razorpay script is loaded

**Payment verification failed**
- Solution: Check `RAZORPAY_KEY_SECRET` is correct in `.env`

**Transaction showing but subscription not created**
- Solution: Check server logs for verification errors
