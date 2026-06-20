regTool('json-formatter', '{ } JSON 格式化', initJsonFormatter);

function initJsonFormatter(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">JSON 格式化、压缩和校验。</p>
        <div class="tool-actions">
            <button class="btn btn-primary" onclick="ja('f')">🎨 格式化</button>
            <button class="btn btn-success" onclick="ja('c')">📦 压缩</button>
            <button class="btn btn-outline" onclick="ja('v')">✅ 校验</button>
            <button class="btn btn-outline" onclick="document.getElementById('ji').value=''">清空</button>
            <button class="btn btn-outline" onclick="copyText('jo')">📋 复制结果</button>
        </div>
        <textarea id="ji" placeholder='输入 JSON 字符串，如：{"name":"张三","age":25}' style="min-height:200px;font-family:monospace"></textarea>
        <div class="output-area" id="jo" style="font-family:monospace;white-space:pre"></div>`;
}

function ja(a) {
    const i = document.getElementById('ji').value;
    const o = document.getElementById('jo');
    try {
        const p = JSON.parse(i);
        if (a === 'f') o.textContent = JSON.stringify(p, null, 2);
        else if (a === 'c') o.textContent = JSON.stringify(p);
        else o.textContent = '✅ JSON 格式正确！';
        o.style.background = '#dcfce7';
    } catch (e) {
        o.textContent = '❌ ' + e.message;
        o.style.background = '#fef2f2';
    }
}
