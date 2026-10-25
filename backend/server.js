
const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = 3001;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 2,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Upload JPG, PNG, or WEBP images only."));
    }

    cb(null, true);
  },
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Fezmo backend is running!" });
});

app.post(
  "/api/visualize",
  upload.fields([
    { name: "sofaImage", maxCount: 1 },
    { name: "roomImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          error: "OPENAI_API_KEY is missing in backend/.env",
        });
      }

      const sofa = req.files?.sofaImage?.[0];
      const room = req.files?.roomImage?.[0];

      if (!sofa || !room) {
        return res.status(400).json({
          error: "Please upload both sofa and room photos.",
        });
      }

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const result = await openai.images.edit({
        model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
        image: [
          new File([room.buffer], room.originalname, {
            type: room.mimetype,
          }),
          new File([sofa.buffer], sofa.originalname, {
            type: sofa.mimetype,
          }),
        ],
        prompt:
          "The first image is the user's room. The second image is " +
          "the sofa reference. Create a photorealistic image placing " +
          "that exact sofa naturally inside the room. Preserve the " +
          "room's architecture, camera angle, windows, flooring, and " +
          "lighting. Match the sofa's color, shape, and upholstery " +
          "closely. Use realistic scale and shadows. Return only the " +
          "finished room image, without text or watermarks.",
        size: "1536x1024",
        quality: "medium",
      });

      const imageBase64 = result.data?.[0]?.b64_json;

      if (!imageBase64) {
        throw new Error("No generated image was returned.");
      }

      res.json({
        imageUrl: `data:image/png;base64,${imageBase64}`,
      });
    } catch (error) {
      console.error("AI generation error:", error.message);

      res.status(500).json({
        error:
          "Image generation failed. Check your API key, billing, " +
          "model access, and backend terminal.",
      });
    }
  }
);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: "Upload failed. Each image must be under 10 MB.",
    });
  }

  res.status(400).json({
    error: error.message || "Something went wrong.",
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
