function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variabel lingkungan wajib tidak ada: ${name}`);
  return value;
}

export const env = {
  googleServiceAccountEmail: () => required("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  googlePrivateKey: () => required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  googleSpreadsheetId: () => required("GOOGLE_SPREADSHEET_ID"),
  cloudinaryCloudName: () => required("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: () => required("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: () => required("CLOUDINARY_API_SECRET"),
};

export function getJwtSecret(): string {
  return required("JWT_SECRET");
}
