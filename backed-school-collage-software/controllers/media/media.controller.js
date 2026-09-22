const Media = require("../../models/Media/Media");

exports.uploadAndStoreMedia = async (req, res) => {
  try {
    const { userId, feature, relatedId , academicYear} = req.body;
    // if (!userId || !feature) {
    //   return res.status(400).json({ error: 'userId and feature are required' });
    // }

    const media = new Media({
      userId,
      feature,
      filename: req.file.originalname,
      s3Key: req.fileUrl, // Extract key from URL
      url: req.fileUrl,
      fileType: req.file.mimetype,
      relatedId: relatedId || null,
      academicYear,
    });

    await media.save();
    res.status(201).json({ message: 'Media uploaded and stored successfully', data: media });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error during media upload' });
  }
};