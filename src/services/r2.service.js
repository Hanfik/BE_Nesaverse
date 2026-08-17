const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');
require('dotenv').config();

const BUCKET = process.env.R2_BUCKET;
const PUBLIC_BASE = process.env.R2_PUBLIC_BASE_URL;

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

function generateKey(folder, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const id = crypto.randomUUID();
  return `uploads/${folder}/${id}.${ext}`;
}

async function createUploadUrl({ folder, filename, contentType, size }) {
  const key = generateKey(folder, filename);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 120 });
  const publicUrl = `${PUBLIC_BASE}/${key}`;

  return { uploadUrl, publicUrl, key };
}

module.exports = { createUploadUrl };
