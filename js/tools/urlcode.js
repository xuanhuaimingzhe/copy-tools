regTool('urlcode', '🔗 URL 编解码', initUrlCode);

function initUrlCode(c) {
    c.innerHTML = `
        <div class="tool-actions">
            <button class="btn btn-primary" onclick="ue('encode')">编码 Encode</button>
            <button class="btn btn-primary" onclick="ue('decode')">解码 Decode</button>
            <button class="btn btn-outline" onclick="ue('encodeAll')">全部编码 (含特殊字符)</button>
            <button class="btn btn-outline" onclick="document.getElementById('ueIn').value='';document.getElementById('ueOut').innerHTML=''">清空</button>
            <button class="btn btn-outline" onclick="copyText('ueOut')">📋 复制结果</button>
        </div>
        <textarea id="ueIn" placeholder="输入要编解码的文字或URL..."></textarea>
        <div class="output-area" id="ueOut"></div>`;
}

function ue(mode) {
    const i = document.getElementById('ueIn').value;
    const o = document.getElementById('ueOut');
    try {
        if (mode === 'encode') o.textContent = encodeURIComponent(i);
        else if (mode === 'encodeAll') o.textContent = encodeURIComponent(i).replace(/%/g, '%25');
        else o.textContent = decodeURIComponent(i);
        o.style.background = '#dcfce7';
    } catch(e) {
        o.textContent = '❌ 解码失败：' + e.message;
        o.style.background = '#fef2f2';
    }
}
