import { useEffect, useState } from 'react';
import { api } from './api.js';

export default function App() {
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [productMaterials, setProductMaterials] = useState([]);
  const [plan, setPlan] = useState({ items: [], totalValue: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [productForm, setProductForm] = useState({ id: null, code: '', name: '', price: '' });
  const [materialForm, setMaterialForm] = useState({ id: null, code: '', name: '', stockQuantity: '' });
  const [associationForm, setAssociationForm] = useState({
    productId: '',
    rawMaterialId: '',
    quantityRequired: ''
  });

  function formatError(err, fallback) {
    if (!err) return fallback;
    if (typeof err === 'string') return err;
    if (typeof err.message === 'string') return err.message;
    if (err.message && typeof err.message === 'object') return JSON.stringify(err.message);
    try {
      return JSON.stringify(err);
    } catch {
      return fallback;
    }
  }

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [productData, materialData, productMaterialData, planData] = await Promise.all([
        api.getProducts(),
        api.getRawMaterials(),
        api.getProductMaterials(),
        api.getProductionPlan()
      ]);
      setProducts(productData);
      setRawMaterials(materialData);
      setProductMaterials(productMaterialData);
      setPlan(planData);
    } catch (err) {
      setError(formatError(err, 'Failed to load data'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleCreateOrUpdateProduct(e) {
    e.preventDefault();
    setError('');
    const payload = {
      code: productForm.code.trim(),
      name: productForm.name.trim(),
      price: Number(productForm.price)
    };
    try {
      if (productForm.id) {
        await api.updateProduct(productForm.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setProductForm({ id: null, code: '', name: '', price: '' });
      await loadAll();
    } catch (err) {
      setError(formatError(err, 'Failed to save product'));
    }
  }

  async function handleDeleteProduct(id) {
    setError('');
    try {
      await api.deleteProduct(id);
      await loadAll();
    } catch (err) {
      setError(formatError(err, 'Failed to delete product'));
    }
  }

  async function handleCreateOrUpdateMaterial(e) {
    e.preventDefault();
    setError('');
    const payload = {
      code: materialForm.code.trim(),
      name: materialForm.name.trim(),
      stockQuantity: Number(materialForm.stockQuantity)
    };
    try {
      if (materialForm.id) {
        await api.updateRawMaterial(materialForm.id, payload);
      } else {
        await api.createRawMaterial(payload);
      }
      setMaterialForm({ id: null, code: '', name: '', stockQuantity: '' });
      await loadAll();
    } catch (err) {
      setError(formatError(err, 'Failed to save raw material'));
    }
  }

  async function handleDeleteMaterial(id) {
    setError('');
    try {
      await api.deleteRawMaterial(id);
      await loadAll();
    } catch (err) {
      setError(formatError(err, 'Failed to delete raw material'));
    }
  }

  async function handleAddAssociation(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createProductMaterial(
        Number(associationForm.productId),
        Number(associationForm.rawMaterialId),
        Number(associationForm.quantityRequired)
      );
      setAssociationForm({ ...associationForm, quantityRequired: '' });
      await loadAll();
    } catch (err) {
      setError(formatError(err, 'Failed to add raw material to product'));
    }
  }

  async function handleDeleteAssociation(id) {
    setError('');
    try {
      if (!id) {
        setError('Association ID not found. Refresh the list and try again.');
        return;
      }
      const numericId = Number(id);
      await api.deleteProductMaterial(numericId);
      // Recarrega apenas a lista de associacoes para garantir a UI correta.
      const updatedAssociations = await api.getProductMaterials();
      setProductMaterials(updatedAssociations);
    } catch (err) {
      setError(formatError(err, 'Failed to remove association'));
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Inventory Production Planner</h1>
          <p>Manage products, raw materials, and see the best production plan by value.</p>
        </div>
      </header>

      {error && <div className="alert">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <main className="content">
        <section>
          <h2>Products</h2>
          <form className="form" onSubmit={handleCreateOrUpdateProduct}>
            <input
              placeholder="Code"
              value={productForm.code}
              onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
              required
            />
            <input
              placeholder="Name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />
            <input
              placeholder="Price"
              type="number"
              step="0.01"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              required
            />
            <button type="submit">{productForm.id ? 'Update' : 'Create'}</button>
            {productForm.id && (
              <button
                type="button"
                className="ghost"
                onClick={() => setProductForm({ id: null, code: '', name: '', price: '' })}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="table">
            <div className="table-row header-row">
              <div>Code</div>
              <div>Name</div>
              <div>Price</div>
              <div>Actions</div>
            </div>
            {products.map((product) => (
              <div className="table-row" key={product.id}>
                <div>{product.code}</div>
                <div>{product.name}</div>
                <div>{Number(product.price).toFixed(2)}</div>
                <div className="actions">
                  <button
                    className="ghost"
                    onClick={() =>
                      setProductForm({
                        id: product.id,
                        code: product.code,
                        name: product.name,
                        price: product.price
                      })
                    }
                  >
                    Edit
                  </button>
                  <button className="danger" onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Raw Materials</h2>
          <form className="form" onSubmit={handleCreateOrUpdateMaterial}>
            <input
              placeholder="Code"
              value={materialForm.code}
              onChange={(e) => setMaterialForm({ ...materialForm, code: e.target.value })}
              required
            />
            <input
              placeholder="Name"
              value={materialForm.name}
              onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
              required
            />
            <input
              placeholder="Stock Quantity"
              type="number"
              step="0.001"
              value={materialForm.stockQuantity}
              onChange={(e) => setMaterialForm({ ...materialForm, stockQuantity: e.target.value })}
              required
            />
            <button type="submit">{materialForm.id ? 'Update' : 'Create'}</button>
            {materialForm.id && (
              <button
                type="button"
                className="ghost"
                onClick={() => setMaterialForm({ id: null, code: '', name: '', stockQuantity: '' })}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="table">
            <div className="table-row header-row">
              <div>Code</div>
              <div>Name</div>
              <div>Stock</div>
              <div>Actions</div>
            </div>
            {rawMaterials.map((material) => (
              <div className="table-row" key={material.id}>
                <div>{material.code}</div>
                <div>{material.name}</div>
                <div>{Number(material.stockQuantity).toFixed(3)}</div>
                <div className="actions">
                  <button
                    className="ghost"
                    onClick={() =>
                      setMaterialForm({
                        id: material.id,
                        code: material.code,
                        name: material.name,
                        stockQuantity: material.stockQuantity
                      })
                    }
                  >
                    Edit
                  </button>
                  <button className="danger" onClick={() => handleDeleteMaterial(material.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Product Materials</h2>
          <div className="form">
            <select
              value={associationForm.productId}
              onChange={(e) =>
                setAssociationForm({
                  ...associationForm,
                  productId: e.target.value
                })
              }
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.code} - {product.name}
                </option>
              ))}
            </select>

            <select
              value={associationForm.rawMaterialId}
              onChange={(e) =>
                setAssociationForm({
                  ...associationForm,
                  rawMaterialId: e.target.value
                })
              }
            >
              <option value="">Select raw material</option>
              {rawMaterials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.code} - {material.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Quantity Required"
              type="number"
              step="0.001"
              value={associationForm.quantityRequired}
              onChange={(e) =>
                setAssociationForm({
                  ...associationForm,
                  quantityRequired: e.target.value
                })
              }
            />
            <button
              type="button"
              onClick={handleAddAssociation}
              disabled={!associationForm.productId || !associationForm.rawMaterialId}
            >
              Add
            </button>
          </div>

          <div className="table">
            <div className="table-row header-row">
              <div>ID</div>
              <div>Product</div>
              <div>Raw Material</div>
              <div>Quantity Required</div>
              <div>Actions</div>
            </div>
            {productMaterials.map((material) => (
              <div className="table-row" key={material.id}>
                <div>{material.id ?? '-'}</div>
                <div>
                  {material.product?.code} - {material.product?.name}
                </div>
                <div>
                  {material.rawMaterial?.code} - {material.rawMaterial?.name}
                </div>
                <div>{Number(material.quantityRequired).toFixed(3)}</div>
                <div className="actions">
                  <button className="danger" onClick={() => handleDeleteAssociation(material.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Production Plan</h2>
          <div className="table">
            <div className="table-row header-row">
              <div>Product</div>
              <div>Unit Price</div>
              <div>Units</div>
              <div>Total Value</div>
            </div>
            {plan.items.map((item) => (
              <div className="table-row" key={item.productId}>
                <div>
                  {item.productCode} - {item.productName}
                </div>
                <div>{Number(item.unitPrice).toFixed(2)}</div>
                <div>{item.units}</div>
                <div>{Number(item.totalValue).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="summary">
            <strong>Total value:</strong> {Number(plan.totalValue || 0).toFixed(2)}
          </div>
          <button className="ghost" onClick={loadAll}>
            Refresh Plan
          </button>
        </section>
      </main>
    </div>
  );
}
