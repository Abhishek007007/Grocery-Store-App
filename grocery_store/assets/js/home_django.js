const btn = document.getElementById("bg-change");

btn.onclick = () => {
  const r1 = Math.round(Math.random() * 256);
  const g1 = Math.round(Math.random() * 256);
  const b1 = Math.round(Math.random() * 256);
  const c1 = "rgb(" + String(r1) + "," + String(g1) + "," + String(b1) + ")";
  document.body.style.background = c1;
};
