const express = require('express');
const cors = require('cors');
const data = require('./data');
const store = require('./store');

store.init(data);
const { products, categories, users } = data;
function persist() { store.save(data); }

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Giao diện admin: phục vụ file tĩnh từ public (đã gộp admin-web vào đây)
app.use(express.static('public'));

// GET /api/products?search=...&category=...&deleted=1 (deleted=1 = chỉ lấy trong thùng rác)
app.get('/api/products', (req, res) => {
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
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const p = products.find((x) => x.id === id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

// POST /api/products
app.post('/api/products', (req, res) => {
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

// PUT /api/products/:id (cho phép isDeleted để khôi phục từ thùng rác)
app.put('/api/products/:id', (req, res) => {
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

// DELETE /api/products/:id — mặc định xóa mềm (vào thùng rác); ?permanent=1 thì xóa hẳn
app.delete('/api/products/:id', (req, res) => {
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

// GET /api/categories — mặc định danh sách đang dùng; ?deleted=1 = thùng rác. ?withCount=1 = kèm số sản phẩm (chỉ đếm sp chưa xóa)
app.get('/api/categories', (req, res) => {
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
app.get('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const c = categories.find((x) => x.id === id);
  if (!c) return res.status(404).json({ error: 'Category not found' });
  const productCount = products.filter((p) => !p.isDeleted && (p.category || '').toLowerCase() === (c.name || '').toLowerCase()).length;
  res.json({ ...c, productCount });
});

// POST /api/categories
app.post('/api/categories', (req, res) => {
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
app.put('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = categories.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Category not found' });
  const { name, isDeleted } = req.body || {};
  if (name !== undefined) categories[idx].name = String(name).trim() || categories[idx].name;
  if (isDeleted !== undefined) categories[idx].isDeleted = isDeleted ? 1 : 0;
  persist();
  res.json(categories[idx]);
});

// DELETE /api/categories/:id — mặc định xóa mềm (vào thùng rác). ?permanent=1 = xóa hẳn (chỉ khi 0 sản phẩm thuộc danh mục)
app.delete('/api/categories/:id', (req, res) => {
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

// GET /api/users — mặc định đang dùng; ?deleted=1 = thùng rác
app.get('/api/users', (req, res) => {
  const showTrash = req.query.deleted === '1' || req.query.deleted === 'true';
  const list = users.filter((u) => (u.isDeleted ? 1 : 0) === (showTrash ? 1 : 0));
  res.json(list);
});

// GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const u = users.find((x) => x.id === id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json(u);
});

// PUT /api/users/:id (cho phép isDeleted để khôi phục)
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = users.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const { name, email, phone, isDeleted } = req.body || {};
  if (name !== undefined) users[idx].name = name;
  if (email !== undefined) users[idx].email = email;
  if (phone !== undefined) users[idx].phone = phone;
  if (isDeleted !== undefined) {
    users[idx].isDeleted = isDeleted ? 1 : 0;
    if (!isDeleted) users[idx].deletedReason = '';
  }
  persist();
  res.json(users[idx]);
});

// DELETE /api/users/:id — body: { reason } (lý do vi phạm). Mặc định xóa mềm; ?permanent=1 = xóa hẳn
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = users.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const permanent = req.query.permanent === '1' || req.query.permanent === 'true';
  const reason = (req.body && req.body.reason) ? String(req.body.reason).trim() : '';
  if (permanent) {
    users.splice(idx, 1);
  } else {
    users[idx].isDeleted = 1;
    users[idx].deletedReason = reason || 'Vi phạm';
  }
  persist();
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log('\x1b[32m✔\x1b[0m Kết nối thành công - http://localhost:' + PORT);
});
