require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const PRODUCTS = [
  { name:'Bó Hồng Đỏ Tình Yêu', category:'rose', price:350000, emoji:'🌹', desc:'12 bông hồng đỏ tươi', stock:50 },
  { name:'Hoa Ly Trắng Thanh Khiết', category:'lily', price:280000, emoji:'🌷', desc:'10 bông ly trắng', stock:40 },
  { name:'Hướng Dương Rực Rỡ', category:'sunflower', price:220000, emoji:'🌻', desc:'8 bông hướng dương', stock:60 },
  { name:'Lan Tím Quý Phái', category:'orchid', price:450000, emoji:'🌺', desc:'Chậu lan tím sang trọng', stock:20 },
  { name:'Bó Hỗn Hợp Mùa Xuân', category:'mixed', price:320000, emoji:'💐', desc:'Nhiều loại hoa tươi', stock:35 },
  { name:'Hồng Phấn Ngọt Ngào', category:'rose', price:300000, emoji:'🌸', desc:'15 bông hồng phấn', stock:45 },
  { name:'Tulip Hà Lan', category:'lily', price:380000, emoji:'🌷', desc:'Tulip nhập khẩu Hà Lan', stock:25 },
  { name:'Bó Cẩm Tú Cầu', category:'mixed', price:260000, emoji:'💮', desc:'Cẩm tú cầu xanh tím', stock:30 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Kết nối MongoDB Atlas');
  await Product.deleteMany({});
  await User.deleteMany({});
  const adminPass = await bcrypt.hash('admin123', 10);
  await User.create({ name:'Admin', email:'admin@gmail.com', password: 'admin123', role:'admin' });
  console.log('✅ Tạo admin: admin@gmail.com / admin123');
  const userPass = await bcrypt.hash('user123', 10);
  await User.create({ name:'Nhu Y', email:'nhuy@gmail.com', password: 'nhuy123', role:'customer' });
  console.log('✅ Tạo user: nhuy@gmail.com / user123');
  await Product.insertMany(PRODUCTS);
  console.log(`✅ Đã tạo ${PRODUCTS.length} sản phẩm`);
  console.log('\n🎉 Seed thành công!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });