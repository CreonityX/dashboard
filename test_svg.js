const cx = 250, cy = 250, R_outer = 380, R_clip = 230;
const getBoundary = (angleDeg) => {
  const angleRad = (angleDeg * Math.PI) / 180;
  const V = { x: R_outer * Math.cos(angleRad), y: R_outer * Math.sin(angleRad) };
  const P = { x: cx + V.x, y: cy + V.y };
  const Perp = { x: -V.y, y: V.x };
  const b = 0.25;
  const c1 = { x: cx + V.x * 0.33 + Perp.x * b, y: cy + V.y * 0.33 + Perp.y * b };
  const c2 = { x: cx + V.x * 0.66 - Perp.x * b, y: cy + V.y * 0.66 - Perp.y * b };
  return { P, c1, c2 };
};
const b1 = getBoundary(0);
const b2 = getBoundary(90);
const pathData = `M ${cx} ${cy} C ${b1.c1.x} ${b1.c1.y} ${b1.c2.x} ${b1.c2.y} ${b1.P.x} ${b1.P.y} A ${R_outer} ${R_outer} 0 0 1 ${b2.P.x} ${b2.P.y} C ${b2.c2.x} ${b2.c2.y} ${b2.c1.x} ${b2.c1.y} ${cx} ${cy} Z`;
console.log(pathData);
