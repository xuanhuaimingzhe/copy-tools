regTool('word-count', '📊 字数统计', initWordCount);

function initWordCount(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">实时统计中英文字数、字符数、段落数。</p>
        <textarea id="wc" placeholder="在此输入文字，实时统计..." oninput="updWc()" style="min-height:200px"></textarea>
        <div class="stats">
            <div class="stat-item"><div class="stat-value" id="w1">0</div><div class="stat-label">总字符</div></div>
            <div class="stat-item"><div class="stat-value" id="w2">0</div><div class="stat-label">中文字</div></div>
            <div class="stat-item"><div class="stat-value" id="w3">0</div><div class="stat-label">英文词</div></div>
            <div class="stat-item"><div class="stat-value" id="w4">0</div><div class="stat-label">行数</div></div>
            <div class="stat-item"><div class="stat-value" id="w5">0</div><div class="stat-label">段落</div></div>
            <div class="stat-item"><div class="stat-value" id="w6">0</div><div class="stat-label">标点/空格</div></div>
        </div>`;
}

function updWc() {
    const t = document.getElementById('wc').value;
    document.getElementById('w1').textContent = t.length;
    document.getElementById('w2').textContent = (t.match(/[\u4e00-\u9fff]/g) || []).length;
    document.getElementById('w3').textContent = t.replace(/[^\x00-\x7F]/g, ' ').split(/\s+/).filter(w => w).length;
    document.getElementById('w4').textContent = t.split('\n').length;
    document.getElementById('w5').textContent = t.split('\n\n').filter(p => p.trim()).length;
    document.getElementById('w6').textContent = (t.match(/\s/g) || []).length;
}
