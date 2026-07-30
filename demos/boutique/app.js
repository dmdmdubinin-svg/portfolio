(() => {
  const PRODUCTS = [
    { id: "aurora-hoops", name: "Aurora Hoops", price: 148, blurb: "Brushed gold, everyday weight.", swatch: "s1" },
    { id: "tide-ring", name: "Tide Ring", price: 96, blurb: "Soft wave profile in sterling.", swatch: "s2" },
    { id: "ember-pendant", name: "Ember Pendant", price: 210, blurb: "Garnet drop on a fine chain.", swatch: "s3" },
    { id: "linen-cuff", name: "Linen Cuff", price: 172, blurb: "Matte silver with an open clasp.", swatch: "s4" },
    { id: "grove-studs", name: "Grove Studs", price: 84, blurb: "Tiny leaf silhouettes.", swatch: "s5" },
    { id: "nocturne-band", name: "Nocturne Band", price: 126, blurb: "Dark rhodium finish.", swatch: "s6" },
  ];
  const STORAGE_KEY = "lumen-cart-v2";

  const grid = document.getElementById("product-grid");
  const cartBtn = document.getElementById("cart-btn");
  const drawer = document.getElementById("cart-drawer");
  const closeBtn = document.getElementById("close-cart");
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const drawerMsg = document.getElementById("drawer-msg");

  const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
  let lastFocused = null;

  /* Quantities only — prices always come from the catalog, never from storage. */
  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const clean = {};
      Object.entries(raw).forEach(([id, qty]) => {
        const n = Number(qty);
        if (byId.has(id) && Number.isFinite(n) && n > 0) clean[id] = Math.min(Math.floor(n), 99);
      });
      return clean;
    } catch {
      return {};
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* private mode or storage full — the cart still works for this session */
    }
    renderCart();
  }

  let cart = loadCart();

  const money = (n) => `$${n.toLocaleString("en-US")}`;

  function renderProducts() {
    grid.innerHTML = PRODUCTS.map(
      (p) => `
      <article class="card">
        <div class="swatch ${p.swatch}" aria-hidden="true"></div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <div class="price">${money(p.price)}</div>
          <p>${p.blurb}</p>
          <button class="add-btn" data-add="${p.id}" type="button">Add to bag</button>
        </div>
      </article>`
    ).join("");
  }

  function renderCart() {
    const entries = Object.entries(cart);
    const count = entries.reduce((n, [, qty]) => n + qty, 0);
    const total = entries.reduce((n, [id, qty]) => n + byId.get(id).price * qty, 0);

    cartCount.textContent = String(count);
    cartTotal.textContent = money(total);
    checkoutBtn.disabled = count === 0;

    if (!entries.length) {
      cartItems.innerHTML = `<p class="empty">Your bag is empty.</p>`;
      return;
    }

    cartItems.innerHTML = entries
      .map(([id, qty]) => {
        const p = byId.get(id);
        return `
      <div class="cart-row">
        <div>
          <strong>${p.name}</strong><br />
          <span>${money(p.price)} × ${qty}</span>
        </div>
        <button type="button" data-dec="${id}" aria-label="Remove one ${p.name}">−</button>
        <button type="button" data-inc="${id}" aria-label="Add one ${p.name}">+</button>
      </div>`;
      })
      .join("");
  }

  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    drawerMsg.textContent = "";
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = btn.dataset.add;
    if (!byId.has(id)) return;
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    openDrawer();
  });

  cartItems.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    if (inc) cart[inc.dataset.inc] = (cart[inc.dataset.inc] || 0) + 1;
    if (dec) {
      const id = dec.dataset.dec;
      cart[id] = (cart[id] || 0) - 1;
      if (cart[id] <= 0) delete cart[id];
    }
    if (inc || dec) saveCart();
  });

  cartBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) closeDrawer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });

  checkoutBtn.addEventListener("click", () => {
    if (!Object.keys(cart).length) return;
    cart = {};
    saveCart();
    drawerMsg.textContent = "Demo order placed. On a real build this hands off to Shopify checkout.";
  });

  renderProducts();
  renderCart();
})();
