const express = require('express');

/**
 * Routes API sản phẩm: GET/POST/PUT/DELETE /api/products
 * @param {object} data - { products }
 * @param {function} persist - Hàm lưu dữ liệu ra file
 */
function productRoutes(data, persist) {
  const router = express.Router();
  const { products } = data;

  // GET /api/products?search=...&category=...&deleted=1
  router.get('/', (req, res) => {
    const showTrash = req.query.deleted === '1' || req.query.deleted === 'true';
    let list = products.filter((p) => (p.isDeleted ? 1 : 0) === (showTrash ? 1 : 0));
    const search = (req.query.search || '').trim().toLowerCase();
    const category = (req.query.category || '').trim();
    if (search) {
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(search) ||
          (p.description || '').toLowerCase().includes(search)
      );
    }
    if (category) {
      list = list.filter((p) => (p.category || '').toLowerCase() === category.toLowerCase());
    }
    res.json(list);
  });

  // GET /api/products/:id
  router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const p = products.find((x) => x.id === id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  });

  // POST /api/products
  router.post('/', (req, res) => {
    const { name, description, price, category, imageUrl } = req.body || {};
    const maxId = products.length ? Math.max(...products.map((x) => x.id)) : 0;
    const newProduct = {
      id: maxId + 1,
      name: name || 'Sản phẩm mới',
      description: description || '',
      price: typeof price === 'number' ? price : parseFloat(price) || 0,
      category: category || '',
      imageUrl: imageUrl || '',
      isDeleted: 0,
    };
    products.push(newProduct);
    persist();
    res.status(201).json(newProduct);
  });

  // PUT /api/products/:id
  router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = products.findIndex((x) => x.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    const { name, description, price, category, imageUrl, isDeleted } = req.body || {};
    if (name !== undefined) products[idx].name = name;
    if (description !== undefined) products[idx].description = description;
    if (price !== undefined) products[idx].price = typeof price === 'number' ? price : parseFloat(price) || 0;
    if (category !== undefined) products[idx].category = category;
    if (imageUrl !== undefined) products[idx].imageUrl = imageUrl;
    if (isDeleted !== undefined) products[idx].isDeleted = isDeleted ? 1 : 0;
    persist();
    res.json(products[idx]);
  });

  // DELETE /api/products/:id — xóa mềm mặc định; ?permanent=1 xóa hẳn
  router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = products.findIndex((x) => x.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    const permanent = req.query.permanent === '1' || req.query.permanent === 'true';
    if (permanent) {
      products.splice(idx, 1);
    } else {
      products[idx].isDeleted = 1;
    }
    persist();
    res.status(204).send();
  });

  return router;
}

module.exports = productRoutes;
