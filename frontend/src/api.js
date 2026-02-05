const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const text = await response.text();
    if (text) {
      try {
        const parsed = JSON.parse(text);
        const message = Array.isArray(parsed?.message)
          ? parsed.message.join(', ')
          : parsed?.message;
        throw new Error(message || text);
      } catch {
        throw new Error(text || 'Request failed');
      }
    }
    throw new Error('Request failed');
  }
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  getProducts: () => request('/products'),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  getRawMaterials: () => request('/raw-materials'),
  createRawMaterial: (data) => request('/raw-materials', { method: 'POST', body: JSON.stringify(data) }),
  updateRawMaterial: (id, data) => request(`/raw-materials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRawMaterial: (id) => request(`/raw-materials/${id}`, { method: 'DELETE' }),

  getProductMaterials: () => request('/product-materials'),
  createProductMaterial: (productId, rawMaterialId, quantityRequired) =>
    request(
      `/product-materials?productId=${productId}&rawMaterialId=${rawMaterialId}&quantityRequired=${quantityRequired}`,
      { method: 'POST' }
    ),
  updateProductMaterial: (id, productId, rawMaterialId, quantityRequired) =>
    request(
      `/product-materials/${id}?productId=${productId}&rawMaterialId=${rawMaterialId}&quantityRequired=${quantityRequired}`,
      { method: 'PUT' }
    ),
  deleteProductMaterial: (id) => request(`/product-materials/${id}`, { method: 'DELETE' }),

  getProductionPlan: () => request('/production-plan')
};
