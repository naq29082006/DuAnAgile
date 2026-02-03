const express = require('express');

/**
 * Routes API người dùng: CRUD, xóa mềm/cứng, lý do vi phạm, thùng rác
 * @param {object} data - { users }
 * @param {function} persist - Hàm lưu dữ liệu ra file
 */
function userRoutes(data, persist) {
  const router = express.Router();
  const { users } = data;

  // GET /api/users — mặc định đang dùng; ?deleted=1 thùng rác
  router.get('/', (req, res) => {
    const showTrash = req.query.deleted === '1' || req.query.deleted === 'true';
    const list = users.filter((u) => (u.isDeleted ? 1 : 0) === (showTrash ? 1 : 0));
    res.json(list);
  });

  // GET /api/users/:id
  router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const u = users.find((x) => x.id === id);
    if (!u) return res.status(404).json({ error: 'User not found' });
    res.json(u);
  });

  // PUT /api/users/:id — cho phép isDeleted để khôi phục
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
    res.json(users[idx]);
  });

  // DELETE /api/users/:id — body: { reason }. Mặc định xóa mềm; ?permanent=1 xóa hẳn
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
