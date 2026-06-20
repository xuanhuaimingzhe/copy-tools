const ZM = {};
const ZR = {};
(function() {
    const s = '简体字中文国门开关长飞马鱼爱见贝车东华会机计记间经来乐里礼连联两灵龙爱录虑麦们难鸟宁农气钱权确让热认声实书术树帅说诉岁孙态谈体铁听头图团万为卫问无务写谢压阳样药页义艺阴应营拥优邮运战证只种众装壮状准总组钻';
    const t = '簡體字中國門開關長飛馬魚愛見貝車東華會機計記間經來樂裡禮連聯兩靈龍愛錄慮麥們難鳥寧農氣錢權確讓熱認聲實書術樹帥說訴歲孫態談體鐵聽頭圖團萬為衛問無務寫謝壓陽樣藥頁義藝陰應營擁優郵運戰證隻種眾裝壯狀準總組鑽';
    for (let i = 0; i < s.length; i++) { ZM[s[i]] = t[i]; ZR[t[i]] = s[i]; }
})();

regTool('zh-convert', '🔄 简繁转换', initZhConvert);

function initZhConvert(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">中文简体与繁体字一键互转。</p>
        <textarea id="zi" placeholder="输入要转换的文字..." style="min-height:200px"></textarea>
        <div class="tool-actions">
            <button class="btn btn-primary" onclick="toTrad()">简体 → 繁体</button>
            <button class="btn btn-success" onclick="toSimp()">繁体 → 简体</button>
            <button class="btn btn-outline" onclick="document.getElementById('zi').value=''">清空</button>
            <button class="btn btn-outline" onclick="copyText('zo')">📋 复制结果</button>
        </div>
        <div class="output-area" id="zo">结果将显示在这里...</div>`;
}

function toTrad() {
    const t = document.getElementById('zi').value;
    document.getElementById('zo').textContent = t.split('').map(c => ZM[c] || c).join('');
}

function toSimp() {
    const t = document.getElementById('zi').value;
    document.getElementById('zo').textContent = t.split('').map(c => ZR[c] || c).join('');
}
