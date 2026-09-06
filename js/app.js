// ========== Data ==========
const PRODUCTS = [
    { id: 1, name: "هاتف ذكي سامسونج", price: 4500, emoji: "📱" },
    { id: 2, name: "لابتوب ديل", price: 8900, emoji: "💻" },
    { id: 3, name: "سماعات لاسلكية", price: 650, emoji: "🎧" },
    { id: 4, name: "ساعة ذكية", price: 1200, emoji: "⌚" },
    { id: 5, name: "كاميرا كانون", price: 3200, emoji: "📷" },
    { id: 6, name: "لوحة مفاتيح ميكانيكية", price: 480, emoji: "⌨️" },
    { id: 7, name: "ماوس جيمنج", price: 350, emoji: "🖱️" },
    { id: 8, name: "شاشة 27 بوصة", price: 2800, emoji: "🖥️" }
];

// ========== Helpers ==========
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const cart = getCart();
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'inline' : 'none';
    }
}

function updateNavbarUser() {
    const userEl = document.getElementById('user-name');
    const loginLink = document.getElementById('login-link');
    const logoutBtn = document.getElementById('logout-btn');
    
    const user = getCurrentUser();
    if (user) {
        if (userEl) {
            userEl.textContent = `مرحباً، ${user.name}`;
            userEl.style.display = 'inline';
        }
        if (loginLink) loginLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline';
    } else {
        if (userEl) userEl.style.display = 'none';
        if (loginLink) loginLink.style.display = 'inline';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function logout() {
    setCurrentUser(null);
    saveCart([]);
    window.location.href = 'login.html';
}

// ========== Auth ==========
function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    
    const errorEl = document.getElementById('error-msg');
    const successEl = document.getElementById('success-msg');
    
    errorEl.style.display = 'none';
    successEl.style.display = 'none';
    
    if (!name || !email || !password || !confirm) {
        errorEl.textContent = 'جميع الحقول مطلوبة';
        errorEl.style.display = 'block';
        return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        errorEl.textContent = 'أدخل بريد إلكتروني صحيح';
        errorEl.style.display = 'block';
        return;
    }
    
    if (password.length < 8) {
        errorEl.textContent = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        errorEl.style.display = 'block';
        return;
    }
    
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        errorEl.textContent = 'كلمة المرور يجب أن تحتوي على حرف كبير ورقم';
        errorEl.style.display = 'block';
        return;
    }
    
    if (password !== confirm) {
        errorEl.textContent = 'كلمتا المرور غير متطابقتين';
        errorEl.style.display = 'block';
        return;
    }
    
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        errorEl.textContent = 'هذا البريد مسجل مسبقاً';
        errorEl.style.display = 'block';
        return;
    }
    
    users.push({ name, email, password });
    saveUsers(users);
    
    successEl.textContent = 'تم إنشاء الحساب بنجاح! جاري التحويل...';
    successEl.style.display = 'block';
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    
    const errorEl = document.getElementById('error-msg');
    errorEl.style.display = 'none';
    
    if (!email || !password) {
        errorEl.textContent = 'يرجى إدخال البريد وكلمة المرور';
        errorEl.style.display = 'block';
        return;
    }
    
    const users = getUsers();
    
    // رسائل أوضح للمساعدة أثناء الاختبار اليدوي
    if (users.length === 0) {
        errorEl.textContent = 'لا يوجد أي حسابات مسجلة بعد. قم بإنشاء حساب أولاً.';
        errorEl.style.display = 'block';
        return;
    }
    
    const userByEmail = users.find(u => u.email === email);
    
    if (!userByEmail) {
        errorEl.textContent = `هذا البريد غير مسجل. عدد الحسابات الموجودة حالياً: ${users.length}`;
        errorEl.style.display = 'block';
        return;
    }
    
    if (userByEmail.password !== password) {
        errorEl.textContent = 'كلمة المرور غير صحيحة. تأكد من الحروف الكبيرة والصغيرة والرموز (مثل @)';
        errorEl.style.display = 'block';
        return;
    }
    
    setCurrentUser({ name: userByEmail.name, email: userByEmail.email });
    window.location.href = 'products.html';
}

// ========== Products ==========
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = PRODUCTS.map(p => `
        <div class="product-card">
            <div class="product-img">${p.emoji}</div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price.toLocaleString()} ج.م</div>
                <button class="btn" onclick="addToCart(${p.id})">أضف إلى السلة</button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const user = getCurrentUser();
    if (!user) {
        alert('يجب تسجيل الدخول أولاً لإضافة منتجات إلى السلة');
        window.location.href = 'login.html';
        return;
    }
    
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    let cart = getCart();
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    saveCart(cart);
    updateCartBadge();
    
    const btn = event.target;
    const original = btn.textContent;
    btn.textContent = 'تمت الإضافة ✓';
    btn.style.background = '#27ae60';
    setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
    }, 1200);
}

// ========== Cart ==========
function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">السلة فارغة 🛒<br><br><a href="products.html" style="color:#667eea">تصفح المنتجات</a></div>';
        if (totalEl) totalEl.style.display = 'none';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span class="cart-item-emoji">${item.emoji}</span>
                <div>
                    <strong>${item.name}</strong><br>
                    <span style="color:#667eea">${item.price.toLocaleString()} ج.م × ${item.qty}</span>
                </div>
            </div>
            <div>
                <strong>${(item.price * item.qty).toLocaleString()} ج.م</strong>
                <button class="btn btn-remove" onclick="removeFromCart(${item.id})" style="margin-right:10px">حذف</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (totalEl) {
        totalEl.style.display = 'block';
        totalEl.innerHTML = `الإجمالي: <span style="color:#667eea">${total.toLocaleString()} ج.م</span>`;
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
    updateCartBadge();
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('السلة فارغة');
        return;
    }
    alert('شكراً لطلبك! (هذه محاكاة فقط - لا يوجد دفع حقيقي)');
    saveCart([]);
    renderCart();
    updateCartBadge();
}

// ========== Excel Database (Export / Import) ==========

/**
 * تصدير كل البيانات إلى ملف Excel
 * الملف يحتوي على 3 أوراق: المستخدمين - السلة - المنتجات
 */
function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('مكتبة Excel لم تُحمّل بعد. تأكد من اتصالك بالإنترنت أو أعد تحميل الصفحة.');
        return;
    }

    const users = getUsers();
    const cart = getCart();
    const currentUser = getCurrentUser();

    // ورقة المستخدمين
    const usersData = users.length > 0 
        ? users.map(u => ({
            'الاسم': u.name,
            'البريد الإلكتروني': u.email,
            'كلمة المرور': u.password
          }))
        : [{ 'الاسم': '', 'البريد الإلكتروني': '', 'كلمة المرور': '' }];

    // ورقة السلة
    const cartData = cart.length > 0
        ? cart.map(item => ({
            'رقم المنتج': item.id,
            'اسم المنتج': item.name,
            'السعر': item.price,
            'الكمية': item.qty,
            'الإجمالي': item.price * item.qty
          }))
        : [{ 'رقم المنتج': '', 'اسم المنتج': '', 'السعر': '', 'الكمية': '', 'الإجمالي': '' }];

    // ورقة المنتجات (ثابتة)
    const productsData = PRODUCTS.map(p => ({
        'رقم المنتج': p.id,
        'اسم المنتج': p.name,
        'السعر': p.price,
        'الرمز': p.emoji
    }));

    // ورقة الجلسة الحالية
    const sessionData = currentUser 
        ? [{ 'الاسم': currentUser.name, 'البريد الإلكتروني': currentUser.email }]
        : [{ 'الاسم': 'لا يوجد مستخدم مسجل', 'البريد الإلكتروني': '' }];

    // إنشاء المصنف
    const wb = XLSX.utils.book_new();

    const wsUsers = XLSX.utils.json_to_sheet(usersData);
    const wsCart = XLSX.utils.json_to_sheet(cartData);
    const wsProducts = XLSX.utils.json_to_sheet(productsData);
    const wsSession = XLSX.utils.json_to_sheet(sessionData);

    XLSX.utils.book_append_sheet(wb, wsUsers, 'المستخدمين');
    XLSX.utils.book_append_sheet(wb, wsCart, 'السلة');
    XLSX.utils.book_append_sheet(wb, wsProducts, 'المنتجات');
    XLSX.utils.book_append_sheet(wb, wsSession, 'الجلسة الحالية');

    // تنزيل الملف
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `متجر_المحاكاة_قاعدة_البيانات_${date}.xlsx`);

    alert('تم تصدير قاعدة البيانات إلى ملف Excel بنجاح!');
}

/**
 * استيراد المستخدمين من ملف Excel
 * يتوقع ورقة اسمها "المستخدمين" أو أول ورقة تحتوي على أعمدة: الاسم، البريد الإلكتروني، كلمة المرور
 */
function importFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (typeof XLSX === 'undefined') {
        alert('مكتبة Excel لم تُحمّل بعد.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // نحاول نلاقي ورقة المستخدمين
            let sheetName = workbook.SheetNames.find(n => n.includes('مستخدم') || n.toLowerCase().includes('user'));
            if (!sheetName) sheetName = workbook.SheetNames[0];

            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);

            if (!json || json.length === 0) {
                alert('الملف فارغ أو لا يحتوي على بيانات.');
                return;
            }

            // تحويل الأعمدة العربية أو الإنجليزية
            const users = json.map(row => {
                const name = row['الاسم'] || row['name'] || row['Name'] || '';
                const email = (row['البريد الإلكتروني'] || row['البريد'] || row['email'] || row['Email'] || '').toString().toLowerCase().trim();
                const password = (row['كلمة المرور'] || row['password'] || row['Password'] || '').toString();

                return { name: name.toString().trim(), email, password };
            }).filter(u => u.email && u.password);

            if (users.length === 0) {
                alert('لم يتم العثور على مستخدمين صالحين في الملف.\nتأكد أن الأعمدة تحتوي على: الاسم، البريد الإلكتروني، كلمة المرور');
                return;
            }

            // دمج مع المستخدمين الحاليين (تجنب التكرار)
            const existing = getUsers();
            let added = 0;
            users.forEach(u => {
                if (!existing.find(e => e.email === u.email)) {
                    existing.push(u);
                    added++;
                }
            });

            saveUsers(existing);
            alert(`تم استيراد ${added} مستخدم جديد بنجاح.\nإجمالي المستخدمين الآن: ${existing.length}`);

            // إعادة تعيين حقل الملف
            event.target.value = '';

        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء قراءة الملف. تأكد أنه ملف Excel صالح (.xlsx أو .xls)');
        }
    };
    reader.readAsArrayBuffer(file);
}

/**
 * مسح كل البيانات (لإعادة الاختبار من الصفر)
 */
function clearAllData() {
    if (confirm('هل أنت متأكد من مسح كل البيانات؟\n(المستخدمين + السلة + الجلسة الحالية)')) {
        localStorage.removeItem('users');
        localStorage.removeItem('cart');
        localStorage.removeItem('currentUser');
        alert('تم مسح كل البيانات.');
        window.location.href = 'login.html';
    }
}

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarUser();
    updateCartBadge();
    
    if (document.getElementById('products-grid')) {
        renderProducts();
    }
    if (document.getElementById('cart-items')) {
        renderCart();
    }
    
    const protectedPages = ['cart.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage) && !getCurrentUser()) {
        alert('يجب تسجيل الدخول لعرض السلة');
        window.location.href = 'login.html';
    }
});
