regTool('regex', '🔍 正则表达式测试', initRegex);

function initRegex(c) {
    c.innerHTML = `
        <div class="tool-actions" style="align-items:center">
            <span style="font-size:15px;font-weight:600">/</span>
            <input type="text" id="rePat" placeholder="正则表达式（不含 /)" style="flex:1;min-width:150px">
            <span style="font-size:15px;font-weight:600">/</span>
            <input type="text" id="reFlags" placeholder="修饰符 igm" style="width:60px">
        </div>
        <textarea id="reText" placeholder="输入要匹配的文本..." style="min-height:150px"></textarea>
        <div class="tool-actions">
            <button class="btn btn-primary" onclick="reTest()">🔍 测试匹配</button>
            <button class="btn btn-outline" onclick="document.getElementById('rePat').value='';document.getElementById('reText').value='';document.getElementById('reOut').innerHTML=''">清空</button>
        </div>
        <div class="output-area" id="reOut"></div>`;
}

function reTest() {
    const pat = document.getElementById('rePat').value;
    const flags = document.getElementById('reFlags').value;
    const text = document.getElementById('reText').value;
    const out = document.getElementById('reOut');
    if (!pat) { out.innerHTML = '❌ 请输入正则表达式'; return; }
    try {
        const re = new RegExp(pat, flags);
        const matches = [...text.matchAll(re)];
        if (matches.length === 0) { out.innerHTML = '❌ 没有匹配'; out.style.background = '#fef2f2'; return; }
        let html = `✅ 匹配到 <b>${matches.length}</b> 处：<br><br>`;
        matches.forEach((m, i) => {
            html += `<b>#${i+1}</b>：<code>${escHtml(m[0])}</code> (位置 ${m.index})<br>`;
            if (m.length > 1) {
                m.slice(1).forEach((g, j) => html += `&nbsp;&nbsp;组${j+1}：<code>${escHtml(g)}</code><br>`);
            }
        });
        out.innerHTML = html;
        out.style.background = '#dcfce7';
    } catch(e) {
        out.innerHTML = '❌ 正则错误：' + e.message;
        out.style.background = '#fef2f2';
    }
}

function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
