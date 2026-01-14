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
 * LIVE RENDER
 ********************/
function renderLive() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";
  const products = getProducts();

  products.forEach(p => {
    const wrapper = document.createElement("div");
    wrapper.className = "progress-wrapper";

    const percent = Math.min(p.count, 100);

    wrapper.innerHTML = `
      <div class="product-name">${p.name}</div>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
        ${generateTicks()}
      </div>

      <p style="text-align:center;">${p.count} solgt</p>
    `;

    container.appendChild(wrapper);

    // 🎉 Confetti per 5 mål
    if (
      p.count > 0 &&
      p.count % 5 === 0 &&
      !p.milestones.includes(p.count)
    ) {
      p.milestones.push(p.count);
      launchConfetti();
    }
  });

  saveProducts(products);
}

/********************
 * TICKS (hver 5)
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
 * REAL CONFETTI
 ********************/
function launchConfetti() {
  for (let i = 0; i < 120; i++) {
    const c = document.createElement("div");
    c.style.position = "fixed";
    c.style.left = Math.random() * 100 + "vw";
    c.style.top = "-10px";
    c.style.width = "8px";
    c.style.height = "14px";
    c.style.background = `hsl(${Math.random() * 360},100%,50%)`;
    c.style.opacity = 0.9;
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    c.style.animation = `confettiFall ${2 + Math.random() * 2}s linear`;
    document.body.appendChild(c);

    setTimeout(() => c.remove(), 4000);
  }
}

const style = document.createElement("style");
style.innerHTML = `
@keyframes confettiFall {
  to {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}`;
document.head.appendChild(style);

/********************
 * MODE
 ********************/
const page = document.body.dataset.page;

if (page === "live") {
  renderLive();
  setInterval(renderLive, 1000);
}
