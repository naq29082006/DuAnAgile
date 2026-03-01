const express = require('express');
const cors = require('cors');
const data = require('./data');
const store = require('./store');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

store.init(data);
function persist() {
  store.save(data);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Gắn routes theo từng chức năng
app.use('/api/auth', authRoutes(data, persist));
app.use('/api/products', productRoutes(data, persist));
app.use('/api/categories', categoryRoutes(data, persist));
app.use('/api/users', userRoutes(data, persist));

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log('\x1b[32m✔\x1b[0m Server chạy thành công!');
  console.log('   - Local:   http://localhost:' + PORT);
  console.log('   - Network: http://' + (HOST === '0.0.0.0' ? '127.0.0.1' : HOST) + ':' + PORT);
});
