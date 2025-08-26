export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'defaultSecretKey',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
};

export const loginConstants = {
  adminUser: process.env.ADMIN_USER || 'admin@admin.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
};