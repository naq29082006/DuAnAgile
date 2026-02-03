// Dữ liệu mẫu - có thể thay bằng database sau (isDeleted: 0 = đang dùng, 1 = đã xóa mềm vào thùng rác)
let products = [
  { id: 1, name: 'Burger Gà Giòn', description: 'Burger gà chiên giòn với sốt đặc biệt', price: 45000, category: 'Burger', imageUrl: '', isDeleted: 0 },
  { id: 2, name: 'Hamburger Bò', description: 'Hamburger thịt bò chất lượng cao cấp', price: 55000, category: 'Burger', imageUrl: '', isDeleted: 0 },
  { id: 3, name: 'Combo Gà + Cơm', description: 'Gà rán kèm cơm và nước ngọt', price: 65000, category: 'Combo', imageUrl: '', isDeleted: 0 },
  { id: 4, name: 'Pizza Phô Mai', description: 'Pizza 30cm với phô mai mozzarella', price: 75000, category: 'Pizza', imageUrl: '', isDeleted: 0 },
  { id: 5, name: 'Sinh Tố Mango', description: 'Sinh tố xoài tươi', price: 25000, category: 'Đồ uống', imageUrl: '', isDeleted: 0 },
  { id: 6, name: 'Coca Cola', description: 'Nước ngọt', price: 15000, category: 'Đồ uống', imageUrl: '', isDeleted: 0 },
  { id: 7, name: 'Cơm Chiên', description: 'Cơm chiên dương châu', price: 35000, category: 'Cơm', imageUrl: '', isDeleted: 0 },
  { id: 8, name: 'Mì Xào', description: 'Mì xào bò', price: 40000, category: 'Mì', imageUrl: '', isDeleted: 0 },
  { id: 9, name: 'Khoai Tây Chiên', description: 'Khoai tây chiên giòn', price: 20000, category: 'Món phụ', imageUrl: '', isDeleted: 0 },
];

let categories = [
  { id: 1, name: 'Burger', isDeleted: 0 },
  { id: 2, name: 'Pizza', isDeleted: 0 },
  { id: 3, name: 'Combo', isDeleted: 0 },
  { id: 4, name: 'Đồ uống', isDeleted: 0 },
  { id: 5, name: 'Cơm', isDeleted: 0 },
];

let users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567', isDeleted: 0, deletedReason: '' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0912345678', isDeleted: 0, deletedReason: '' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0923456789', isDeleted: 0, deletedReason: '' },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@gmail.com', phone: '0934567890', isDeleted: 0, deletedReason: '' },
  { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@gmail.com', phone: '0945678901', isDeleted: 0, deletedReason: '' },
];

let orders = [
  {
    id: 1001,
    date: '2026-01-28',
    status: 'pending',
    customerName: 'Nguyễn Văn A',
    phone: '0901234567',
    items: [
      { name: 'Burger Gà Giòn', qty: 2 },
      { name: 'Sinh Tố Mango', qty: 1 },
    ],
  },
  {
    id: 1002,
    date: '2026-01-27',
    status: 'approved',
    customerName: 'Trần Thị B',
    phone: '0912345678',
    items: [{ name: 'Pizza Hải Sản', qty: 1 }],
  },
  {
    id: 1003,
    date: '2026-01-27',
    status: 'approved',
    customerName: 'Lê Văn C',
    phone: '0923456789',
    items: [
      { name: 'Cơm Chiên', qty: 2 },
      { name: 'Coca Cola', qty: 2 },
    ],
  },
  {
    id: 1004,
    date: '2026-01-26',
    status: 'rejected',
    customerName: 'Phạm Thị D',
    phone: '0934567890',
    items: [{ name: 'Mì Xào', qty: 1 }],
  },
  {
    id: 1005,
    date: '2026-01-26',
    status: 'approved',
    customerName: 'Hoàng Văn E',
    phone: '0945678901',
    items: [{ name: 'Burger Bò Phô Mai', qty: 1 }, { name: 'Khoai Tây Chiên', qty: 1 }],
  },
];

module.exports = { products, categories, users };
