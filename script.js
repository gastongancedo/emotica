/* ===== Emotica · interacciones ===== */
(function () {
  'use strict';

  // --- Producto único ---
  const PRODUCT = { id: 'mazo-base', name: 'Emotica — Mazo base', price: 36400 };
  const ARS = n => '$' + n.toLocaleString('es-AR');

  // --- Estado del carrito ---
  let qtyInCart = 0;

  const $ = s => document.querySelector(s);
  const cartCount = $('#cartCount');
  const cartItems = $('#cartItems');
  const cartEmpty = $('#cartEmpty');
  const cartTotal = $('#cartTotal');
  const drawer = $('#drawer');
  const overlay = $('#overlay');

  function openCart() { drawer.classList.add('open'); overlay.classList.add('open'); }
  function closeCart() { drawer.classList.remove('open'); overlay.classList.remove('open'); }

  function render() {
    cartCount.textContent = qtyInCart;
    if (qtyInCart === 0) {
      cartItems.innerHTML = '';
      cartEmpty.style.display = 'grid';
    } else {
      cartEmpty.style.display = 'none';
      cartItems.innerHTML =
        '<div class="citem">' +
          '<div class="citem__img"></div>' +
          '<div class="citem__t"><strong>' + PRODUCT.name + '</strong>' +
          '<small>' + ARS(PRODUCT.price) + ' c/u · Cantidad: ' + qtyInCart + '</small></div>' +
          '<button class="citem__rm" id="rmItem">Quitar</button>' +
        '</div>';
      const rm = $('#rmItem');
      if (rm) rm.addEventListener('click', function () { qtyInCart = 0; render(); });
    }
    cartTotal.textContent = ARS(PRODUCT.price * qtyInCart);
  }

  // --- Agregar al carrito ---
  $('#addToCart').addEventListener('click', function () {
    const q = Math.max(1, parseInt($('#qty').value, 10) || 1);
    qtyInCart += q;
    render();
    openCart();
  });

  // --- Selector de cantidad ---
  document.querySelectorAll('.qty__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      const input = $('#qty');
      let v = parseInt(input.value, 10) || 1;
      v = b.dataset.act === 'inc' ? v + 1 : Math.max(1, v - 1);
      input.value = v;
    });
  });

  // --- Abrir / cerrar carrito ---
  $('#openCart').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });

  // --- Checkout (demo) ---
  $('#checkout').addEventListener('click', function () {
    if (qtyInCart === 0) { alert('Tu carrito está vacío.'); return; }
    alert('¡Gracias! En la tienda real, este botón te lleva al checkout seguro de Mercado Pago / Shopify.\n\nTotal: ' + ARS(PRODUCT.price * qtyInCart));
  });

  // --- Menú mobile ---
  const nav = $('#nav');
  $('#hamburger').addEventListener('click', function () { nav.classList.toggle('open'); });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  // --- Newsletter ---
  $('#newsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    e.target.innerHTML = '<p style="color:#fff;font-weight:600">¡Listo! Ya sos parte de la comunidad Emotica 💚</p>';
  });

  render();
})();
