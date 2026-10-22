// skills ticker (duplicated once so the loop is seamless)
const words = ['A/B testing','Onboarding','Design QA','Lifecycle design','AI-assisted workflows','Design systems','User research','Referral programs','Human-centred AI','Prompt-driven prototyping'];
const track = document.getElementById('track');
const build = () => words.map((w,i)=>`<span class="${i%3===0?'hi':''}">${w}</span><i></i>`).join('');
if (track) track.innerHTML = build() + build();

// scroll reveal
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// active nav link
const links = [...document.querySelectorAll('.nav a')];
const sections = links.map(a => { const href = a.getAttribute('href'); return href.charAt(0) === '#' ? document.querySelector(href) : null; });
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && spy.observe(s));

// case studies are not published yet: no navigation, just a gentle note
const toast = document.getElementById('toast');
let t;
document.querySelectorAll('a.soon').forEach(a => a.addEventListener('click', ev => {
  ev.preventDefault();
  if (!toast) return;
  toast.classList.add('show');
  clearTimeout(t);
  t = setTimeout(() => toast.classList.remove('show'), 1800);
}));

// theme toggle (initial theme is set by the inline script in <head>)
const themeBtn = document.getElementById('themeToggle');
const metaTheme = document.querySelector('meta[name="theme-color"]');
const syncTheme = () => {
  if (!themeBtn) return;
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  themeBtn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  themeBtn.setAttribute('aria-pressed', light ? 'true' : 'false');
  if (metaTheme) metaTheme.setAttribute('content', light ? '#FFFFFF' : '#0C0D18');
};
if (themeBtn) syncTheme();
let fadeT;
if (themeBtn) themeBtn.addEventListener('click', () => {
  const root = document.documentElement;
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  root.classList.add('theme-fade');
  root.setAttribute('data-theme', next);
  syncTheme();
  try { localStorage.setItem('theme', next); } catch (e) {}
  clearTimeout(fadeT);
  fadeT = setTimeout(() => root.classList.remove('theme-fade'), 400);
});


// Hover extras on the animated feature images: sparkle burst + pointer parallax (phone stays still)
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.anim');
  if (!cards.length) return;
  const star = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0c.8 6.2 5.8 11.2 12 12-6.2.8-11.2 5.8-12 12-.8-6.2-5.8-11.2-12-12C6.2 11.2 11.2 6.2 12 0z"/></svg>';
  const spots = {
    'anim-referral': [[8,22,'--yellow',18,0],[93,58,'--mint',14,.5],[52,5,'--pink',12,1.1],[91,92,'--yellow',16,.3],[4,68,'--peri',13,.8],[70,8,'--yellow',10,1.5]],
    'anim-onboarding': [[7,38,'--yellow',16,0],[93,40,'--pink',14,.6],[48,5,'--mint',12,1.2],[26,12,'--yellow',10,.4],[80,86,'--peri',15,.9],[4,88,'--yellow',12,1.4]]
  };
  cards.forEach(card => {
    const key = card.classList.contains('anim-referral') ? 'anim-referral' : 'anim-onboarding';
    if (!reduce) (spots[key] || []).forEach(([x, y, col, size, delay]) => {
      const sp = document.createElement('span');
      sp.className = 'spark';
      sp.style.cssText = 'left:' + x + '%;top:' + y + '%;--c:var(' + col + ');--s:' + size + 'px;--d:' + delay + 's';
      sp.innerHTML = star;
      card.appendChild(sp);
    });
    if (reduce) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      card.style.setProperty('--mx', cx.toFixed(3));
      card.style.setProperty('--my', cy.toFixed(3));
      raf = (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) ? requestAnimationFrame(tick) : 0;
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      go();
    });
    card.addEventListener('pointerleave', () => { tx = 0; ty = 0; go(); });
  });
})();
