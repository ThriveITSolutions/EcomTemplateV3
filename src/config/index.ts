import { storeConfig, getStoreConfig, updateStoreConfig } from './storeConfig';
import { themeConfig, getThemeConfig, updateThemeConfig, presetThemes, type ThemeConfig } from './themeConfig';
import { features, isFeatureEnabled, type FeatureKey } from './features';
import { paymentConfig, getPaymentConfig, type PaymentConfig } from './paymentConfig';
import { shippingConfig, getShippingConfig, type ShippingConfig } from './shippingConfig';
import { storageConfig, getStorageConfig, type StorageConfig } from './storageConfig';

export const config = {
  store: storeConfig,
  theme: themeConfig,
  features,
  payment: paymentConfig,
  shipping: shippingConfig,
  storage: storageConfig,
};

export {
  getStoreConfig,
  updateStoreConfig,
  getThemeConfig,
  updateThemeConfig,
  presetThemes,
  isFeatureEnabled,
  getPaymentConfig,
  getShippingConfig,
  getStorageConfig,
};

export type { ThemeConfig, PaymentConfig, ShippingConfig, StorageConfig };