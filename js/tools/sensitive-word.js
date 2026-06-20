const SW = [
    { w: 'fuck', l: 'red' },
    { w: 'shit', l: 'red' },
    { w: 'asshole', l: 'red' },
    { w: 'damn', l: 'yellow' },
    { w: 'bitch', l: 'red' },
];

regTool('sensitive-word', '🚫 敏感词检测', initSensitiveWord);

function initSensitiveWord(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">检测文本中的敏感词汇。所有检测在本地浏览器完成，不会上传。</p>
        <textarea id="si" placeholder="输入要检测的文本..." style="min-height:150px"></textarea>
        <div class="tool-actions">
            <button class="btn btn-primary" onclick="checkSw()">🔍 开始检测</button>
            <button class="btn btn-outline" onclick="clearSw()">清空</button>
        </div>
        <div class="tool-actions" style="margin-top:8px">
            <input type="text" id="swCustom" placeholder="添加自定义敏感词（逗号分隔）" style="flex:1;padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-size:14px">
            <button class="btn btn-outline" onclick="addCustomSw()">添加</button>
        </div>
        <div id="sr"></div>`;
}

function checkSw() {
    const text = document.getElementById('si').value;
    const r = document.getElementById('sr');
    let found = [];
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    for (const item of SW) {
        const re = new RegExp(item.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        if (re.test(text)) {
            found.push(item.w);
            html = html.replace(re, m => '<span class="sensitive-highlight">' + m + '</span>');
        }
    }

    if (!found.length) {
        r.innerHTML = '<div class="output-area" style="background:#dcfce7;color:#166534">✅ 未检测到敏感词汇，内容安全。</div>';
    } else {
        r.innerHTML = '<div class="output-area" style="background:#fef2f2;color:#991b1b">⚠️ 检测到 <strong>' + found.length + '</strong> 个敏感词：' + found.join('、') + '</div>'
            + '<div class="output-area" style="margin-top:8px">' + html.split('\n').join('<br>') + '</div>';
    }
}

function clearSw() {
    document.getElementById('si').value = '';
    document.getElementById('sr').innerHTML = '';
}

function addCustomSw() {
    const v = document.getElementById('swCustom').value;
    v.split(',').map(w => w.trim()).filter(w => w).forEach(w => {
        if (!SW.find(s => s.w === w)) SW.push({ w, l: 'yellow' });
    });
    document.getElementById('swCustom').value = '';
    checkSw();
}
