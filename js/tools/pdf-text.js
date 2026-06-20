regTool('pdf-text', '📝 PDF提取文字', initPdfText);

function initPdfText(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">上传 PDF 文件，提取其中的文字内容。处理完全在本地浏览器进行。</p>
        <div style="border:2px dashed var(--border);border-radius:12px;padding:30px;text-align:center;margin-bottom:16px" id="ptDrop">
            <div style="font-size:40px;margin-bottom:8px">📄</div>
            <p style="font-weight:600">拖拽 PDF 文件到此处，或点击选择</p>
            <p style="font-size:13px;color:var(--text-light)">纯文本 PDF、扫描件 OCR 不支持</p>
            <input type="file" id="ptFile" accept=".pdf,application/pdf" style="display:none">
        </div>
        <div id="ptProgress" style="display:none;margin-bottom:16px">
            <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden">
                <div id="ptBar" style="height:100%;background:var(--primary);width:0%;transition:width .3s"></div>
            </div>
            <p style="font-size:13px;color:var(--text-light);margin-top:4px" id="ptStatus"></p>
        </div>
        <div id="ptResult" style="display:none">
            <div class="tool-actions">
                <button class="btn btn-outline" onclick="copyText('ptOutput')">📋 复制全文</button>
                <button class="btn btn-outline" onclick="ptDownload()">💾 下载 TXT</button>
                <button class="btn btn-outline" onclick="ptReset()">🔄 重新上传</button>
            </div>
            <textarea id="ptOutput" readonly style="min-height:400px;font-size:14px;line-height:1.8">提取的文字将显示在这里...</textarea>
        </div>`;

    const drop = document.getElementById('ptDrop');
    const fi = document.getElementById('ptFile');
    drop.addEventListener('click', () => fi.click());
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = 'var(--primary)'; });
    drop.addEventListener('dragleave', () => { drop.style.borderColor = 'var(--border)'; });
    drop.addEventListener('drop', e => { e.preventDefault(); drop.style.borderColor = 'var(--border)'; const f = e.dataTransfer.files[0]; if (f) ptExtract(f); });
    fi.addEventListener('change', () => { const f = fi.files[0]; if (f) ptExtract(f); });
}

async function ptExtract(file) {
    document.getElementById('ptDrop').style.display = 'none';
    document.getElementById('ptProgress').style.display = 'block';
    const bar = document.getElementById('ptBar');
    const status = document.getElementById('ptStatus');

    try {
        status.textContent = '正在加载 PDF...';
        bar.style.width = '10%';

        const arr = await file.arrayBuffer();
        bar.style.width = '30%';
        status.textContent = '正在解析...';

        const pdf = await pdfjsLib.getDocument({ data: arr }).promise;
        const totalPages = pdf.numPages;
        let fullText = '';

        for (let i = 1; i <= totalPages; i++) {
            status.textContent = `正在提取第 ${i}/${totalPages} 页...`;
            bar.style.width = `${30 + (i / totalPages) * 60}%`;
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const text = content.items.map(item => item.str).join(' ');
            fullText += `\n--- 第 ${i} 页 ---\n${text}\n`;
        }

        bar.style.width = '100%';
        status.textContent = `✅ 提取完成，共 ${totalPages} 页`;

        document.getElementById('ptProgress').style.display = 'none';
        document.getElementById('ptResult').style.display = 'block';
        document.getElementById('ptOutput').value = fullText.trim();
        window._ptText = fullText.trim();
    } catch (err) {
        status.textContent = '❌ 提取失败：' + err.message;
        bar.style.width = '0%';
    }
}

function ptDownload() {
    if (!window._ptText) return;
    const blob = new Blob([window._ptText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'extracted.txt';
    a.click();
}

function ptReset() {
    document.getElementById('ptDrop').style.display = 'block';
    document.getElementById('ptProgress').style.display = 'none';
    document.getElementById('ptResult').style.display = 'none';
    document.getElementById('ptBar').style.width = '0%';
}
