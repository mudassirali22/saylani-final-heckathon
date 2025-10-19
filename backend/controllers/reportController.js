const Report = require('../models/Report');
const cloudinary = require('../config/cloudinary');
const { analyzeReport } = require('../utils/geminiHelper');

// Upload a new report

exports.uploadReport = async (req, res) => {
  try {
    const { title, reportType, date } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'healthmate-reports',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Analyze report with Gemini
    const aiSummary = await analyzeReport(uploadResult.secure_url, reportType);

    // Create report in database
    const report = await Report.create({
      user: req.user._id,
      title,
      reportType,
      date,
      fileUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      aiSummary
    });

    res.status(201).json({
      success: true,
      message: 'Report uploaded successfully',
      data: report
    });
  } catch (error) {
    console.error('Upload report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload report',
      error: error.message
    });
  }
};

// Get all reports for logged-in user

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id })
      .sort({ date: -1 });

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reports',
      error: error.message
    });
  }
};

//  Get single report

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if report belongs to user
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this report'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report',
      error: error.message
    });
  }
};

// Delete a report

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if report belongs to user
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report'
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(report.cloudinaryPublicId);

    // Delete from database
    await Report.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
};