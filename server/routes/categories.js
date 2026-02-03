const express = require('express');

/**
 * Routes API danh mục: GET/POST/PUT/DELETE /api/categories
 * @param {object} data - { products, categories }
 * @param {function} persist - Hàm lưu dữ liệu ra file
 */
function categoryRoutes(data, persist) {
  const router = express.Router();
  const { products, categories } = data;

  // GET /api/categories — ?deleted=1 thùng rác, ?withCount=1 kèm số sản phẩm
  router.get('/', (req, res) => {
    const withCount = req.query.withCount === '1' || req.query.withCount === 'true';
    const showTrash = req.query.deleted === '1' || req.query.deleted === 'true';
    let list = categories.filter((c) => (c.isDeleted ? 1 : 0) === (showTrash ? 1 : 0)).map((c) => ({ ...c }));
    const activeProducts = products.filter((p) => !p.isDeleted);
    if (withCount) {
      list = list.map((c) => ({
        ...c,
        productCount: activeProducts.filter((p) => (p.category || '').toLowerCase() === (c.name || '').toLowerCase()).length,
      }));
    }
    res.json(list);
  });

  // GET /api/categories/:id
  router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const c = categories.find((x) => x.id === id);
    if (!c) return res.status(404).json({ error: 'Category not found' });
    const productCount = products.filter((p) => !p.isDeleted && (p.category || '').toLowerCase() === (c.name || '').toLowerCase()).length;
    res.json({ ...c, productCount });
  });

  // POST /api/categories
  router.post('/', (req, res) => {
    const { name } = req.body || {};
    const maxId = categories.length ? Math.max(...categories.map((x) => x.id)) : 0;
    const newCat = {
      id: maxId + 1,
      name: (name || '').trim() || 'Danh mục mới',
      isDeleted: 0,
    };
    categories.push(newCat);
    persist();
    res.status(201).json(newCat);
  });

  // PUT /api/categories/:id
  router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = categories.findIndex((x) => x.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });
    const { name, isDeleted } = req.body || {};
    if (name !== undefined) categories[idx].name = String(name).trim() || categories[idx].name;
    if (isDeleted !== undefined) categories[idx].isDeleted = isDeleted ? 1 : 0;
    persist();
    res.json(categories[idx]);
  });

  // DELETE /api/categories/:id — xóa mềm mặc định; ?permanent=1 xóa hẳn (chỉ khi 0 sản phẩm)
  router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = categories.findIndex((x) => x.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });
    const cat = categories[idx];
    const activeProducts = products.filter((p) => !p.isDeleted);
    const productCount = activeProducts.filter((p) => (p.category || '').toLowerCase() === (cat.name || '').toLowerCase()).length;
    const permanent = req.query.permanent === '1' || req.query.permanent === 'true';
    if (permanent) {
      if (productCount > 0) {
        return res.status(400).json({ error: 'Cannot permanently delete category with products', productCount });
      }
      categories.splice(idx, 1);
    } else {
      categories[idx].isDeleted = 1;
    }
    persist();
    res.status(204).send();
  });

  return router;
}

module.exports = categoryRoutes;
