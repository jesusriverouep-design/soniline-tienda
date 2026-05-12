let carrito = [];

// 1. CARGAR PRODUCTOS Y FILTROS
function mostrarProductos(catId = 'todos') {
    const grid = document.getElementById('productos-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtrados = catId === 'todos' ? productos : productos.filter(p => p.categoria.toLowerCase() === catId.toLowerCase());

    filtrados.forEach(p => {
        let imgFinal = (p.imagenes && p.imagenes.length > 0) ? p.imagenes[0] : (p.imagen || 'img/default.jpg');
        grid.innerHTML += `
            <div class="card">
                <img src="${imgFinal}" onerror="this.src='https://via.placeholder.com/300/1d4db5/ffffff?text=SONILINE'">
                <h3>${p.nombre}</h3>
                <span class="price">$${p.precio}</span>
                <button class="btn-add" onclick="agregarAlCarrito(${p.id})">AGREGAR</button>
            </div>`;
    });
}

function cargarNavCategorias() {
    const nav = document.getElementById('nav-categorias');
    if (!nav || typeof listaCategorias === 'undefined') return;
    nav.innerHTML = '';
    listaCategorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${cat.id === 'todos' ? 'active' : ''}`;
        btn.innerText = cat.nombre;
        btn.onclick = (e) => filtrar(cat.id, e);
        nav.appendChild(btn);
    });
}

function filtrar(catId, evento) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if (evento) evento.target.classList.add('active');
    
    const titulo = document.getElementById('category-title');
    const cat = listaCategorias.find(c => c.id === catId);
    if (titulo && cat) titulo.innerText = cat.titulo.toUpperCase();
    
    mostrarProductos(catId);
}

// 2. CARRITO
function agregarAlCarrito(id) {
    const prod = productos.find(p => p.id === id);
    if (prod) {
        carrito.push(prod);
        document.getElementById('cart-count').innerText = carrito.length;
        document.getElementById('detalle-confirmacion').innerText = prod.nombre;
        document.getElementById('modal-confirmacion').style.display = 'block';
    }
}

function abrirModalCarrito() {
    const lista = document.getElementById('lista-carrito');
    const totalElt = document.getElementById('precio-total');
    document.getElementById('modal-carrito').style.display = 'block';
    lista.innerHTML = '';
    let total = 0;
    carrito.forEach((item, index) => {
        total += item.precio;
        let img = (item.imagenes && item.imagenes[0]) ? item.imagenes[0] : (item.imagen || '');
        lista.innerHTML += `
            <div class="item-carrito">
                <img src="${img}">
                <div style="flex:1; font-size:0.9rem"><strong>${item.nombre}</strong><br>$${item.precio}</div>
                <button class="btn-eliminar-item" onclick="eliminarItem(${index})">✕</button>
            </div>`;
    });
    totalElt.innerText = total;
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    document.getElementById('cart-count').innerText = carrito.length;
    abrirModalCarrito();
}

function enviarWhatsApp() {
    if (carrito.length === 0) return;
    let mensaje = "Hola SONILINE! Me interesa esta cotizacion:%0A%0A";
    let total = 0;
    carrito.forEach((p, i) => {
        total += p.precio;
        mensaje += `${i + 1}. ${p.nombre.toUpperCase()} - $${p.precio}%0A`;
    });
    mensaje += `%0A--------------------------%0ATOTAL: $${total}%0A--------------------------%0AEnviado desde la Web`;
    window.open(`https://wa.me/584247681211?text=${mensaje}`);
}

// 3. TEMA Y ARRANQUE
const themeToggle = document.getElementById('theme-toggle');
function switchTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('theme-icon').innerText = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.getElementById('theme-icon').innerText = '🌙';
        localStorage.setItem('theme', 'dark');
    }
}

themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    switchTheme(isLight ? 'dark' : 'light');
});

window.onload = () => {
    cargarNavCategorias();
    const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    switchTheme(saved);
    mostrarProductos();
};

function cerrarModal() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}