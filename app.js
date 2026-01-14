// INIT
if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify([
    { id: 1, name: "Produkt A", count: 0, milestones: [] },
    { id: 2, name: "Produkt B", count: 0, milestones: [] }
  ]));
}

let confirmAction = null;

// HENT
function getProducts() {
  return JSON.parse(localStorage.getItem("products"));
}

function saveProducts(p) {
  localStorage.setItem("products", JSON.stringify(p));
}

// ADMIN + LIVE RENDER
function render(admin = false) {
  const box = document.getElementById("products");
  if (!box) return;

  box.innerHTML = "";
  const products = getProducts();

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>Solgt: ${p.count}</p>
      ${admin ? `
        <button onclick="sell(${p.id})">Solgt</button>
        <button onclick="askConfirm(() => deleteProduct(${p.id}))">Slett</button>
      ` : ""}
    `;
    box.appendChild(div);
  });

  if (admin) {
    box.innerHTML += `
      <button onclick="askConfirm(resetAll)">🔁 Reset alt</button>
    `;
  }
}

// SELG
function sell(id) {
  const p = getProducts();
  const prod = p.find(x => x.id === id);
  prod.count++;

  if (prod.count % 5 === 0 && !prod.milestones.includes(prod.count)) {
    prod.milestones.push(prod.count);
    confetti();
  }

  saveProducts(p);
  render(true);
}

// ADD
function addProduct() {
  const name = document.getElementById("newName").value.trim();
  if (!name) return;

  const p = getProducts();
  p.push({ id: Date.now(), name, count: 0, milestones: [] });
  saveProducts(p);

  closeAdd();
  render(true);
}

// DELETE
function deleteProduct(id) {
  saveProducts(getProducts().filter(p => p.id !== id));
  closeConfirm();
  render(true);
}

// RESET
function resetAll() {
  getProducts().forEach(p => {
    p.count = 0;
    p.milestones = [];
  });
  saveProducts(getProducts());
  closeConfirm();
  render(true);
}

// CONFIRM
function askConfirm(action) {
  confirmAction = action;
  document.getElementById("confirmBox").classList.remove("hidden");
  document.getElementById("yesBtn").onclick = () => confirmAction();
}
function closeConfirm() {
  document.getElementById("confirmBox").classList.add("hidden");
}

// ADD MODAL
function openAdd() {
  document.getElementById("addBox").classList.remove("hidden");
}
function closeAdd() {
  document.getElementById("addBox").classList.add("hidden");
}

// CONFETTI
function confetti() {
  for (let i = 0; i < 25; i++) {
    const c = document.createElement("div");
    c.style.position = "fixed";
    c.style.left = Math.random() * 100 + "vw";
    c.style.top = "-10px";
    c.style.width = "8px";
    c.style.height = "8px";
    c.style.background = `hsl(${Math.random()*360},100%,50%)`;
    c.style.animation = "fall 2s linear";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2000);
  }
}

// FALL ANIM
const s = document.createElement("style");
s.innerHTML = `@keyframes fall { to { transform: translateY(100vh); } }`;
document.head.appendChild(s);

// AUTO
setInterval(() => render(false), 1000);
render(document.title.includes("Admin"));
