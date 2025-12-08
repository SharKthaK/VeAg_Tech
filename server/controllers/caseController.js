import Case from '../models/Case.js';
import CaseResult from '../models/CaseResult.js';
import cloudinary from '../config/cloudinary.js';
import gradioService from '../services/gradioService.js';
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

// Process case with Gradio AI model
export const processCase = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { caseId } = req.params;

    // Find the case
    const caseData = await Case.findOne({ caseId });

    if (!caseData) {
      return res.status(404).json({ 
        success: false,
        error: 'Case not found'
      });
    }

    // Check if case is already processing or completed
    if (caseData.status === 'processing') {
      return res.status(400).json({
        success: false,
        error: 'Case is already being processed'
      });
    }

    if (caseData.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Case has already been processed'
      });
    }

    // Update status to processing
    caseData.status = 'processing';
    await caseData.save();

    // Send immediate response that processing has started
    res.json({
      success: true,
      message: 'Processing started',
      caseId: caseData.caseId
    });

    // Process in background
    (async () => {
      try {
        // Process with Gradio
        const result = await gradioService.processCase(caseData.images);

        if (result.success) {
          const processingTime = Date.now() - startTime;

          // Save result to CaseResult collection
          await CaseResult.create({
            caseId: caseData.caseId,
            userId: caseData.userId,
            cropName: caseData.cropName,
            diseaseStatus: result.diseaseStatus,
            modelResponse: result.fullResponse,
            processingTime
          });

          // Update case status to completed
          caseData.status = 'completed';
          await caseData.save();

          console.log(`Case ${caseId} processed successfully`);
        } else {
          // Update case status to failed with error
          caseData.status = 'failed';
          await caseData.save();

          console.error(`Case ${caseId} processing failed:`, result.error);
        }
      } catch (error) {
        console.error(`Background processing error for case ${caseId}:`, error);
        caseData.status = 'failed';
        await caseData.save();
      }
    })();

  } catch (error) {
    console.error('Error processing case:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to process case'
    });
  }
};

// Get case result
export const getCaseResult = async (req, res) => {
  try {
    const { caseId } = req.params;

    const result = await CaseResult.findOne({ caseId });

    if (!result) {
      return res.status(404).json({ 
        success: false,
        error: 'Result not found'
      });
    }

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch result'
    });
  }
};
