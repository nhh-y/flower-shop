/* =============================================
Bloom & Co. – app.js
Kết nối với backend API (Node.js + MongoDB)
============================================= */

const API = 'https://flower-shop-offs.onrender.com/api'; 

/* ––––– SAMPLE DATA (dùng khi chưa có backend) ––––– */
const SAMPLE_PRODUCTS = [
{ _id:'1', name:'Bó Hồng Đỏ Tình Yêu', category:'rose', price:350000, emoji:'🌹', desc:'12 bông hồng đỏ tươi, gói giấy kraft sang trọng' },
{ _id:'2', name:'Hoa Ly Trắng Thanh Khiết', category:'lily', price:280000, emoji:'🌷', desc:'10 bông ly trắng, hương thơm nhẹ nhàng' },
{ _id:'3', name:'Hướng Dương Rực Rỡ', category:'sunflower', price:220000, emoji:'🌻', desc:'8 bông hướng dương tươi tắn, tràn đầy năng lượng' },
{ _id:'4', name:'Lan Tím Quý Phái', category:'orchid', price:450000, emoji:'🌺', desc:'Chậu lan tím thịnh soạn, sang trọng' },
{ _id:'5', name:'Bó Hỗn Hợp Mùa Xuân', category:'mixed', price:320000, emoji:'💐', desc:'Kết hợp nhiều loại hoa tươi theo mùa' },
{ _id:'6', name:'Hồng Phấn Ngọt Ngào', category:'rose', price:300000, emoji:'🌸', desc:'15 bông hồng phấn, tượng trưng cho sự ngọt ngào' },
{ _id:'7', name:'Tulip Hà Lan', category:'lily', price:380000, emoji:'🌷', desc:'Tulip nhập khẩu Hà Lan, màu sắc rực rỡ' },
{ _id:'8', name:'Bó Cẩm Tú Cầu', category:'mixed', price:260000, emoji:'💮', desc:'Cẩm tú cầu xanh tím, thơ mộng lãng mạn' },
];

/* ––––– STATE ––––– */
let allProducts = [...SAMPLE_PRODUCTS];
let filteredProducts = [...SAMPLE_PRODUCTS];
let cart = JSON.parse(localStorage.getItem('bloom_cart') || '[]');
let currentUser = JSON.parse(localStorage.getItem('bloom_user') || 'null');
let currentCategory = 'all';

/* ––––– INIT ––––– */
document.addEventListener('DOMContentLoaded', () => {
renderProducts(allProducts);
updateCartUI();
updateNavUser();
fetchProductsFromAPI(); // Thử fetch từ backend nếu có

// Navbar scroll effect
window.addEventListener('scroll', () => {
document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});
});

/* ––––– FETCH FROM API ––––– */
async function fetchProductsFromAPI() {
try {
const res = await fetch(`${API}/products`);
if (!res.ok) throw new Error();
const data = await res.json();
if (data && data.length > 0) {
allProducts = data;
filteredProducts = data;
renderProducts(data);
}
} catch {
// Dùng sample data nếu backend chưa chạy
}
}

/* ––––– RENDER PRODUCTS ––––– */
function renderProducts(products) {
const grid = document.getElementById('productsGrid');
if (!products.length) {
grid.innerHTML = '<div class="no-products">😔 Không tìm thấy sản phẩm nào</div>';
return;
}
grid.innerHTML = products.map((p, i) => `<div class="product-card" style="animation-delay:${i * 60}ms"> <div class="product-img" onclick="showProductDetail('${p._id}')">${p.emoji || '🌸'}</div> <div class="product-body"> <div class="product-cat">${getCatLabel(p.category)}</div> <div class="product-name">${p.name}</div> <div class="product-desc">${p.desc}</div> <div class="product-footer"> <div class="product-price">${formatPrice(p.price)}</div> <button class="btn-add" onclick="addToCart('${p._id}')">+ Thêm</button> </div> </div> </div>`).join('');
}

function getCatLabel(cat) {
const map = { rose:'🌹 Hoa hồng', lily:'🌷 Hoa ly', sunflower:'🌻 Hướng dương', orchid:'🌺 Lan', mixed:'💐 Hỗn hợp' };
return map[cat] || cat;
}

function formatPrice(n) {
return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

/* ––––– FILTER & SEARCH ––––– */
function filterCategory(cat, btn) {
currentCategory = cat;
document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
btn.classList.add('active');
applyFilters();
}

function searchProducts() {
applyFilters();
}

function applyFilters() {
const q = document.getElementById('searchInput').value.toLowerCase();
filteredProducts = allProducts.filter(p => {
const matchCat = currentCategory === 'all' || p.category === currentCategory;
const matchQ = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
return matchCat && matchQ;
});
renderProducts(filteredProducts);
}

/* ––––– CART ––––– */
function addToCart(id) {
const product = allProducts.find(p => p._id === id);
if (!product) return;
const existing = cart.find(c => c._id === id);
if (existing) existing.qty++;
else cart.push({ ...product, qty: 1 });
saveCart();
updateCartUI();
showToast(`🌸 Đã thêm "${product.name}" vào giỏ!`);
}

function removeFromCart(id) {
cart = cart.filter(c => c._id !== id);
saveCart(); updateCartUI();
}

function changeQty(id, delta) {
const item = cart.find(c => c._id === id);
if (!item) return;
item.qty += delta;
if (item.qty <= 0) removeFromCart(id);
else { saveCart(); updateCartUI(); }
}

function saveCart() {
localStorage.setItem('bloom_cart', JSON.stringify(cart));
}

function updateCartUI() {
const count = cart.reduce((s, c) => s + c.qty, 0);
document.getElementById('cartCount').textContent = count;

const itemsEl = document.getElementById('cartItems');
const footerEl = document.getElementById('cartFooter');

if (!cart.length) {
itemsEl.innerHTML = '<p class="cart-empty">Giỏ hàng trống 🌸</p>';
footerEl.style.display = 'none';
return;
}
footerEl.style.display = 'block';
itemsEl.innerHTML = cart.map(c => `<div class="cart-item"> <div class="cart-item-img">${c.emoji || '🌸'}</div> <div class="cart-item-info"> <div class="cart-item-name">${c.name}</div> <div class="cart-item-price">${formatPrice(c.price)}</div> </div> <div class="cart-item-qty"> <button class="qty-btn" onclick="changeQty('${c._id}', -1)">−</button> <span>${c.qty}</span> <button class="qty-btn" onclick="changeQty('${c._id}', 1)">+</button> </div> <button class="cart-item-remove" onclick="removeFromCart('${c._id}')">🗑</button> </div>`).join('');
const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
document.getElementById('cartTotal').textContent = formatPrice(total);
}

function toggleCart() {
document.getElementById('cartDrawer').classList.toggle('open');
document.getElementById('cartOverlay').classList.toggle('open');
}

/* ––––– CHECKOUT ––––– */
async function checkout() {
if (!currentUser) {
toggleCart();
showModal('login');
showToast('⚠️ Vui lòng đăng nhập để đặt hàng');
return;
}
if (!cart.length) return;

const order = {
userId: currentUser._id || currentUser.email,
items: cart.map(c => ({ productId: c._id, name: c.name, price: c.price, qty: c.qty })),
total: cart.reduce((s, c) => s + c.price * c.qty, 0),
status: 'pending',
createdAt: new Date()
};

try {
const res = await fetch(`${API}/orders`, {
method: 'POST',
headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentUser.token}` },
body: JSON.stringify(order)
});
if (res.ok) {
cart = []; saveCart(); updateCartUI(); toggleCart();
showToast('🎉 Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.');
}
} catch {
// Demo: xử lý offline
cart = []; saveCart(); updateCartUI(); toggleCart();
showToast('🎉 Đặt hàng thành công! (Demo mode)');
}
}

/* ––––– AUTH ––––– */
async function login() {
const email = document.getElementById('loginEmail').value;
const password = document.getElementById('loginPassword').value;
if (!email || !password) { showToast('⚠️ Nhập đầy đủ thông tin!'); return; }

try {
const res = await fetch(`${API}/auth/login`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password })
});
const data = await res.json();
if (res.ok) {
currentUser = data;
localStorage.setItem('bloom_user', JSON.stringify(data));
updateNavUser(); closeModal();
showToast(`🌸 Chào mừng ${data.name || email}!`);
} else {
showToast('❌ ' + (data.message || 'Sai email hoặc mật khẩu'));
}
} catch {
// Demo login
currentUser = { email, name: email.split('@')[0], token: 'demo' };
localStorage.setItem('bloom_user', JSON.stringify(currentUser));
updateNavUser(); closeModal();
showToast('Đăng nhập thành công!');
}
}

async function register() {
const name = document.getElementById('regName').value;
const email = document.getElementById('regEmail').value;
const password = document.getElementById('regPassword').value;
if (!name || !email || !password) { showToast('⚠️ Nhập đầy đủ thông tin!'); return; }

try {
const res = await fetch(`${API}/auth/register`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name, email, password })
});
const data = await res.json();
if (res.ok) {
showToast('✅ Đăng ký thành công! Hãy đăng nhập.');
showModal('login');
} else {
showToast('❌ ' + (data.message || 'Đăng ký thất bại'));
}
} catch {
showToast('✅ Đăng ký thành công! (Demo)');
showModal('login');
}
}

function logout() {
currentUser = null;
localStorage.removeItem('bloom_user');
updateNavUser();
showToast('👋 Đã đăng xuất');
}

function updateNavUser() {
const loginBtn = document.querySelector('.btn-login');
if (!loginBtn) return;
if (currentUser) {
loginBtn.textContent = `👤 ${currentUser.name || 'Tài khoản'}`;
loginBtn.onclick = logout;
} else {
loginBtn.textContent = 'Đăng nhập';
loginBtn.onclick = () => showModal('login');
}
}

/* ––––– MODAL ––––– */
function showModal(type) {
document.getElementById('modalOverlay').classList.add('open');
document.getElementById('modal').classList.add('open');
document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none';
document.getElementById('registerForm').style.display = type === 'register' ? 'block' : 'none';
}
function closeModal() {
document.getElementById('modalOverlay').classList.remove('open');
document.getElementById('modal').classList.remove('open');
}

/* ––––– MOBILE MENU ––––– */
function toggleMobileMenu() {
document.getElementById('mobileMenu').classList.toggle('open');
}

/* ––––– TOAST ––––– */
function showToast(msg) {
const t = document.getElementById('toast');
t.textContent = msg; t.classList.add('show');
setTimeout(() => t.classList.remove('show'), 3000);
}

/* ---------- CONTACT FORM ---------- */
async function submitContact(e) {
  e.preventDefault();
  const body = {
    name: document.getElementById('cName').value,
    phone: document.getElementById('cPhone').value,
    address: document.getElementById('cAddress').value,
    note: document.getElementById('cNote').value,
  };
  try {
    await fetch(`${API}/contact`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  } catch {}
  showToast('✅ Yêu cầu đã gửi! Chúng tôi sẽ liên hệ sớm.');
  e.target.reset();
}
