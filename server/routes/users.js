const express = require('express');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return salt + ':' + hash;
}

function userRoutes(data, persist) {
  const router = express.Router();
  const { users } = data;

  // POST /api/users — thêm user (admin)
  router.post('/', (req, res) => {
    const { email, name, phone, password } = req.body || {};
    const existing = users.find((u) => (u.email || '').toLowerCase() === (email || '').toLowerCase());
    if (existing) return res.status(400).json({ error: 'Email đã tồn tại' });
    const maxId = users.length ? Math.max(...users.map((x) => x.id)) : 0;
    const newUser = {
      id: maxId + 1,
      name: name || (email ? email.split('@')[0] : 'User'),
      email: (email || '').trim(),
      password: (password && password.length >= 6) ? hashPassword(password) : '',
      phone: phone || '',
      isDeleted: 0,
      deletedReason: '',
    };
    users.push(newUser);
    persist();
    const { password: _, ...out } = newUser;
    res.status(201).json(out);
  });

  // GET /api/users
  router.get('/', (req, res) => {
    const showTrash = req.query.deleted === '1' || req.query.deleted === 'true';
    const list = users.filter((u) => (u.isDeleted ? 1 : 0) === (showTrash ? 1 : 0));
    const safe = list.map(({ password, ...u }) => u);
    res.json(safe);
  });

  // GET /api/users/:id
  router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const u = users.find((x) => x.id === id);
    if (!u) return res.status(404).json({ error: 'User not found' });
    const { password, ...out } = u;
    res.json(out);
  });

  // PUT /api/users/:id
  router.put('/:id', (req, res) => {
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
    const { password, ...out } = users[idx];
    res.json(out);
  });

  // DELETE /api/users/:id
  router.delete('/:id', (req, res) => {
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

  return router;
}

module.exports = userRoutes;
