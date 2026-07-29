(() => {
  const products = [
    { id: "aurora-hoops", name: "Aurora Hoops", price: 148, blurb: "Brushed gold, everyday weight.", swatch: "s1" },
    { id: "tide-ring", name: "Tide Ring", price: 96, blurb: "Soft wave profile in sterling.", swatch: "s2" },
    { id: "ember-pendant", name: "Ember Pendant", price: 210, blurb: "Garnet drop on a fine chain.", swatch: "s3" },
    { id: "linen-cuff", name: "Linen Cuff", price: 172, blurb: "Matte silver with open clasp.", swatch: "s4" },
    { id: "grove-studs", name: "Grove Studs", price: 84, blurb: "Tiny leaf silhouettes.", swatch: "s5" },
    { id: "nocturne-band", name: "Nocturne Band", price: 126, blurb: "Dark rhodium finish.", swatch: "s6" },
  ];

  const grid = document.getElementById("product-grid");
  const cartBtn = document.getElementById("cart-btn");
  const drawer = document.getElementById("cart-drawer");
  const closeCart = document.getElementById("close-cart");
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  const KEY = "lumen-cart-v1";
  let cart = JSON.parse(localStorage.getItem(KEY) || "{}");

  function save() {
    localStorage.setItem(KEY, JSON.stringify(cart));
    renderCart();
  }

  function renderProducts() {
    grid.innerHTML = products
      .map(
        (p) => `
      <article class="card">
        <div class="swatch ${p.swatch}" aria-hidden="true"></div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <div class="price">$${p.price}</div>
          <p>${p.blurb}</p>
          <button class="add-btn" data-id="${p.id}" type="button">Add to bag</button>
        </div>
      </article>`
      )
      .join("");
  }

  function renderCart() {
    const rows = Object.values(cart);
    const count = rows.reduce((n, r) => n + r.qty, 0);
    const total = rows.reduce((n, r) => n + r.qty * r.price, 0);
    cartCount.textContent = String(count);
    cartTotal.textContent = `$${total}`;
    if (!rows.length) {
      cartItems.innerHTML = `<p class="empty">Your bag is empty.</p>`;
      return;
    }
    cartItems.innerHTML = rows
      .map(
        (r) => `
      <div class="cart-row">
        <div>
          <strong>${r.name}</strong><br />
          <span>$${r.price} × ${r.qty}</span>
        </div>
        <button type="button" data-dec="${r.id}">−</button>
        <button type="button" data-inc="${r.id}">+</button>
      </div>`
      )
      .join("");
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (!btn) return;
    const product = products.find((p) => p.id === btn.dataset.id);
    if (!product) return;
    if (!cart[product.id]) cart[product.id] = { ...product, qty: 0 };
    cart[product.id].qty += 1;
    save();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
  });

  cartItems.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    if (inc) {
      cart[inc.dataset.inc].qty += 1;
      save();
    }
    if (dec) {
      const id = dec.dataset.dec;
      cart[id].qty -= 1;
      if (cart[id].qty <= 0) delete cart[id];
      save();
    }
  });

  function openCart() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
  }
  function hideCart() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }

  cartBtn.addEventListener("click", openCart);
  closeCart.addEventListener("click", hideCart);
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) hideCart();
  });
  checkoutBtn.addEventListener("click", () => {
    if (!Object.keys(cart).length) return;
    alert("Demo checkout complete. In a real Shopify build this becomes native checkout.");
    cart = {};
    save();
    hideCart();
  });

  renderProducts();
  renderCart();
})();
