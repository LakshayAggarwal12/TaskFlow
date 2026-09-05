// Standalone Cloudinary UPLOAD diagnostic
//
// This tests:
// 1. Cloudinary configuration/authentication
// 2. Network connectivity to Cloudinary
// 3. A real image upload
// 4. Cleanup of the uploaded test file
//
// Run:
//   cd backend
//   node check-cloudinary-upload.js

require("dotenv").config();

const https = require("https");
const cloudinary = require("cloudinary").v2;

// --------------------------------------------------
// Cloudinary configuration
// --------------------------------------------------

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------------------------------------------------
// Check environment variables
// --------------------------------------------------

console.log("\n=== CLOUDINARY CONFIG CHECK ===");

console.log(
  "Cloud name:",
  process.env.CLOUDINARY_CLOUD_NAME
    ? "✓ Present"
    : "✗ Missing"
);

console.log(
  "API key:",
  process.env.CLOUDINARY_API_KEY
    ? "✓ Present"
    : "✗ Missing"
);

console.log(
  "API secret:",
  process.env.CLOUDINARY_API_SECRET
    ? "✓ Present"
    : "✗ Missing"
);

// --------------------------------------------------
// Test network connectivity
// --------------------------------------------------

function checkNetwork() {
  return new Promise((resolve, reject) => {
    console.log("\n=== NETWORK CHECK ===");
    console.log("Connecting to Cloudinary...");

    const request = https.get(
      "https://api.cloudinary.com",
      (response) => {
        console.log(
          `✓ Cloudinary reachable (HTTP ${response.statusCode})`
        );

        response.resume();
        resolve();
      }
    );

    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error("Connection to Cloudinary timed out"));
    });

    request.on("error", reject);
  });
}

// --------------------------------------------------
// Tiny test image
// --------------------------------------------------

const TINY_PNG_DATA_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

// --------------------------------------------------
// Real upload test
// --------------------------------------------------

async function testUpload() {
  console.log("\n=== REAL UPLOAD TEST ===");

  console.log(
    "Attempting tiny image upload..."
  );

  try {
    const result = await cloudinary.uploader.upload(
      TINY_PNG_DATA_URI,
      {
        folder: "taskflow/_diagnostic",
        resource_type: "image",
      }
    );

    console.log("\n✓ IMAGE UPLOAD SUCCESS");

    console.log("Public ID:", result.public_id);
    console.log("Resource type:", result.resource_type);
    console.log("Secure URL:", result.secure_url);

    // ------------------------------------------------
    // Cleanup
    // ------------------------------------------------

    console.log("\nCleaning up test file...");

    await cloudinary.uploader.destroy(
      result.public_id,
      {
        resource_type: "image",
      }
    );

    console.log("✓ Test file deleted");

  } catch (err) {
    console.log("\n✗ IMAGE UPLOAD FAILED");

    console.log("\n--- Cloudinary Error Details ---");

    console.log("HTTP code:", err.http_code);
    console.log("Message:", err.message);

    if (err.error) {
      console.log(
        "Nested error:",
        JSON.stringify(err.error, null, 2)
      );
    }

    console.log(
      "\nFull error object:"
    );

    console.log(
      JSON.stringify(
        err,
        Object.getOwnPropertyNames(err),
        2
      )
    );

    throw err;
  }
}

// --------------------------------------------------
// Main
// --------------------------------------------------

async function main() {
  try {
    await checkNetwork();
    await testUpload();

    console.log("\n=================================");
    console.log("CLOUDINARY DIAGNOSTIC PASSED");
    console.log("=================================\n");

  } catch (err) {
    console.log("\n=================================");
    console.log("CLOUDINARY DIAGNOSTIC FAILED");
    console.log("=================================\n");

    process.exitCode = 1;
  }
}

main();