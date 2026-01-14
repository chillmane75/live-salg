// Init data hvis det ikke finnes
if (!localStorage.getItem("sales")) {
  localStorage.setItem(
    "sales",
    JSON.stringify({
      a: 0,
      b: 0,
      milestones: { a: [], b: [] }
    })
  );
}

// ADMIN: selg produkt
function sell(product) {
  const data = JSON.parse(localStorage.getItem("sales"));
  data[product]++;
  localStorage.setItem("sales", JSON.stringify(data));
}

// LIVE: oppdater visning + konfetti
function updateLive() {
  const data = JSON.parse(localStorage.getItem("sales"));

  if (!data) return;

  document.getElementById("count-a")?.innerText = data.a;
  document.getElementById("count-b")?.innerText = data.b;

  checkMilestone("a", data.a, data);
  checkMilestone("b", data.b, data);

  localStorage.setItem("sales", JSON.stringify(data));
}

// Sjekk 5 / 10 / 15 osv
function checkMilestone(product, count, data) {
  if (count > 0 && count % 5 === 0) {
    if (!data.milestones[product].includes(count)) {
      data.milestones[product].push(count);
      launchConfetti();
    }
  }
}

// Enkel konfetti (ingen bibliotek)
function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "fixed";
    confetti.style.top = "-10px";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.background = "hsl(" + Math.random() * 360 + ",100%,50%)";
    confetti.style.animation = "fall 2s linear";
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
  }
}

// Polling (fake real-time)
setInterval(updateLive, 1000);

// CSS animation via JS
const style = document.createElement("style");
style.innerHTML = `
@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}`;
document.head.appendChild(style);
