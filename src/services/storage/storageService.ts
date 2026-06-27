export const storageService = {
  uploadProductImage: async (data: any) => ({ success: true, url: '/placeholder.jpg', path: 'dummy' }),
  uploadBannerImage: async (data: any) => ({ success: true, url: '/placeholder.jpg', path: 'dummy' }),
  uploadFile: async (data: any, folder: string) => ({ success: true, url: '/placeholder.jpg', path: 'dummy' }),
  deleteFile: async (path: string) => ({ success: true }),
};
