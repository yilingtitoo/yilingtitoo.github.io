// skills ticker (duplicated once so the loop is seamless)
const words = ['A/B testing','Onboarding','Homepage','Lifecycle design','AI-assisted workflows','Design systems','User research','Referral programs','Human-centred AI','Prompt-driven prototyping'];
const track = document.getElementById('track');
const build = () => words.map((w,i)=>`<span class="${i%3===0?'hi':''}">${w}</span><i></i>`).join('');
track.innerHTML = build() + build();

// scroll reveal
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// active nav link
const links = [...document.querySelectorAll('.nav a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && spy.observe(s));

// case studies are not published yet: no navigation, just a gentle note
const toast = document.getElementById('toast');
let t;
document.querySelectorAll('a.soon').forEach(a => a.addEventListener('click', ev => {
  ev.preventDefault();
  toast.classList.add('show');
  clearTimeout(t);
  t = setTimeout(() => toast.classList.remove('show'), 1800);
}));
