regTool('timestamp', '⏰ 时间戳转换', initTimestamp);

function initTimestamp(c) {
    c.innerHTML = `
        <div class="tool-actions">
            <button class="btn btn-primary" onclick="tsNow()">📅 当前时间戳</button>
            <button class="btn btn-outline" onclick="document.getElementById('tsIn').value='';document.getElementById('tsOut').innerHTML=''">清空</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div>
                <label style="font-size:14px;color:var(--text-light)">时间戳（秒/毫秒）</label>
                <input type="text" id="tsIn" placeholder="请输入 Unix 时间戳..." style="margin-top:8px">
                <div class="tool-actions">
                    <button class="btn btn-primary" onclick="tsToDate()">→ 转换为日期</button>
                </div>
            </div>
            <div>
                <label style="font-size:14px;color:var(--text-light)">日期时间</label>
                <input type="text" id="dtIn" placeholder="如：2026-06-20 12:00:00" style="margin-top:8px">
                <div class="tool-actions">
                    <button class="btn btn-primary" onclick="dateToTs()">→ 转换为时间戳</button>
                </div>
            </div>
        </div>
        <div class="output-area" id="tsOut" style="margin-top:16px"></div>`;
}

function tsNow() {
    const now = Math.floor(Date.now() / 1000);
    document.getElementById('tsIn').value = now;
    document.getElementById('dtIn').value = new Date().toLocaleString('zh-CN');
    document.getElementById('tsOut').innerHTML = `当前时间戳：<b>${now}</b> 秒<br>当前时间戳（毫秒）：<b>${Date.now()}</b>`;
}

function tsToDate() {
    let v = document.getElementById('tsIn').value.trim();
    if (!v) return;
    let d;
    if (v.length >= 13) d = new Date(Number(v));
    else d = new Date(Number(v) * 1000);
    if (isNaN(d.getTime())) { document.getElementById('tsOut').innerHTML = '❌ 无效的时间戳'; return; }
    document.getElementById('tsOut').innerHTML = `📅 <b>${d.toLocaleString('zh-CN')}</b><br>UTC：${d.toISOString()}`;
}

function dateToTs() {
    const v = document.getElementById('dtIn').value.trim();
    if (!v) return;
    const d = new Date(v);
    if (isNaN(d.getTime())) { document.getElementById('tsOut').innerHTML = '❌ 无法识别的日期格式'; return; }
    document.getElementById('tsOut').innerHTML = `秒级时间戳：<b>${Math.floor(d.getTime()/1000)}</b><br>毫秒级时间戳：<b>${d.getTime()}</b>`;
}
