
// project script

const LANG_COLORS = {
  JavaScript:'#f1e05a', TypeScript:'#3178c6', Python:'#3572A5',
  Shell:'#89e051', HTML:'#e34c26', CSS:'#563d7c', C:'#555555',
  'C++':'#f34b7d', Rust:'#dea584', Go:'#00ADD8', Lua:'#000080',
  GDScript:'#355570'
};

let repos = [], filter = 'all', langFilter = 'all';

async function load() {
  try {
    const r = await fetch('https://api.github.com/users/stuffbymax/repos?per_page=100&sort=updated');
    if (!r.ok) throw new Error();
    repos = await r.json();
    buildLangButtons();
    render();
  } catch {
    document.getElementById('repo-list').innerHTML = '<div class="empty">could not load repos — you may be rate limited.</div>';
  }
}

function buildLangButtons() {
  const langs = ['all', ...new Set(repos.map(r => r.language).filter(Boolean).sort())];
  const row = document.getElementById('lang-row');
  row.innerHTML = langs.map(l =>
    `<button class="filter-btn lang-btn ${l==='all'?'active':''}" onclick="setLang(this,'${l}')">${l==='all'?'all langs':l}</button>`
  ).join('');
}

function setFilter(btn, f) {
  document.querySelectorAll('.filter-btn:not(.lang-btn)').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filter = f;
  render();
}

function setLang(btn, l) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  langFilter = l;
  render();
}

function render() {
  const q = document.getElementById('search').value.toLowerCase();
  const list = repos.filter(r => {
    if (filter === 'source' && r.fork) return false;
    if (filter === 'fork' && !r.fork) return false;
    if (langFilter !== 'all' && r.language !== langFilter) return false;
    if (q && !r.name.toLowerCase().includes(q) && !(r.description||'').toLowerCase().includes(q)) return false;
    return true;
  });

  document.getElementById('repo-count').textContent = list.length + ' repos';

  if (!list.length) {
    document.getElementById('repo-list').innerHTML = '<div class="empty">nothing found.</div>';
    return;
  }

  document.getElementById('repo-list').innerHTML = list.map(repo => {
    const lang = repo.language || '';
    const dot = lang ? `<span class="lang-dot" style="background:${LANG_COLORS[lang]||'#aaa'}"></span>` : '';
    const stars = repo.stargazers_count > 0 ? `<span class="repo-stars">★ ${repo.stargazers_count}</span>` : '';
    return `<div class="repo-item">
      <div class="repo-item-left">
        <a class="repo-name" href="${repo.html_url}" target="_blank">${repo.name}</a>
        <div class="repo-desc">${repo.description || ''}</div>
      </div>
      <div class="repo-meta">
        ${lang ? `<span class="repo-lang">${dot}${lang}</span>` : ''}
        ${stars}
      </div>
    </div>`;
  }).join('');
}

load();