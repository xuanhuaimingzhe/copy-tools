regTool('password', '🔑 密码生成器', initPassword);

function initPassword(c) {
    c.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
            <div><label style="font-size:14px;color:var(--text-light)">密码长度</label>
                <input type="number" id="pwLen" value="16" min="4" max="64" style="margin-top:8px"></div>
            <div><label style="font-size:14px;color:var(--text-light)">生成数量</label>
                <input type="number" id="pwCount" value="1" min="1" max="20" style="margin-top:8px"></div>
        </div>
        <div class="tool-actions">
            <label style="font-size:14px;display:flex;align-items:center;gap:6px;cursor:pointer">
                <input type="checkbox" id="pwUpper" checked> 大写字母 A-Z
            </label>
            <label style="font-size:14px;display:flex;align-items:center;gap:6px;cursor:pointer">
                <input type="checkbox" id="pwLower" checked> 小写字母 a-z
            </label>
            <label style="font-size:14px;display:flex;align-items:center;gap:6px;cursor:pointer">
                <input type="checkbox" id="pwDigits" checked> 数字 0-9
            </label>
            <label style="font-size:14px;display:flex;align-items:center;gap:6px;cursor:pointer">
                <input type="checkbox" id="pwSymbols" checked> 特殊字符 !@#$
            </label>
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" onclick="genPassword()">🎲 生成密码</button>
            <button class="btn btn-outline" onclick="copyAllPW()">📋 复制全部</button>
        </div>
        <div class="output-area" id="pwOut" style="font-family:monospace;font-size:15px"></div>`;
}

function genPassword() {
    const len = Math.max(4, Math.min(64, +document.getElementById('pwLen').value || 16));
    const count = Math.max(1, Math.min(20, +document.getElementById('pwCount').value || 1));
    const upper = document.getElementById('pwUpper').checked;
    const lower = document.getElementById('pwLower').checked;
    const digits = document.getElementById('pwDigits').checked;
    const syms = document.getElementById('pwSymbols').checked;
    if (!upper && !lower && !digits && !syms) return alert('至少选择一种字符类型');
    const pools = [];
    const all = [];
    if (upper) { pools.push('ABCDEFGHJKLMNPQRSTUVWXYZ'); all.push(...pools[pools.length-1]); }
    if (lower) { pools.push('abcdefghjkmnopqrstuvwxyz'); all.push(...pools[pools.length-1]); }
    if (digits) { pools.push('23456789'); all.push(...pools[pools.length-1]); }
    if (syms) { pools.push('!@#$%^&*()-_=+[]{};:,.<>?'); all.push(...pools[pools.length-1]); }
    const arr = [];
    const out = document.getElementById('pwOut');
    for (let c = 0; c < count; c++) {
        let pw = '';
        for (let pool of pools) pw += pool[Math.floor(Math.random() * pool.length)];
        while (pw.length < len) pw += all[Math.floor(Math.random() * all.length)];
        pw = pw.split('').sort(() => Math.random() - 0.5).join('');
        arr.push(pw);
    }
    out.innerHTML = arr.map((p, i) => `<div style="padding:8px 0;border-bottom:1px solid var(--border)">
        <b>#${i+1}</b> <code style="font-size:16px">${p}</code>
        <button class="copy-btn" onclick="navigator.clipboard.writeText('${p}').then(()=>{this.textContent='✅'})" style="margin-left:10px">复制</button>
        </div>`).join('');
    out.style.background = '#dcfce7';
}

function copyAllPW() {
    const divs = document.querySelectorAll('#pwOut code');
    const all = Array.from(divs).map(d => d.textContent).join('\n');
    if (all) navigator.clipboard.writeText(all).then(() => {
        document.getElementById('pwOut').style.background = '#f0fdf4';
    });
}
