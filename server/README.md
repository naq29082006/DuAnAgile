# API + Admin Web - App Bán Đồ Ăn Nhanh

Backend API và giao diện admin đã gộp chung trong folder **server**: API ở root, giao diện ở `public/`.

## Cài đặt & chạy

```bash
cd server
npm install
npm start
```

- **Admin (giao diện quản lý):** http://localhost:3000  
- **API:** http://localhost:3000/api/...

Một lệnh `npm start` chạy cả API và trang admin.

## API

| Method | URL | Mô tả |
|--------|-----|--------|
| GET | /api/products | Danh sách sản phẩm |
| GET | /api/products?search=...&category=... | Tìm kiếm / lọc theo danh mục |
| GET | /api/products/:id | Chi tiết một sản phẩm |
| POST | /api/products | Thêm sản phẩm (body: name, description, price, category, imageUrl) |
| PUT | /api/products/:id | Sửa sản phẩm |
| DELETE | /api/products/:id | Xóa sản phẩm |
| GET | /api/categories | Danh sách danh mục |
| GET | /api/categories?withCount=1 | Danh mục kèm số sản phẩm |
| GET | /api/categories/:id | Chi tiết 1 danh mục |
| POST | /api/categories | Thêm danh mục (body: name) |
| PUT | /api/categories/:id | Sửa danh mục (name, isDeleted) |
| DELETE | /api/categories/:id | Xóa (chỉ khi danh mục không còn sản phẩm) |
| GET | /api/users | Danh sách người dùng |
| GET | /api/orders | Danh sách đơn hàng |
| GET | /api/orders?status=pending | Đơn chờ duyệt |
| PATCH | /api/orders/:id | Cập nhật đơn (body: `{ "status": "approved" }`) |

## Dữ liệu

Dữ liệu mẫu nằm trong `data.js`. Có thể thay bằng database (SQLite, MongoDB, ...) sau.
