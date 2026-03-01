# Backend API & Admin Panel

## Chạy server

```bash
cd server
npm install
npm start
```

Server chạy tại **http://localhost:3000**

- **Admin Panel:** http://localhost:3000 (mở trực tiếp trong trình duyệt)
- **API:** http://localhost:3000/api/products, /api/categories, /api/users

## Lưu ý

- Nếu cổng 3000 bị chiếm, đặt biến môi trường: `PORT=3001 npm start`
- Để truy cập từ thiết bị khác trong mạng: server tự bind `0.0.0.0`, dùng IP máy (vd: http://192.168.1.100:3000)
- App Android (emulator) kết nối qua `10.0.2.2:3000`; thiết bị thật cần đổi `ApiConfig.BASE_URL` thành IP máy chạy server
