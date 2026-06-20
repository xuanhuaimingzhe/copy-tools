regTool('word-to-md', '📝 Word → Markdown', initWordToMd);

function initWordToMd(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">上传 .docx 文件，转换为 Markdown 格式。保留标题、列表、链接、图片、表格等结构。</p>
        <div style="border:2px dashed var(--border);border-radius:12px;padding:30px;text-align:center;margin-bottom:16px" id="wmdDrop">
            <div style="font-size:40px;margin-bottom:8px">📝</div>
            <p style="font-weight:600">拖拽 .docx 文件到此处，或点击选择</p>
            <p style="font-size:13px;color:var(--text-light)">仅支持 .docx 格式（Word 2007+）</p>
            <input type="file" id="wmdFile" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display:none">
        </div>
        <div id="wmdProgress" style="display:none;margin-bottom:16px">
            <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden">
                <div id="wmdBar" style="height:100%;background:var(--primary);width:0%;transition:width .3s"></div>
            </div>
            <p style="font-size:13px;color:var(--text-light);margin-top:4px" id="wmdStatus"></p>
        </div>
        <div id="wmdResult" style="display:none">
            <div class="tool-actions">
                <button class="btn btn-outline" onclick="copyText('wmdOutput')">📋 复制 Markdown</button>
                <button class="btn btn-outline" onclick="wmdDownload()">💾 下载 .md</button>
                <button class="btn btn-outline" onclick="wmdReset()">🔄 重新上传</button>
            </div>
            <textarea id="wmdOutput" readonly style="min-height:400px;font-size:14px;line-height:1.8;font-family:'SF Mono','Fira Code',Consolas,monospace">转换结果将显示在这里...</textarea>
        </div>`;

    const drop = document.getElementById('wmdDrop');
    const fi = document.getElementById('wmdFile');
    drop.addEventListener('click', () => fi.click());
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = 'var(--primary)'; });
    drop.addEventListener('dragleave', () => { drop.style.borderColor = 'var(--border)'; });
    drop.addEventListener('drop', e => { e.preventDefault(); drop.style.borderColor = 'var(--border)'; const f = e.dataTransfer.files[0]; if (f) wmdConvert(f); });
    fi.addEventListener('change', () => { const f = fi.files[0]; if (f) wmdConvert(f); });
}

async function wmdConvert(file) {
    document.getElementById('wmdDrop').style.display = 'none';
    document.getElementById('wmdProgress').style.display = 'block';
    const bar = document.getElementById('wmdBar');
    const status = document.getElementById('wmdStatus');

    try {
        status.textContent = '正在读取文件...';
        bar.style.width = '20%';

        const arr = await file.arrayBuffer();
        bar.style.width = '50%';
        status.textContent = '正在转换为 Markdown...';

        const result = await mammoth.convertToMarkdown({ arrayBuffer: arr });
        bar.style.width = '100%';
        status.textContent = '✅ 转换完成';

        if (result.messages.length > 0) {
            console.warn('Mammoth warnings:', result.messages);
        }

        document.getElementById('wmdProgress').style.display = 'none';
        document.getElementById('wmdResult').style.display = 'block';
        document.getElementById('wmdOutput').value = result.value;
        window._wmdText = result.value;
        window._wmdName = file.name.replace(/\.docx$/i, '');
    } catch (err) {
        status.textContent = '❌ 转换失败：' + err.message;
        bar.style.width = '0%';
    }
}

function wmdDownload() {
    if (!window._wmdText) return;
    const blob = new Blob([window._wmdText], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (window._wmdName || 'document') + '.md';
    a.click();
}

function wmdReset() {
    document.getElementById('wmdDrop').style.display = 'block';
    document.getElementById('wmdProgress').style.display = 'none';
    document.getElementById('wmdResult').style.display = 'none';
    document.getElementById('wmdBar').style.width = '0%';
}
