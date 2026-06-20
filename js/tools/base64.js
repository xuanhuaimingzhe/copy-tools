regTool('base64', '🔐 Base64 编解码', initBase64);

function initBase64(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">Base64 编码与解码，完美支持中文。数据仅在本地浏览器处理。</p>
        <textarea id="bi" placeholder="输入要编码或解码的文字..." style="min-height:150px"></textarea>
        <div class="tool-actions">
            <button class="btn btn-primary" onclick="b64e()">🔒 编码</button>
            <button class="btn btn-success" onclick="b64d()">🔓 解码</button>
            <button class="btn btn-outline" onclick="document.getElementById('bi').value=''">清空</button>
            <button class="btn btn-outline" onclick="copyText('bo')">📋 复制结果</button>
        </div>
        <div class="output-area" id="bo">结果将显示在这里...</div>`;
}

function b64e() {
    try {
        document.getElementById('bo').textContent = btoa(unescape(encodeURIComponent(document.getElementById('bi').value)));
        document.getElementById('bo').style.background = '#f1f5f9';
    } catch (e) {
        document.getElementById('bo').textContent = '❌ 编码失败';
        document.getElementById('bo').style.background = '#fef2f2';
    }
}

function b64d() {
    try {
        document.getElementById('bo').textContent = decodeURIComponent(escape(atob(document.getElementById('bi').value)));
        document.getElementById('bo').style.background = '#f1f5f9';
    } catch (e) {
        document.getElementById('bo').textContent = '❌ 无效的 Base64 编码';
        document.getElementById('bo').style.background = '#fef2f2';
    }
}
