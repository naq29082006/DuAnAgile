// Mock data khi chưa có API
const MOCK = {
  products: { count: 9, list: [] },
  categories: { count: 4, list: [] },
  users: { count: 5, list: [] },
};

function getInitial(name) {
  const n = (name || 'N').trim();
  return n.charAt(0).toUpperCase();
}

function updateStats(stats) {
  document.getElementById('stat-products').textContent = stats.products;
  document.getElementById('stat-categories').textContent = stats.categories;
  document.getElementById('stat-users').textContent = stats.users;
}

async function loadDashboard() {
  let products = [], categories = [], users = [];
  let useMock = false;

  try {
    const [p, c, u] = await Promise.all([
      API.getProducts(),
      API.getCategories(),
      API.getUsers(),
    ]);
    products = Array.isArray(p) ? p : p?.data ?? [];
    categories = Array.isArray(c) ? c : c?.data ?? [];
    users = Array.isArray(u) ? u : u?.data ?? [];
  } catch (e) {
    useMock = true;
    products = MOCK.products.list;
    categories = MOCK.categories.list;
    users = MOCK.users.list;
  }

  const stats = {
    products: useMock ? MOCK.products.count : (Array.isArray(products) ? products.length : 0),
    categories: useMock ? MOCK.categories.count : (Array.isArray(categories) ? categories.length : 0),
    users: useMock ? MOCK.users.count : (Array.isArray(users) ? users.length : 0),
  };
  updateStats(stats);
}

function getProductEmoji(category, name) {
  const c = (category || '').toLowerCase();
  const n = (name || '').toLowerCase();
  if (c.includes('burger') || c.includes('hamburger') || n.includes('burger') || n.includes('hamburger')) return '🍔';
  if (c.includes('pizza') || n.includes('pizza')) return '🍕';
  if (c.includes('combo') || n.includes('combo') || n.includes('gà + cơm')) return '🍗';
  if (c.includes('uống') || c.includes('drink')) return '🥤';
  if (c.includes('cơm') || c.includes('rice')) return '🍚';
  if (c.includes('mì') || c.includes('noodle')) return '🍜';
  return '🍽️';
}

function renderProductsGrid(list, isTrashView) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const cards = (list || []).map(
    (p) => {
      const emoji = getProductEmoji(p.category, p.name);
      const imgHtml = p.imageUrl
        ? `<img src="${String(p.imageUrl).replace(/"/g, '&quot;')}" alt="" class="product-card-img" onerror="this.style.display=\'none\'"/>`
        : '';
      const actions = isTrashView
        ? `<button type="button" class="btn-restore" data-restore="${p.id}">Khôi phục</button>
           <button type="button" class="btn-delete-permanent" data-permanent="${p.id}">Xóa vĩnh viễn</button>`
        : `<button type="button" class="btn-edit" data-edit="${p.id}">Sửa sản phẩm</button>
           <button type="button" class="btn-delete" data-delete="${p.id}">Xóa sản phẩm</button>`;
      return `
    <div class="product-card ${isTrashView ? 'product-card-trash' : ''}" data-product-id="${p.id}">
      <div class="product-card-image">
        <span class="product-card-emoji">${emoji}</span>
        ${imgHtml}
      </div>
      <div class="product-card-body">
        <div class="product-card-name">${(p.name || '—').replace(/</g, '&lt;')}</div>
        <div class="product-card-desc">${(p.description || '').replace(/</g, '&lt;')}</div>
        <div class="product-card-price">${typeof p.price === 'number' ? p.price.toLocaleString('vi-VN') : (p.price || '0')}</div>
        <div class="product-card-actions">${actions}</div>
      </div>
    </div>`;
    }
  );
  grid.innerHTML = cards.join('');

  if (!isTrashView) {
    grid.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => openProductModal(btn.dataset.edit)));
    grid.querySelectorAll('[data-delete]').forEach((btn) => btn.addEventListener('click', () => confirmDeleteProduct(btn.dataset.delete)));
  } else {
    grid.querySelectorAll('[data-restore]').forEach((btn) => btn.addEventListener('click', () => restoreProduct(btn.dataset.restore)));
    grid.querySelectorAll('[data-permanent]').forEach((btn) => btn.addEventListener('click', () => confirmPermanentDeleteProduct(btn.dataset.permanent)));
  }

  const fab = document.getElementById('product-fab');
  if (fab) {
    fab.style.display = isTrashView ? 'none' : '';
    if (!fab.dataset.bound) {
      fab.dataset.bound = '1';
      fab.addEventListener('click', () => openProductModal());
    }
  }
}

function openProductModal(productId) {
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('product-modal-title');
  const form = document.getElementById('product-form');
  document.getElementById('product-id').value = productId || '';
  title.textContent = productId ? 'Sửa sản phẩm' : 'Thêm sản phẩm';
  form.reset();
  document.getElementById('product-id').value = productId || '';
  if (productId) {
    API.getProduct(productId)
      .then((p) => {
        document.getElementById('product-name').value = p.name || '';
        document.getElementById('product-description').value = p.description || '';
        document.getElementById('product-price').value = p.price ?? '';
        document.getElementById('product-category').value = p.category || '';
        document.getElementById('product-imageUrl').value = p.imageUrl || '';
      })
      .catch(() => alert('Không tải được thông tin sản phẩm'));
  }
  modal.classList.add('show');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('show');
}

function confirmDeleteProduct(id) {
  if (!confirm('Chuyển sản phẩm vào thùng rác?')) return;
  API.deleteProduct(id, false)
    .then(() => loadProductsPage())
    .catch(() => alert('Xóa thất bại. Kiểm tra kết nối API.'));
}

function restoreProduct(id) {
  API.restoreProduct(id)
    .then(() => loadProductsPage())
    .catch(() => alert('Khôi phục thất bại.'));
}

function confirmPermanentDeleteProduct(id) {
  if (!confirm('Xóa vĩnh viễn sản phẩm? Không thể hoàn tác.')) return;
  API.deleteProduct(id, true)
    .then(() => loadProductsPage())
    .catch(() => alert('Xóa thất bại.'));
}

function bindProductTabs() {
  const container = document.querySelector('.tab-list[role="tablist"]');
  if (!container || container.dataset.bound) return;
  container.dataset.bound = '1';
  container.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      container.querySelectorAll('.tab-btn').forEach((b) => { if (b !== btn) b.setAttribute('aria-selected', 'false'); });
      loadProductsPage();
    });
  });
}

function fillCategorySelects() {
  API.getCategories()
    .then((list) => {
      const arr = Array.isArray(list) ? list : list?.data ?? [];
      const options = arr.map((c) => `<option value="${(c.name || '').replace(/"/g, '&quot;')}">${(c.name || '—').replace(/</g, '&lt;')}</option>`).join('');
      const filter = document.getElementById('product-category-filter');
      const formSelect = document.getElementById('product-category');
      if (filter) filter.innerHTML = '<option value="">Tất cả</option>' + options;
      if (formSelect) formSelect.innerHTML = '<option value="">-- Chọn danh mục --</option>' + options;
    })
    .catch(() => {});
}

function isProductTrashView() {
  const tab = document.querySelector('[data-product-tab="trash"]');
  return tab && tab.classList.contains('active');
}

async function loadProductsPage() {
  const search = (document.getElementById('product-search') || {}).value || '';
  const category = (document.getElementById('product-category-filter') || {}).value || '';
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  const isTrash = isProductTrashView();
  try {
    const data = await API.getProducts(params.toString(), { deleted: isTrash });
    const list = Array.isArray(data) ? data : data?.data ?? [];
    renderProductsGrid(list, isTrash);
  } catch (e) {
    renderProductsGrid([], isTrash);
  }
}

function getCategoryEmoji(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('burger')) return '🍔';
  if (n.includes('pizza')) return '🍕';
  if (n.includes('cơm') || n.includes('rice')) return '🍚';
  if (n.includes('uống') || n.includes('drink')) return '🥤';
  if (n.includes('combo')) return '🍗';
  if (n.includes('mì')) return '🍜';
  return '🏷️';
}

function renderCategoriesGrid(list) {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  if (!list || list.length === 0) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-tag"></i><p>Chưa có danh mục</p></div>';
    return;
  }
  const cards = list.map(
    (c) => {
      const emoji = getCategoryEmoji(c.name);
      const count = c.productCount ?? 0;
      return `
    <div class="category-card" data-category-id="${c.id}">
      <div class="category-card-icon">${emoji}</div>
      <div class="category-card-name">${(c.name || '—').replace(/</g, '&lt;')}</div>
      <div class="category-card-count">${count} sản phẩm</div>
      <div class="category-card-actions">
        <button type="button" class="btn-edit" data-edit-cat="${c.id}">Sửa</button>
        <button type="button" class="btn-delete" data-delete-cat="${c.id}">Xóa</button>
      </div>
    </div>`;
    }
  );
  grid.innerHTML = cards.join('');

  grid.querySelectorAll('[data-edit-cat]').forEach((btn) => btn.addEventListener('click', () => openCategoryModal(btn.dataset.editCat)));
  grid.querySelectorAll('[data-delete-cat]').forEach((btn) => btn.addEventListener('click', () => confirmSoftDeleteCategory(btn.dataset.deleteCat)));
}

async function loadCategoriesPage() {
  try {
    const data = await API.getCategories(true);
    const list = Array.isArray(data) ? data : data?.data ?? [];
    renderCategoriesGrid(list);
  } catch (e) {
    renderCategoriesGrid([]);
  }
}

function openCategoryModal(categoryId) {
  const modal = document.getElementById('category-modal');
  const title = document.getElementById('category-modal-title');
  document.getElementById('category-id').value = categoryId || '';
  title.textContent = categoryId ? 'Sửa danh mục' : 'Thêm danh mục';
  document.getElementById('category-form').reset();
  document.getElementById('category-id').value = categoryId || '';
  if (categoryId) {
    API.getCategory(categoryId)
      .then((c) => { document.getElementById('category-name').value = c.name || ''; })
      .catch(() => alert('Không tải được danh mục'));
  }
  modal.classList.add('show');
}

function closeCategoryModal() {
  document.getElementById('category-modal').classList.remove('show');
}

function confirmSoftDeleteCategory(id) {
  if (!confirm('Chuyển danh mục vào thùng rác?')) return;
  API.deleteCategory(id, false)
    .then(() => { loadCategoriesPage(); loadDashboard(); })
    .catch((e) => alert(e && e.message ? e.message : 'Xóa thất bại. Danh mục còn sản phẩm không thể xóa.'));
}

function openDeleteCategoryModal() {
  const modal = document.getElementById('category-delete-modal');
  modal.classList.add('show');
  fillCategoryTrashList();
}

function closeDeleteCategoryModal() {
  document.getElementById('category-delete-modal').classList.remove('show');
}

async function fillCategoryTrashList() {
  const listEl = document.getElementById('category-delete-list');
  try {
    const data = await API.getCategories(true, true);
    const list = Array.isArray(data) ? data : data?.data ?? [];
    if (list.length === 0) {
      listEl.innerHTML = '<p class="empty-state"><i class="fas fa-trash"></i> Thùng rác trống</p>';
      return;
    }
    listEl.innerHTML = list
      .map((c) => {
        const count = c.productCount ?? 0;
        const canPermanent = count === 0;
        const emoji = getCategoryEmoji(c.name);
        return `
        <div class="category-delete-item">
          <div class="cat-icon">${emoji}</div>
          <div class="cat-info">
            <div class="cat-name">${(c.name || '—').replace(/</g, '&lt;')}</div>
            <div class="cat-count">${count} sản phẩm</div>
          </div>
          <div class="cat-trash-actions">
            <button type="button" class="btn-restore-cat" data-restore-cat="${c.id}">Khôi phục</button>
            ${canPermanent ? `<button type="button" class="btn-do-delete" data-permanent-cat="${c.id}">Xóa vĩnh viễn</button>` : `<button type="button" class="btn-cannot-delete" disabled title="Còn ${count} sản phẩm">Không thể xóa vĩnh viễn</button>`}
          </div>
        </div>`;
      })
      .join('');
    listEl.querySelectorAll('[data-restore-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        API.restoreCategory(btn.dataset.restoreCat)
          .then(() => { closeDeleteCategoryModal(); loadCategoriesPage(); loadDashboard(); fillCategoryTrashList(); })
          .catch(() => alert('Khôi phục thất bại.'));
      });
    });
    listEl.querySelectorAll('[data-permanent-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!confirm('Xóa vĩnh viễn danh mục? Không thể hoàn tác.')) return;
        API.deleteCategory(btn.dataset.permanentCat, true)
          .then(() => { loadCategoriesPage(); loadDashboard(); fillCategoryTrashList(); })
          .catch(() => alert('Xóa vĩnh viễn thất bại.'));
      });
    });
  } catch (e) {
    listEl.innerHTML = '<p class="empty-state">Không tải được danh sách</p>';
  }
}

const USER_VIOLATION_REASONS = [
  { id: 'spam', label: 'Spam / quảng cáo trái phép' },
  { id: 'rules', label: 'Vi phạm nội quy cộng đồng' },
  { id: 'fraud', label: 'Gian lận / lừa đảo' },
  { id: 'abuse', label: 'Lạm dụng / hành vi xấu' },
  { id: 'fake', label: 'Tài khoản giả mạo' },
  { id: 'other', label: 'Khác' },
];

function isUsersTrashView() {
  const tab = document.querySelector('[data-users-tab="trash"]');
  return tab && tab.classList.contains('active');
}

function renderUsersList(list, isTrashView) {
  const el = document.getElementById('users-list');
  if (!el) return;
  if (!list || list.length === 0) {
    el.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-users"></i><p>' + (isTrashView ? 'Thùng rác trống' : 'Chưa có người dùng') + '</p></div>';
    return;
  }
  const cards = list.map((u) => {
    const name = u.name || u.email || u.displayName || '—';
    const initial = getInitial(name);
    const actions = isTrashView
      ? `<button type="button" class="btn-restore" data-restore-user="${u.id}">Khôi phục</button>
         <button type="button" class="btn-delete-permanent" data-permanent-user="${u.id}">Xóa vĩnh viễn</button>`
      : `<button type="button" class="btn-edit" data-user-detail="${u.id}">Xem chi tiết</button>
         <button type="button" class="btn-delete" data-user-delete="${u.id}">Xóa</button>`;
    return `
    <div class="user-card ${isTrashView ? 'user-card-trash' : ''}" data-user-id="${u.id}">
      <div class="user-card-avatar">${initial}</div>
      <div class="user-card-info">
        <div class="user-card-name">${(name || '').replace(/</g, '&lt;')}</div>
        <div class="user-card-email">${(u.email || '').replace(/</g, '&lt;')}</div>
        <div class="user-card-phone">${(u.phone || '—').replace(/</g, '&lt;')}</div>
      </div>
      <div class="user-card-actions">${actions}</div>
    </div>`;
  });
  el.innerHTML = cards.join('');

  if (!isTrashView) {
    el.querySelectorAll('[data-user-detail]').forEach((btn) => btn.addEventListener('click', () => openUserDetailModal(btn.dataset.userDetail)));
    el.querySelectorAll('[data-user-delete]').forEach((btn) => btn.addEventListener('click', () => openDeleteUserModal(btn.dataset.userDelete)));
  } else {
    el.querySelectorAll('[data-restore-user]').forEach((btn) => btn.addEventListener('click', () => restoreUser(btn.dataset.restoreUser)));
    el.querySelectorAll('[data-permanent-user]').forEach((btn) => btn.addEventListener('click', () => confirmPermanentDeleteUser(btn.dataset.permanentUser)));
  }
}

function openUserDetailModal(userId) {
  const modal = document.getElementById('user-detail-modal');
  const body = document.getElementById('user-detail-body');
  const btnDelete = document.getElementById('btn-delete-from-detail');
  if (!modal || !body) return;
  API.getUser(userId)
    .then((u) => {
      const name = u.name || u.email || u.displayName || '—';
      body.innerHTML = `
        <div class="user-detail-avatar">${getInitial(name)}</div>
        <div class="user-detail-row"><strong>Họ tên</strong><span>${(name || '—').replace(/</g, '&lt;')}</span></div>
        <div class="user-detail-row"><strong>Email</strong><span>${(u.email || '—').replace(/</g, '&lt;')}</span></div>
        <div class="user-detail-row"><strong>Số điện thoại</strong><span>${(u.phone || '—').replace(/</g, '&lt;')}</span></div>
      `;
      btnDelete.dataset.userId = u.id;
      modal.classList.add('show');
    })
    .catch(() => alert('Không tải được thông tin người dùng'));
}

function closeUserDetailModal() {
  document.getElementById('user-detail-modal').classList.remove('show');
}

let deleteUserModalUserId = null;

function openDeleteUserModal(userId) {
  deleteUserModalUserId = userId;
  const modal = document.getElementById('user-delete-modal');
  const container = document.getElementById('user-delete-reasons');
  const otherInput = document.getElementById('user-delete-reason-other');
  if (!container) return;
  container.innerHTML = USER_VIOLATION_REASONS.map(
    (r) => `<label class="reason-option"><input type="radio" name="user-delete-reason" value="${r.id}" /> ${r.label}</label>`
  ).join('');
  if (otherInput) otherInput.value = '';
  modal.classList.add('show');
}

function closeDeleteUserModal() {
  deleteUserModalUserId = null;
  document.getElementById('user-delete-modal').classList.remove('show');
}

function getSelectedDeleteReason() {
  const radio = document.querySelector('input[name="user-delete-reason"]:checked');
  const other = (document.getElementById('user-delete-reason-other') || {}).value || '';
  if (radio && radio.value === 'other' && other.trim()) return other.trim();
  if (radio) return USER_VIOLATION_REASONS.find((r) => r.id === radio.value)?.label || radio.value;
  return 'Vi phạm';
}

function handleUserDeleteSoft() {
  if (!deleteUserModalUserId) return;
  const reason = getSelectedDeleteReason();
  API.deleteUser(deleteUserModalUserId, false, reason)
    .then(() => { closeDeleteUserModal(); loadUsersPage(); loadDashboard(); })
    .catch(() => alert('Xóa thất bại.'));
}

function handleUserDeletePermanent() {
  if (!deleteUserModalUserId) return;
  if (!confirm('Xóa vĩnh viễn tài khoản? Không thể hoàn tác.')) return;
  const reason = getSelectedDeleteReason();
  API.deleteUser(deleteUserModalUserId, true, reason)
    .then(() => { closeDeleteUserModal(); loadUsersPage(); loadDashboard(); })
    .catch(() => alert('Xóa thất bại.'));
}

function restoreUser(id) {
  API.restoreUser(id)
    .then(() => loadUsersPage())
    .catch(() => alert('Khôi phục thất bại.'));
}

function confirmPermanentDeleteUser(id) {
  if (!confirm('Xóa vĩnh viễn tài khoản? Không thể hoàn tác.')) return;
  API.deleteUser(id, true, '')
    .then(() => loadUsersPage())
    .catch(() => alert('Xóa thất bại.'));
}

async function loadUsersPage() {
  const isTrash = isUsersTrashView();
  try {
    const data = await API.getUsers(isTrash);
    const list = Array.isArray(data) ? data : data?.data ?? [];
    renderUsersList(list, isTrash);
  } catch (e) {
    renderUsersList([], isTrash);
  }
}

function bindUserTabs() {
  const container = document.querySelector('.users-toolbar .tab-list');
  if (!container || container.dataset.bound) return;
  container.dataset.bound = '1';
  container.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      loadUsersPage();
    });
  });
}

async function loadPage(pageId) {
  if (pageId === 'dashboard') {
    await loadDashboard();
    return;
  }
  try {
    if (pageId === 'products') {
      fillCategorySelects();
      bindProductTabs();
      await loadProductsPage();
      const searchEl = document.getElementById('product-search');
      const filterEl = document.getElementById('product-category-filter');
      if (searchEl && !searchEl.dataset.bound) {
        searchEl.dataset.bound = '1';
        searchEl.addEventListener('input', () => loadProductsPage());
      }
      if (filterEl && !filterEl.dataset.bound) {
        filterEl.dataset.bound = '1';
        filterEl.addEventListener('change', () => loadProductsPage());
      }
    } else if (pageId === 'categories') {
      await loadCategoriesPage();
      const addBtn = document.getElementById('btn-add-category');
      const fabCat = document.getElementById('category-fab');
      const trashBtn = document.getElementById('btn-open-trash-modal');
      if (addBtn && !addBtn.dataset.bound) {
        addBtn.dataset.bound = '1';
        addBtn.addEventListener('click', () => openCategoryModal());
      }
      if (fabCat && !fabCat.dataset.bound) {
        fabCat.dataset.bound = '1';
        fabCat.addEventListener('click', () => openCategoryModal());
      }
      if (trashBtn && !trashBtn.dataset.bound) {
        trashBtn.dataset.bound = '1';
        trashBtn.addEventListener('click', () => openDeleteCategoryModal());
      }
    } else if (pageId === 'users') {
      bindUserTabs();
      await loadUsersPage();
      bindUserModalEvents();
    }
  } catch (e) {
    if (pageId === 'products') renderProductsGrid([]);
    else if (pageId === 'categories') renderCategoriesGrid([]);
    else if (pageId === 'users') renderUsersList([], false);
  }
}

function bindUserModalEvents() {
  const wrap = document.getElementById('user-detail-modal');
  if (wrap && wrap.dataset.bound) return;
  if (wrap) wrap.dataset.bound = '1';
  const detailModal = document.getElementById('user-detail-modal');
  const deleteModal = document.getElementById('user-delete-modal');
  const closeButtons = document.querySelectorAll('#user-detail-modal .modal-close, #user-detail-modal .modal-close-btn, #user-delete-modal .modal-close, #user-delete-modal .modal-close-btn');
  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (detailModal && detailModal.classList.contains('show')) closeUserDetailModal();
      if (deleteModal && deleteModal.classList.contains('show')) closeDeleteUserModal();
    });
  });
  const btnDeleteFromDetail = document.getElementById('btn-delete-from-detail');
  if (btnDeleteFromDetail) {
    btnDeleteFromDetail.addEventListener('click', () => {
      const id = btnDeleteFromDetail.dataset.userId;
      if (id) { closeUserDetailModal(); openDeleteUserModal(id); }
    });
  }
  const btnSoft = document.getElementById('btn-user-delete-soft');
  const btnPermanent = document.getElementById('btn-user-delete-permanent');
  if (btnSoft) btnSoft.addEventListener('click', handleUserDeleteSoft);
  if (btnPermanent) btnPermanent.addEventListener('click', handleUserDeletePermanent);
  [detailModal, deleteModal].forEach((m) => {
    if (!m) return;
    m.addEventListener('click', (e) => { if (e.target === m) { closeUserDetailModal(); closeDeleteUserModal(); } });
  });
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  document.querySelectorAll('.nav-item').forEach((n) => {
    n.classList.toggle('active', n.dataset.nav === pageId);
  });
  loadPage(pageId);
}

function init() {
  loadPage('dashboard');

  document.querySelectorAll('.nav-item, .quick-btn').forEach((el) => {
    el.addEventListener('click', () => {
      const nav = el.dataset.nav;
      if (nav) showPage(nav);
    });
  });

  // Modal sản phẩm
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  if (modal) {
    modal.querySelector('.modal-close')?.addEventListener('click', closeProductModal);
    modal.querySelector('.btn-cancel')?.addEventListener('click', closeProductModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeProductModal(); });
  }
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('product-id').value;
      const payload = {
        name: document.getElementById('product-name').value.trim(),
        description: document.getElementById('product-description').value.trim(),
        price: parseFloat(document.getElementById('product-price').value) || 0,
        category: document.getElementById('product-category').value || '',
        imageUrl: document.getElementById('product-imageUrl').value.trim() || '',
      };
      if (id) {
        API.updateProduct(id, payload).then(() => { closeProductModal(); loadProductsPage(); }).catch(() => alert('Cập nhật thất bại'));
      } else {
        API.createProduct(payload).then(() => { closeProductModal(); loadProductsPage(); loadDashboard(); }).catch(() => alert('Thêm thất bại'));
      }
    });
  }

  // Modal danh mục
  const catModal = document.getElementById('category-modal');
  const catForm = document.getElementById('category-form');
  if (catModal) {
    catModal.querySelector('.modal-close')?.addEventListener('click', closeCategoryModal);
    catModal.querySelector('.btn-cancel')?.addEventListener('click', closeCategoryModal);
    catModal.addEventListener('click', (e) => { if (e.target === catModal) closeCategoryModal(); });
  }
  if (catForm) {
    catForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('category-id').value;
      const name = document.getElementById('category-name').value.trim();
      if (id) {
        API.updateCategory(id, { name }).then(() => { closeCategoryModal(); loadCategoriesPage(); loadDashboard(); }).catch(() => alert('Cập nhật thất bại'));
      } else {
        API.createCategory({ name }).then(() => { closeCategoryModal(); loadCategoriesPage(); loadDashboard(); }).catch(() => alert('Thêm thất bại'));
      }
    });
  }

  // Modal xóa danh mục
  const delModal = document.getElementById('category-delete-modal');
  if (delModal) {
    delModal.querySelector('.modal-close')?.addEventListener('click', closeDeleteCategoryModal);
    delModal.addEventListener('click', (e) => { if (e.target === delModal) closeDeleteCategoryModal(); });
  }
  document.getElementById('btn-open-delete-modal')?.addEventListener('click', openDeleteCategoryModal);
}

init();
