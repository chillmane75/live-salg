/********************
 * INIT
 ********************/
if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify([
    { id: 1, name: "Produkt A", count: 0, milestones: [] },
    { id: 2, name: "Produkt B", count: 0, milestones: [] }
  ]));
}

function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(p) {
  localStorage.setItem("products", JSON.stringify(p));
}

/********************
 * ADMIN
 ********************/
function renderAdmin() {
  const box = document.getElementById("products");
  if (!box) return;

  box.innerHTML = "";
  getProducts().forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>Solgt: ${p.count}</p>
      <button onclick="sell(${p.id})">Solgt</button>
      <button onclick="askConfirm(() => deleteProduct(${p.id}))">Slett</button>
    `;
    box.appendChild(div);
  });

  const reset = document.createElement("button");
  reset.innerText = "🔁 Reset alt";
  reset.onclick = () => askConfirm(resetAll);
  box.appendChild(reset);
}

function sell(id) {
  const p = getProducts();
  const prod = p.find(x => x.id === id);
  prod.count++;
  saveProducts(p);
  renderAdmin();
}

function addProduct() {
  const input = document.getElementById("newName");
  const name = input.value.trim();
  if (!name) return;

  const p = getProducts();
  p.push({ id: Date.now(), name, count: 0, milestones: [] });
  saveProducts(p);

  input.value = "";
  closeAdd();
  renderAdmin();
}

function deleteProduct(id) {
  saveProducts(getProducts().filter(p => p.id !== id));
  closeConfirm();
  renderAdmin();
}

function resetAll() {
  const p = getProducts();
  p.forEach(x => { x.count = 0; x.milestones = []; });
  saveProducts(p);
  closeConfirm();
  renderAdmin();
}

/********************
 * CONFIRM + MODALS
 ********************/
let confirmAction = null;

function askConfirm(fn) {
  confirmAction = fn;
  document.getElementById("confirmBox").classList.remove("hidden");
  document.getElementById("yesBtn").onclick = fn;
}

function closeConfirm() {
  document.getElementById("confirmBox").classList.add("hidden");
}

function openAdd() {
  document.getElementById("addBox").classList.remove("hidden");
}

function closeAdd() {
  document.getElementById("addBox").classList.add("hidden");
}

/********************
 * LIVE
 ********************/
function renderLive() {
  const box = document.getElementById("products");
  if (!box) return;

  box.innerHTML = "";
  const products = getProducts();

  products.forEach(p => {
    const percent = Math.min(p.count, 100);

    const wrap = document.createElement("div");
    wrap.className = "progress-wrapper";
    wrap.innerHTML = `
      <div class="product-name">${p.name}</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
        ${generateTicks()}
      </div>
      <p style="text-align:center;">${p.count} solgt</p>
    `;
    box.appendChild(wrap);

    if (p.count > 0 && p.count % 5 === 0 && !p.milestones.includes(p.count)) {
      p.milestones.push(p.count);
      launchConfetti();
    }
  });

  saveProducts(products);
}

/********************
 * TICKS (MED TALL)
 ********************/
function generateTicks() {
  let html = "";
  for (let i = 5; i <= 100; i += 5) {
    html += `
      <div class="tick" style="left:${i}%">
        <span>${i}</span>
      </div>
    `;
  }
  return html;
}

/********************
 * CONFETTI (LIVE)
 ********************/
function launchConfetti() {
  for (let i = 0; i < 120; i++) {
    const c = document.createElement("div");
    c.style.position = "fixed";
    c.style.left = Math.random() * 100 + "vw";
    c.style.top = "-10px";
    c.style.width = "10px";
    c.style.height = "10px";
    c.style.background = `hsl(${Math.random()*360},100%,50%)`;
    c.style.animation = "confetti 3s linear";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

const style = document.createElement("style");
style.innerHTML = `
@keyframes confetti {
  to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}`;
document.head.appendChild(style);

/********************
 * MODE
 ********************/
const page = document.body.dataset.page;
if (page === "admin") renderAdmin();
if (page === "live") {
  renderLive();
  setInterval(renderLive, 1000);
}
