const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'store.json');

/**
 * Khởi tạo: đọc dữ liệu từ store.json (nếu có) và ghi đè lên data.products, data.categories, data.users.
 * Nếu chưa có file thì giữ nguyên dữ liệu mặc định từ data.js.
 */
function init(data) {
  try {
    if (fs.existsSync(FILE)) {
      const raw = fs.readFileSync(FILE, 'utf8');
      const loaded = JSON.parse(raw);
      if (Array.isArray(loaded.products)) {
        data.products.length = 0;
        data.products.push(...loaded.products);
      }
      if (Array.isArray(loaded.categories)) {
        data.categories.length = 0;
        data.categories.push(...loaded.categories);
      }
      if (Array.isArray(loaded.users)) {
        data.users.length = 0;
        data.users.push(...loaded.users);
      }
      // Đã tải dữ liệu từ store.json (không in ra console)
    }
  } catch (e) {
    // Không đọc được store.json, dùng dữ liệu mặc định (không in ra console)
  }
}

/**
 * Ghi toàn bộ products, categories, users ra file store.json để lưu lại sau khi tắt server.
 */
function save(data) {
  try {
    const payload = {
      products: data.products,
      categories: data.categories,
      users: data.users,
    };
    fs.writeFileSync(FILE, JSON.stringify(payload, null, 2), 'utf8');
  } catch (e) {
    console.error('Lỗi lưu store.json:', e.message);
  }
}

module.exports = { init, save };
