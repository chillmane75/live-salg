/********************
 * INIT DATA
 ********************/
if (!localStorage.getItem("products")) {
  localStorage.setItem(
    "products",
    JSON.stringify([
      { id: 1, name: "Produkt A", count: 0, milestones: [] },
      { id: 2, name: "Produkt B", count: 0, milestones: [] }
    ])
  );
}

/********************
 * HELPERS
 ********************/
function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

/********************
 * RENDER
 ********************/
function render(isAdmin) {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";
  const products = getProducts();

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>Solgt: ${p.count}</p>
      ${
        isAdmin
          ? `
        <button onclick="sell(${p.id})">Solgt</button>
        <button onclick="askConfirm(() => deleteProduct(${p.id}))">Slett</button>
      `
          : ""
      }
    `;

    container.appendChild(div);
  });

  if (isAdmin) {
    const resetBtn = document.createElement("button");
    resetBtn.innerText = "🔁 Reset alt";
    resetBtn.onclick = () => askConfirm(resetAll);
    container.appendChild(resetBtn);
  }
}

/********************
 * ADMIN ACTIONS
 ********************/
function sell(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return;

  product.count++;

  // Milestone 5 / 10 / 15 ...
  if (
    product.count > 0 &&
    product.count % 5 === 0 &&
    !product.milestones.includes(product.count)
  ) {
    product.milestones.push(product.count);
    launchConfetti();
  }

  saveProducts(products);
  render(true);
}

function addProduct() {
  const input = document.getElementById("newName");
  if (!input) return;

  const name = input.value.trim();
  if (!name) return;

  const products = getProducts();
  products.push({
    id: Date.now(),
    name,
    count: 0,
    milestones: []
  });

  saveProducts(products);
  input.value = "";
  closeAdd();
  render(true);
}

function deleteProduct(id) {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  closeConfirm();
  render(true);
}

function resetAll() {
  const products = getProducts();
  products.forEach(p => {
    p.count = 0;
    p.milestones = [];
  });

  saveProducts(products);
  closeConfirm();
  render(true);
}

/********************
 * CONFIRM MODAL
 ********************/
let confirmAction = null;

function askConfirm(action) {
  confirmAction = action;
  document.getElementById("confirmBox")?.classList.remove("hidden");
  document.getElementById("yesBtn").onclick = () => {
    if (confirmAction) confirmAction();
  };
}

function closeConfirm() {
  document.getElementById("confirmBox")?.classList.add("hidden");
  confirmAction = null;
}

/********************
 * ADD MODAL
 ********************/
function openAdd() {
  document.getElementById("addBox")?.classList.remove("hidden");
}

function closeAdd() {
  document.getElementById("addBox")?.classList.add("hidden");
}

/********************
 * CONFETTI
 ********************/
function launchConfetti() {
  for (let i = 0; i < 25; i++) {
    const c = document.createElement("div");
    c.style.position = "fixed";
    c.style.left = Math.random() * 100 + "vw";
    c.style.top = "-10px";
    c.style.width = "8px";
    c.style.height = "8px";
    c.style.background = `hsl(${Math.random() * 360},100%,50%)`;
    c.style.animation = "fall 2s linear";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2000);
  }
}

// Inject animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}`;
document.head.appendChild(style);

/********************
 * PAGE MODE
 ********************/
const pageType = document.body.dataset.page;
const isAdmin = pageType === "admin";


if (isAdmin) {
  render(true);
} else {
  render(false);
  setInterval(() => render(false), 1000);
}
