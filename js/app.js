const tools = {};

function regTool(name, title, fn) {
    tools[name] = { title, fn };
}

function showTool(name) {
    const t = tools[name];
    if (!t) return;
    document.getElementById('toolGrid').style.display = 'none';
    const panel = document.getElementById('toolPanel');
    panel.style.display = 'block';
    document.getElementById('toolTitle').textContent = t.title;
    const content = document.getElementById('toolContent');
    content.innerHTML = '<div class="tool-body"></div>';
    t.fn(content.querySelector('.tool-body'));
    window.location.hash = name;
    window.scrollTo({ top: panel.offsetTop - 20, behavior: 'smooth' });
}

function hideTool() {
    document.getElementById('toolPanel').style.display = 'none';
    document.getElementById('toolGrid').style.display = 'grid';
    window.location.hash = '';
}

window.addEventListener('DOMContentLoaded', () => {
    const h = window.location.hash.replace('#', '');
    if (h && tools[h]) setTimeout(() => showTool(h), 100);
});

function copyText(id) {
    const text = document.getElementById(id).textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const orig = btn.textContent;
        btn.textContent = '✅ 已复制';
        setTimeout(() => btn.textContent = orig, 1500);
    });
}
