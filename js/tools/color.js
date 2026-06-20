regTool('color', '🎨 颜色转换', initColor);

function initColor(c) {
    c.innerHTML = `
        <div class="tool-actions" style="align-items:center">
            <input type="color" id="cpPicker" value="#2563eb" style="width:48px;height:48px;border:none;cursor:pointer;padding:0">
            <input type="text" id="cpIn" placeholder="输入颜色值：HEX / RGB / HSL..." value="#2563eb" style="flex:1;min-width:200px">
            <button class="btn btn-outline" onclick="cpClear()">清空</button>
        </div>
        <div class="stats" id="cpResult">
            <div class="stat-item"><div class="stat-label">HEX</div><div class="stat-value" style="font-size:16px;word-break:break-all" id="cpHex">#2563eb</div></div>
            <div class="stat-item"><div class="stat-label">RGB</div><div class="stat-value" style="font-size:16px" id="cpRgb">37, 99, 235</div></div>
            <div class="stat-item"><div class="stat-label">HSL</div><div class="stat-value" style="font-size:16px" id="cpHsl">221°, 83%, 53%</div></div>
        </div>
        <div style="margin-top:16px;border-radius:8px;height:60px" id="cpPreview"></div>`;
    document.getElementById('cpPicker').addEventListener('input', onPicker);
    document.getElementById('cpIn').addEventListener('input', onInput);
    updateColor('#2563eb');
}

function onPicker() { updateColor(document.getElementById('cpPicker').value); }
function onInput() { updateColor(document.getElementById('cpIn').value.trim()); }
function cpClear() { document.getElementById('cpIn').value = ''; }

function updateColor(v) {
    try {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = v;
        const hex = ctx.fillStyle;
        if (!hex || hex === '#000000') throw new Error();
        const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
        const rn=r/255, gn=g/255, bn=b/255;
        const max=Math.max(rn,gn,bn), min=Math.min(rn,gn,bn);
        let h=0, s=0, l=(max+min)/2;
        if (max!==min) { const d=max-min; s=l>.5?d/(2-max-min):d/(max+min); if(max===rn) h=((gn-bn)/d+(gn<bn?6:0))%6; else if(max===gn) h=(bn-rn)/d+2; else h=(rn-gn)/d+4; h=Math.round(h*60); }
        s=Math.round(s*100); l=Math.round(l*100);
        document.getElementById('cpHex').textContent = hex;
        document.getElementById('cpRgb').textContent = `${r}, ${g}, ${b}`;
        document.getElementById('cpHsl').textContent = `${h}°, ${s}%, ${l}%`;
        document.getElementById('cpPicker').value = hex;
        document.getElementById('cpPreview').style.background = hex;
    } catch(e) {}
}
