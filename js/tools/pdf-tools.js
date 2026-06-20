regTool('pdf-merge-split', '🗂 合并/拆分PDF', initPdfMergeSplit);

let pdfFiles = [];

function initPdfMergeSplit(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">合并多个 PDF 为一个文件，或拆分 PDF 为单页文件。处理完全在本地浏览器进行。</p>
        <div style="display:flex;gap:12px;margin-bottom:16px">
            <button class="btn btn-primary" onclick="pmsTab('merge')" id="pmsTabMerge">📥 合并 PDF</button>
            <button class="btn btn-outline" onclick="pmsTab('split')" id="pmsTabSplit">📤 拆分 PDF</button>
        </div>
        <div id="pmsContent"></div>`;
    pmsTab('merge');
}

function pmsTab(tab) {
    document.getElementById('pmsTabMerge').className = tab === 'merge' ? 'btn btn-primary' : 'btn btn-outline';
    document.getElementById('pmsTabSplit').className = tab === 'split' ? 'btn btn-primary' : 'btn btn-outline';
    const c = document.getElementById('pmsContent');
    if (tab === 'merge') {
        pdfFiles = [];
        c.innerHTML = `
            <div style="border:2px dashed var(--border);border-radius:12px;padding:30px;text-align:center;margin-bottom:16px" id="pmsDrop">
                <div style="font-size:40px;margin-bottom:8px">📚</div>
                <p style="font-weight:600">拖拽 PDF 文件到此处，或点击选择</p>
                <p style="font-size:13px;color:var(--text-light)">可多选，按添加顺序合并</p>
                <input type="file" id="pmsFile" accept=".pdf,application/pdf" multiple style="display:none">
            </div>
            <div id="pmsList" style="display:none">
                <div class="tool-actions" style="justify-content:space-between">
                    <span style="font-size:14px;color:var(--text-light)">已添加 <b id="pmsCount">0</b> 个文件</span>
                    <button class="btn btn-outline" onclick="pmsClear()">🗑 清空</button>
                </div>
                <div style="max-height:300px;overflow-y:auto;margin:12px 0" id="pmsFileList"></div>
                <button class="btn btn-primary" onclick="pmsMerge()">📄 合并为 PDF</button>
                <div id="pmsResult" style="margin-top:12px"></div>
            </div>`;
        const drop = document.getElementById('pmsDrop');
        const fi = document.getElementById('pmsFile');
        drop.addEventListener('click', () => fi.click());
        drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = 'var(--primary)'; });
        drop.addEventListener('dragleave', () => { drop.style.borderColor = 'var(--border)'; });
        drop.addEventListener('drop', e => { e.preventDefault(); drop.style.borderColor = 'var(--border)'; pmsAddFiles(Array.from(e.dataTransfer.files)); });
        fi.addEventListener('change', () => { pmsAddFiles(Array.from(fi.files)); fi.value = ''; });
    } else {
        c.innerHTML = `
            <div style="border:2px dashed var(--border);border-radius:12px;padding:30px;text-align:center;margin-bottom:16px" id="pmsSplitDrop">
                <div style="font-size:40px;margin-bottom:8px">✂️</div>
                <p style="font-weight:600">拖拽一个 PDF 文件到此处，或点击选择</p>
                <p style="font-size:13px;color:var(--text-light)">将拆分为多个单页 PDF 文件</p>
                <input type="file" id="pmsSplitFile" accept=".pdf,application/pdf" style="display:none">
            </div>
            <div id="pmsSplitInfo" style="display:none"></div>
            <div id="pmsSplitResult" style="margin-top:12px"></div>`;
        const drop = document.getElementById('pmsSplitDrop');
        const fi = document.getElementById('pmsSplitFile');
        drop.addEventListener('click', () => fi.click());
        drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = 'var(--primary)'; });
        drop.addEventListener('dragleave', () => { drop.style.borderColor = 'var(--border)'; });
        drop.addEventListener('drop', e => { e.preventDefault(); drop.style.borderColor = 'var(--border)'; const f = e.dataTransfer.files[0]; if (f && f.type === 'application/pdf') pmsSplit(f); });
        fi.addEventListener('change', () => { const f = fi.files[0]; if (f) pmsSplit(f); });
    }
}

function pmsAddFiles(files) {
    const pdfs = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (pdfs.length === 0) return;
    document.getElementById('pmsDrop').style.display = 'none';
    document.getElementById('pmsList').style.display = 'block';
    pdfs.forEach(f => {
        pdfFiles.push(f);
        const div = document.createElement('div');
        div.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg);border-radius:6px;margin-bottom:6px;font-size:14px';
        div.innerHTML = `<span>📄 ${f.name} <span style="color:var(--text-light);font-size:12px">(${(f.size/1024).toFixed(1)} KB)</span></span>
            <button class="btn btn-outline" onclick="pmsRemove(${pdfFiles.length - 1});this.parentElement.remove()" style="padding:4px 10px;font-size:12px">×</button>`;
        document.getElementById('pmsFileList').appendChild(div);
    });
    document.getElementById('pmsCount').textContent = pdfFiles.length;
}

function pmsRemove(idx) { pdfFiles.splice(idx, 1); document.getElementById('pmsCount').textContent = pdfFiles.length; if (pdfFiles.length === 0) pmsClear(); }

function pmsClear() {
    pdfFiles = [];
    document.getElementById('pmsFileList').innerHTML = '';
    document.getElementById('pmsCount').textContent = '0';
    document.getElementById('pmsDrop').style.display = 'block';
    document.getElementById('pmsList').style.display = 'none';
    document.getElementById('pmsResult').innerHTML = '';
}

async function pmsMerge() {
    if (pdfFiles.length < 2) return;
    const result = document.getElementById('pmsResult');
    result.innerHTML = '<p style="color:var(--text-light)">⏳ 正在合并 PDF...</p>';

    try {
        const { PDFDocument } = PDFLib;
        const merged = await PDFDocument.create();
        for (const file of pdfFiles) {
            const arr = await file.arrayBuffer();
            const doc = await PDFDocument.load(arr);
            const pages = await merged.copyPages(doc, doc.getPageIndices());
            pages.forEach(p => merged.addPage(p));
        }
        const bytes = await merged.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        window._pmsBlob = blob;
        result.innerHTML = `
            <div class="output-area" style="background:#dcfce7">
                <p style="margin-bottom:8px">✅ 合并完成，共 <b>${merged.getPageCount()}</b> 页</p>
                <button class="btn btn-success" onclick="pmsDownload()">💾 下载合并后的 PDF</button>
            </div>`;
    } catch (err) {
        result.innerHTML = `<div class="output-area" style="background:#fef2f2">❌ 合并失败：${err.message}</div>`;
    }
}

function pmsDownload() {
    if (!window._pmsBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(window._pmsBlob);
    a.download = 'merged.pdf';
    a.click();
}

async function pmsSplit(file) {
    document.getElementById('pmsSplitDrop').style.display = 'none';
    const info = document.getElementById('pmsSplitInfo');
    const result = document.getElementById('pmsSplitResult');
    info.style.display = 'block';
    info.innerHTML = `<p style="color:var(--text-light)">⏳ 正在分析 PDF...</p>`;

    try {
        const { PDFDocument } = PDFLib;
        const arr = await file.arrayBuffer();
        const doc = await PDFDocument.load(arr);
        const pageCount = doc.getPageCount();
        info.innerHTML = `<p style="font-size:16px;margin-bottom:8px">📄 <b>${file.name}</b></p>
            <p style="color:var(--text-light);margin-bottom:16px">共 <b>${pageCount}</b> 页，将拆分为 ${pageCount} 个单页 PDF</p>
            <div class="tool-actions">
                <label style="font-size:14px">提取页码范围（可选）：<input type="text" id="pmsRange" placeholder="如：1-3,5,7-10" style="width:200px;margin-left:8px;padding:6px;border:1px solid var(--border);border-radius:6px"></label>
            </div>
            <button class="btn btn-primary" onclick="pmsDoSplit()">✂️ 开始拆分</button>
            <div id="pmsSplitPages" style="margin-top:16px"></div>`;
        window._pmsSplitDoc = doc;
        window._pmsSplitPageCount = pageCount;
        window._pmsSplitFile = file;
    } catch (err) {
        info.innerHTML = `<p style="color:var(--danger)">❌ 读取失败：${err.message}</p>`;
    }
}

async function pmsDoSplit() {
    const doc = window._pmsSplitDoc;
    const result = document.getElementById('pmsSplitPages');
    result.innerHTML = '<p style="color:var(--text-light)">⏳ 正在拆分...</p>';

    const rangeStr = document.getElementById('pmsRange').value.trim();
    let pages = [];
    if (rangeStr) {
        const parts = rangeStr.split(',');
        parts.forEach(p => {
            p = p.trim();
            if (p.includes('-')) {
                const [s, e] = p.split('-').map(Number);
                for (let i = s; i <= e; i++) pages.push(i);
            } else {
                pages.push(Number(p));
            }
        });
        pages = pages.filter(n => n >= 1 && n <= window._pmsSplitPageCount);
    } else {
        pages = Array.from({ length: window._pmsSplitPageCount }, (_, i) => i + 1);
    }

    const baseName = window._pmsSplitFile.name.replace(/\.pdf$/i, '');
    let html = '<div style="max-height:400px;overflow-y:auto">';

    for (const pageNum of pages) {
        const newDoc = await PDFLib.PDFDocument.create();
        const [copied] = await newDoc.copyPages(doc, [pageNum - 1]);
        newDoc.addPage(copied);
        const bytes = await newDoc.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        html += `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:var(--bg);border-radius:6px;margin-bottom:4px;font-size:14px">
            <span>📄 第 ${pageNum} 页 <span style="color:var(--text-light);font-size:12px">(${(blob.size/1024).toFixed(1)} KB)</span></span>
            <a href="${url}" download="${baseName}_p${pageNum}.pdf" class="btn btn-primary" style="padding:4px 12px;font-size:12px;text-decoration:none">💾 下载</a></div>`;
    }
    html += '</div>';
    result.innerHTML = html;
}
