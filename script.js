// Demo product data
const PRODUCTS = [
  {
    id: 1,
    name: "Minimal Hoodie",
    desc: "Soft cotton hoodie with clean lines.",
    price: 2999,
    image: "https://images.unsplash.com/photo-1520975693419-2b1f1c1b9c66?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Studio Headphones",
    desc: "Balanced sound for work and play.",
    price: 7499,
    image: "https://images.unsplash.com/photo-1518444027393-6d1b543f4e6e?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Elegant Mug",
    desc: "Ceramic mug, matte finish.",
    price: 899,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Desk Lamp",
    desc: "Minimal lamp with warm glow.",
    price: 3299,
    image: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Notebook Set",
    desc: "A5 dotted notebooks (pack of 3).",
    price: 1199,
    image: "https://images.unsplash.com/photo-1531346894227-69d0369da6e1?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Wireless Mouse",
    desc: "Ergonomic and responsive.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
  }
];

const productsEl = document.getElementById("products");
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const overlay = document.getElementById("overlay");
const closeCartBtn = document.getElementById("closeCart");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");

let cart = []; // {id, name, price, image, qty}

function formatCurrency(n) {
  return `NPR ${n.toLocaleString("en-NP")}`;
}

function renderProducts() {
  productsEl.innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <img src="${p.image}" alt="${p.name}"/>
      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="price-row">
          <span class="price">${formatCurrency(p.price)}</span>
          <div class="btn-row">
            <button class="btn btn-primary" data-add="${p.id}">Add to cart</button>
            <button class="btn" data-view="${p.id}">View</button>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  // Bind add buttons
  document.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.dataset.add);
      addToCart(id);
    });
  });
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
  renderCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  renderCart();
}

function cartTotals() {
  const count = cart.reduce((acc, i) => acc + i.qty, 0);
  const total = cart.reduce((acc, i) => acc + i.qty * i.price, 0);
  cartCountEl.textContent = count;
  cartTotalEl.textContent = formatCurrency(total);
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
  } else {
    cartItemsEl.innerHTML = cart.map(i => `
      <div class="cart-item">
        <img src="${i.image}" alt="${i.name}"/>
        <div>
          <h4>${i.name}</h4>
          <div class="meta">${formatCurrency(i.price)} each</div>
          <div class="qty">
            <button aria-label="Decrease" onclick="changeQty(${i.id}, -1)">−</button>
            <span>${i.qty}</span>
            <button aria-label="Increase" onclick="changeQty(${i.id}, 1)">+</button>
          </div>
        </div>
        <div style="text-align:right;">
          <div><strong>${formatCurrency(i.qty * i.price)}</strong></div>
          <button class="btn btn-danger" style="margin-top:8px;" onclick="removeFromCart(${i.id})">Remove</button>
        </div>
      </div>
    `).join("");
  }
  cartTotals();
}

// Drawer + overlay controls
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}

// Checkout modal controls
function openCheckout() {
  checkoutModal.classList.add("show");
  overlay.classList.add("show");
}
function closeCheckoutModal() {
  checkoutModal.classList.remove("show");
  overlay.classList.remove("show");
}

// Event bindings
cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", () => { closeCart(); closeCheckoutModal(); });
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  openCheckout();
});
closeCheckout.addEventListener("click", closeCheckoutModal);

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Mock order
  alert("Order placed (demo). Replace this with eSewa/Khalti/Stripe integration.");
  cart = [];
  renderCart();
  closeCheckoutModal();
  closeCart();
});

// Init
renderProducts();
renderCart();