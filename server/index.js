const express = require('express');
const cors = require('cors');
const data = require('./data');
const store = require('./store');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');

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
app.use('/api/products', productRoutes(data, persist));
app.use('/api/categories', categoryRoutes(data, persist));
app.use('/api/users', userRoutes(data, persist));

app.listen(PORT, () => {
  console.log('\x1b[32m✔\x1b[0m Kết nối thành công - http://localhost:' + PORT);
});
