const express = require('express');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return salt + ':' + hash;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verify;
}

function authRoutes(data, persist) {
  const router = express.Router();
  const { users } = data;

  // POST /api/auth/register
  router.post('/register', (req, res) => {
    const { email, password } = req.body || {};
    const emailTrim = (email || '').trim().toLowerCase();
    if (!emailTrim || !password) {
      return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu tối thiểu 6 ký tự' });
    }
    const existing = users.find((u) => (u.email || '').toLowerCase() === emailTrim);
    if (existing) return res.status(400).json({ error: 'Email đã tồn tại' });

    const maxId = users.length ? Math.max(...users.map((x) => x.id)) : 0;
    const newUser = {
      id: maxId + 1,
      name: emailTrim.split('@')[0] || 'User',
      email: emailTrim,
      password: hashPassword(password),
      phone: '',
      isDeleted: 0,
      deletedReason: '',
    };
    users.push(newUser);
    persist();
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  });

  // POST /api/auth/login
  router.post('/login', (req, res) => {
    const { email, password } = req.body || {};
    const emailTrim = (email || '').trim().toLowerCase();
    if (!emailTrim || !password) {
      return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu' });
    }
    const u = users.find((x) => (x.email || '').toLowerCase() === emailTrim && !x.isDeleted);
    if (!u) return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    let valid = false;
    if (u.password) {
      valid = verifyPassword(password, u.password);
    } else {
      valid = password === '123456'; // Mật khẩu mặc định cho user cũ (chưa có password)
    }
    if (!valid) return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    const { password: _, ...userWithoutPassword } = u;
    res.json(userWithoutPassword);
  });

  // POST /api/auth/forgot-password — tạo mật khẩu mới và trả về (phù hợp email ảo, không cần gửi mail)
  router.post('/forgot-password', (req, res) => {
    const { email } = req.body || {};
    const emailTrim = (email || '').trim().toLowerCase();
    const u = users.find((x) => (x.email || '').toLowerCase() === emailTrim && !x.isDeleted);
    if (!u) return res.status(404).json({ error: 'Email không tồn tại' });
    const newPassword = crypto.randomBytes(4).toString('hex');
    u.password = hashPassword(newPassword);
    persist();
    res.json({ message: 'Mật khẩu mới đã được tạo. Vui lòng đổi sau khi đăng nhập.', password: newPassword });
  });

  return router;
}

module.exports = authRoutes;
