# Admin Panel - App Bán Đồ Ăn Nhanh

Giao diện admin web cho FastFood App, kết nối API backend.

## Chạy nhanh

1. Mở thư mục `admin-web` bằng trình duyệt (double-click `index.html`) hoặc dùng Live Server / http-server.
2. Nếu **chưa có API**, giao diện vẫn chạy với số liệu mẫu (Dashboard: 9 sản phẩm, 4 danh mục, 5 users, 5 đơn hàng, 1 đơn chờ duyệt).

## Kết nối API

1. Mở file **`js/config.js`**.
2. Đổi `BASE_URL` thành địa chỉ backend của bạn, ví dụ:
   - `http://localhost:3000`
   - `https://your-api.com`

## API backend cần có

Backend cần cung cấp các endpoint (REST, trả về JSON):

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/products` | Danh sách sản phẩm |
| GET | `/api/categories` | Danh sách danh mục |
| GET | `/api/users` | Danh sách người dùng |
| GET | `/api/orders` | Danh sách đơn hàng (query `?status=pending` cho đơn chờ duyệt) |
| PATCH | `/api/orders/:id` | Cập nhật đơn (body: `{ "status": "approved" }` hoặc `"rejected"`) |

**Format trả về:** Mảng trực tiếp `[...]` hoặc object `{ "data": [...] }`.

**CORS:** Nếu admin chạy ở domain/port khác backend, backend cần bật CORS cho domain admin.

## Cấu trúc thư mục

```
admin-web/
  index.html
  css/style.css
  js/
    config.js   # Cấu hình BASE_URL
    api.js      # Gọi API
    app.js      # Giao diện & logic
  README.md
```
