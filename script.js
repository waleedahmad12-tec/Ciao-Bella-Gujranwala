/* ==========================================================================
   CIAO BELLA — script.js
   Handles: loader, mobile nav, sticky menu search, favorites, cart sidebar,
   FAQ accordion, table booking + contact + newsletter forms, scroll-to-top.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    if (loader) loader.classList.add('hide');
  });
  // Fallback in case the load event already fired
  setTimeout(() => { if (loader) loader.classList.add('hide'); }, 1200);

  /* ---------- Toast helper ---------- */
  function showToast(message){
    let toast = document.querySelector('.toast');
    if (!toast){
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ---------- Mobile nav toggle ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.querySelector('.navbar');
  if (menuToggle && navbar){
    menuToggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });
    navbar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navbar.classList.remove('open'));
    });
  }

  /* ---------- Menu search filter ---------- */
  const searchInput = document.getElementById('searchInput');
  const menuCards = Array.from(document.querySelectorAll('.menu-card'));
  if (searchInput){
    searchInput.addEventListener('input', () => {
      const term = searchInput.value.trim().toLowerCase();
      menuCards.forEach(card => {
        const name = (card.querySelector('h3')?.textContent || '').toLowerCase();
        card.classList.toggle('hidden', term.length > 0 && !name.includes(term));
      });
    });
  }

  /* ---------- Favorites (heart toggle) ---------- */
  document.querySelectorAll('.favorite').forEach(fav => {
    fav.addEventListener('click', () => {
      fav.classList.toggle('active');
      fav.textContent = fav.classList.contains('active') ? '❤️' : '🤍';
    });
  });

  /* ---------- Cart ---------- */
  const cart = [];
  const cartIcon = document.getElementById('cartIcon');
  const cartCountEl = document.getElementById('cartCount');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const shoppingCart = document.getElementById('shoppingCart');
  const closeCartBtn = document.getElementById('closeCart');

  // Overlay for closing the cart by clicking outside it
  let cartOverlay = document.querySelector('.cart-overlay');
  if (!cartOverlay){
    cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    document.body.appendChild(cartOverlay);
  }

  function openCart(){
    shoppingCart?.classList.add('open');
    cartOverlay.classList.add('show');
  }
  function closeCart(){
    shoppingCart?.classList.remove('open');
    cartOverlay.classList.remove('show');
  }

  function renderCart(){
    if (!cartItemsEl || !cartTotalEl || !cartCountEl) return;

    cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

    if (cart.length === 0){
      cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty. Add something delicious!</p>';
    } else {
      cartItemsEl.innerHTML = cart.map((item, index) => `
        <div class="cart-line">
          <span>${item.name} × ${item.qty}</span>
          <span>Rs. ${item.price * item.qty}</span>
          <button class="cart-line-remove" data-index="${index}" aria-label="Remove ${item.name}">&times;</button>
        </div>
      `).join('');
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalEl.textContent = total;
  }

  document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);
      const existing = cart.find(item => item.name === name);
      if (existing){
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      renderCart();
      showToast(`${name} added to your order`);
    });
  });

  cartItemsEl?.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('.cart-line-remove');
    if (!removeBtn) return;
    const index = Number(removeBtn.dataset.index);
    cart.splice(index, 1);
    renderCart();
  });

  cartIcon?.addEventListener('click', openCart);
  closeCartBtn?.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  const checkoutBtn = document.querySelector('.cart-footer .btn');
  checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0){
      showToast('Your cart is empty');
      return;
    }
    showToast('Order placed! Ciao Bella will call you shortly.');
    cart.length = 0;
    renderCart();
    closeCart();
  });

  renderCart();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.help-item').forEach(item => {
    const question = item.querySelector('.help-question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.help-item.open').forEach(open => open.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- Table booking form ---------- */
  const bookingForm = document.getElementById('bookingForm');
  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name')?.value.trim();
    showToast(`Thanks${name ? ', ' + name : ''}! Your table request has been sent.`);
    bookingForm.reset();
  });

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Message sent! We\'ll get back to you soon.');
    contactForm.reset();
  });

  /* ---------- Newsletter form ---------- */
  const newsletterForm = document.querySelector('.newsletter-form');
  newsletterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Subscribed! Watch your inbox for deals.');
    newsletterForm.reset();
  });

  /* ---------- Scroll to top ---------- */
  const topBtn = document.getElementById('topBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500){
      topBtn?.classList.add('show');
    } else {
      topBtn?.classList.remove('show');
    }
  });
  topBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});