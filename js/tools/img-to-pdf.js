regTool('img-to-pdf', '📄 图片转PDF', initImgToPdf);

let itpImages = [];

function initImgToPdf(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">上传多张图片，合并导出为单个 PDF 文件。图片按上传顺序排列，可拖拽调整顺序。</p>
        <div style="border:2px dashed var(--border);border-radius:12px;padding:30px;text-align:center;margin-bottom:16px" id="itpDrop">
            <div style="font-size:40px;margin-bottom:8px">🖼</div>
            <p style="font-weight:600">拖拽图片到此处，或点击选择</p>
            <p style="font-size:13px;color:var(--text-light)">支持 JPG、PNG、WebP，可多选</p>
            <input type="file" id="itpFile" accept="image/*" multiple style="display:none">
        </div>
        <div id="itpPreview" style="display:none">
            <div class="tool-actions" style="justify-content:space-between;align-items:center">
                <span style="font-size:14px;color:var(--text-light)">已添加 <b id="itpCount">0</b> 张图片</span>
                <div>
                    <button class="btn btn-outline" onclick="itpSortAZ()">🔤 按名称排序</button>
                    <button class="btn btn-outline" onclick="itpClear()">🗑 清空</button>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin:12px 0" id="itpGrid"></div>
            <div class="tool-actions">
                <label style="display:flex;align-items:center;gap:8px;font-size:14px">
                    页面尺寸：
                    <select id="itpSize" style="padding:8px;border:1px solid var(--border);border-radius:6px;font-size:14px">
                        <option value="a4">A4</option>
                        <option value="a4-fit" selected>自适应 A4</option>
                        <option value="original">原始尺寸</option>
                    </select>
                </label>
                <button class="btn btn-primary" onclick="itpGenerate()">📄 生成 PDF</button>
            </div>
            <div id="itpResult" style="margin-top:12px"></div>
        </div>`;

    const drop = document.getElementById('itpDrop');
    const fileInput = document.getElementById('itpFile');
    drop.addEventListener('click', () => fileInput.click());
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = 'var(--primary)'; });
    drop.addEventListener('dragleave', () => { drop.style.borderColor = 'var(--border)'; });
    drop.addEventListener('drop', e => {
        e.preventDefault();
        drop.style.borderColor = 'var(--border)';
        addImages(Array.from(e.dataTransfer.files));
    });
    fileInput.addEventListener('change', () => {
        addImages(Array.from(fileInput.files));
        fileInput.value = '';
    });
}

function addImages(files) {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    document.getElementById('itpDrop').style.display = 'none';
    document.getElementById('itpPreview').style.display = 'block';
    const grid = document.getElementById('itpGrid');
    imageFiles.forEach((file, i) => {
        const idx = itpImages.length;
        itpImages.push(file);
        const reader = new FileReader();
        reader.onload = e => {
            const div = document.createElement('div');
            div.style.cssText = 'position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--border);aspect-ratio:1;background:#f1f5f9';
            div.innerHTML = `
                <img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">
                <button onclick="itpRemove(${idx})" style="position:absolute;top:4px;right:4px;background:var(--danger);color:#fff;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-size:12px;line-height:1">×</button>
                <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.6);color:#fff;font-size:11px;padding:4px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${file.name}</div>`;
            grid.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
    document.getElementById('itpCount').textContent = itpImages.length;
}

function itpRemove(idx) {
    itpImages.splice(idx, 1);
    document.getElementById('itpCount').textContent = itpImages.length;
    if (itpImages.length === 0) {
        document.getElementById('itpDrop').style.display = 'block';
        document.getElementById('itpPreview').style.display = 'none';
    }
    refreshPreview();
}

function itpClear() {
    itpImages = [];
    document.getElementById('itpGrid').innerHTML = '';
    document.getElementById('itpCount').textContent = '0';
    document.getElementById('itpDrop').style.display = 'block';
    document.getElementById('itpPreview').style.display = 'none';
    document.getElementById('itpResult').innerHTML = '';
}

function itpSortAZ() {
    itpImages.sort((a, b) => a.name.localeCompare(b.name));
    refreshPreview();
}

function refreshPreview() {
    const grid = document.getElementById('itpGrid');
    grid.innerHTML = '';
    itpImages.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = e => {
            const div = document.createElement('div');
            div.style.cssText = 'position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--border);aspect-ratio:1;background:#f1f5f9';
            div.innerHTML = `
                <img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">
                <button onclick="itpRemove(${i})" style="position:absolute;top:4px;right:4px;background:var(--danger);color:#fff;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-size:12px;line-height:1">×</button>
                <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.6);color:#fff;font-size:11px;padding:4px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${file.name}</div>`;
            grid.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

async function itpGenerate() {
    if (itpImages.length === 0) return;
    const size = document.getElementById('itpSize').value;
    const result = document.getElementById('itpResult');
    result.innerHTML = '<p style="color:var(--text-light)">⏳ 正在生成 PDF...</p>';

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    for (let i = 0; i < itpImages.length; i++) {
        if (i > 0) doc.addPage();
        const dataUrl = await readFileAsDataURL(itpImages[i]);
        const img = await loadImage(dataUrl);
        const w = img.width, h = img.height;
        const pw = doc.internal.pageSize.getWidth();
        const ph = doc.internal.pageSize.getHeight();

        if (size === 'original') {
            const scale = Math.min(pw / w, ph / h);
            const iw = w * scale * 0.9, ih = h * scale * 0.9;
            doc.addImage(dataUrl, 'JPEG', (pw - iw) / 2, (ph - ih) / 2, iw, ih);
        } else {
            const ratio = h / w;
            let iw = pw - 20, ih = iw * ratio;
            if (ih > ph - 20) { ih = ph - 20; iw = ih / ratio; }
            doc.addImage(dataUrl, 'JPEG', (pw - iw) / 2, (ph - ih) / 2, iw, ih);
        }
    }

    const pdfBlob = doc.output('blob');
    result.innerHTML = `
        <div class="output-area" style="background:#dcfce7">
            <p style="margin-bottom:8px">✅ PDF 已生成，共 <b>${itpImages.length}</b> 页</p>
            <button class="btn btn-success" onclick="itpDownload()">💾 下载 PDF</button>
        </div>`;
    window._itpBlob = pdfBlob;
}

function itpDownload() {
    if (!window._itpBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(window._itpBlob);
    a.download = 'images.pdf';
    a.click();
}

function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.readAsDataURL(file);
    });
}

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
    });
}
