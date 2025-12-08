import Case from '../models/Case.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Generate unique numeric case ID
const generateCaseId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return timestamp + random;
};

// Upload image to Cloudinary from base64
const uploadToCloudinary = async (base64Image, caseId, index) => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: `veag_cases/${caseId}`,
      public_id: `image_${index}`,
      resource_type: 'image'
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Create new case
export const createCase = async (req, res) => {
  try {
    const { userId, cropName, diseaseObservation, images } = req.body;

    // Validation
    if (!userId || !cropName) {
      return res.status(400).json({ error: 'User ID and crop name are required' });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    if (images.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 images allowed' });
    }

    // Generate unique case ID
    let caseId = generateCaseId();
    
    // Ensure uniqueness
    let existingCase = await Case.findOne({ caseId });
    while (existingCase) {
      caseId = generateCaseId();
      existingCase = await Case.findOne({ caseId });
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (let i = 0; i < images.length; i++) {
      try {
        const imageData = await uploadToCloudinary(images[i], caseId, i);
        uploadedImages.push(imageData);
      } catch (error) {
        // If any image fails, delete already uploaded images
        for (const img of uploadedImages) {
          try {
            await cloudinary.uploader.destroy(img.publicId);
          } catch (deleteError) {
            console.error('Error deleting image:', deleteError);
          }
        }
        throw new Error(`Failed to upload image ${i + 1}`);
      }
    }

    // Create case document
    const newCase = new Case({
      caseId,
      userId,
      cropName,
      diseaseObservation: diseaseObservation || '',
      images: uploadedImages,
      status: 'pending'
    });

    await newCase.save();

    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      case: newCase
    });
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create case'
    });
  }
};

// Get all cases for a user
export const getUserCases = async (req, res) => {
  try {
    const { userId } = req.params;

    const cases = await Case.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      cases
    });
  } catch (error) {
    console.error('Error fetching user cases:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch cases'
    });
  }
};

// Get single case by ID
export const getCaseById = async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await Case.findOne({ caseId });

    if (!caseData) {
      return res.status(404).json({ 
        success: false,
        error: 'Case not found'
      });
    }

    res.json({
      success: true,
      case: caseData
    });
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch case'
    });
  }
};
