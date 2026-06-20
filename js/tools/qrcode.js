regTool('qrcode', '📱 二维码生成', initQRCode);

function initQRCode(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">输入文字或网址，一键生成二维码。可下载图片。</p>
        <div class="tool-actions">
            <input type="text" id="qrInput" placeholder="输入文字或网址..." style="flex:1;min-width:200px">
            <button class="btn btn-primary" onclick="genQR()">生成二维码</button>
        </div>
        <div style="text-align:center;margin:16px 0">
            <canvas id="qrCanvas" style="display:none"></canvas>
            <div id="qrPlaceholder" style="color:var(--text-light);padding:40px;border:2px dashed var(--border);border-radius:8px">👆 在上方输入内容后点击「生成二维码」</div>
        </div>`;
}

function genQR() {
    const text = document.getElementById('qrInput').value.trim();
    if (!text) return alert('请输入内容');
    const canvas = document.getElementById('qrCanvas');
    canvas.style.display = 'block';
    document.getElementById('qrPlaceholder').style.display = 'none';
    QRCode.toCanvas(canvas, text, { width: 256, margin: 2 }, err => {
        if (err) alert('生成失败：' + err);
    });
}
