regTool('video-to-audio', '🎵 视频转音频', initVideoToAudio);

let vtaMediaRecorder = null;
let vtaChunks = [];
let vtaAudioBlob = null;

function initVideoToAudio(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">上传视频文件，提取音频轨道并下载为 WAV 格式。处理完全在本地浏览器进行，文件不会上传到服务器。</p>
        <div style="border:2px dashed var(--border);border-radius:12px;padding:40px;text-align:center;margin-bottom:16px" id="vtaDrop">
            <div style="font-size:48px;margin-bottom:12px">🎬</div>
            <p style="font-weight:600;margin-bottom:4px">拖拽视频到此处，或点击选择</p>
            <p style="font-size:13px;color:var(--text-light)">支持 MP4、WebM、AVI、MOV 等格式</p>
            <input type="file" id="vtaFile" accept="video/*" style="display:none">
        </div>
        <video id="vtaVideo" style="max-width:100%;max-height:200px;border-radius:8px;display:none;margin-bottom:12px" controls></video>
        <div id="vtaInfo" style="display:none;margin-bottom:12px"></div>
        <div class="tool-actions" id="vtaActions" style="display:none">
            <button class="btn btn-primary" onclick="vtaExtract()">🎵 提取音频</button>
            <button class="btn btn-outline" onclick="vtaReset()">🔄 重新选择</button>
        </div>
        <div id="vtaProgress" style="display:none;margin-top:12px">
            <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden">
                <div id="vtaBar" style="height:100%;background:var(--primary);width:0%;transition:width .3s"></div>
            </div>
            <p style="font-size:13px;color:var(--text-light);margin-top:4px" id="vtaStatus"></p>
        </div>
        <div id="vtaResult" style="display:none;margin-top:12px"></div>`;

    const drop = document.getElementById('vtaDrop');
    const fileInput = document.getElementById('vtaFile');
    drop.addEventListener('click', () => fileInput.click());
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = 'var(--primary)'; });
    drop.addEventListener('dragleave', () => { drop.style.borderColor = 'var(--border)'; });
    drop.addEventListener('drop', e => {
        e.preventDefault();
        drop.style.borderColor = 'var(--border)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) loadVideo(file);
    });
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) loadVideo(file);
    });
}

function loadVideo(file) {
    document.getElementById('vtaDrop').style.display = 'none';
    const video = document.getElementById('vtaVideo');
    video.src = URL.createObjectURL(file);
    video.style.display = 'block';
    video.onloadedmetadata = () => {
        document.getElementById('vtaInfo').style.display = 'block';
        document.getElementById('vtaInfo').innerHTML = `
            <div class="stats"><div class="stat-item"><div class="stat-value">${file.name}</div><div class="stat-label">文件名</div></div>
            <div class="stat-item"><div class="stat-value">${(file.size/1024/1024).toFixed(1)} MB</div><div class="stat-label">大小</div></div>
            <div class="stat-item"><div class="stat-value">${formatDuration(video.duration)}</div><div class="stat-label">时长</div></div></div>`;
        document.getElementById('vtaActions').style.display = 'flex';
    };
}

async function vtaExtract() {
    const video = document.getElementById('vtaVideo');
    const bar = document.getElementById('vtaBar');
    const status = document.getElementById('vtaStatus');
    document.getElementById('vtaProgress').style.display = 'block';
    document.getElementById('vtaActions').style.display = 'none';
    vtaChunks = [];
    vtaAudioBlob = null;

    try {
        status.textContent = '正在创建音频上下文...';
        bar.style.width = '10%';
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        source.connect(audioCtx.destination);

        status.textContent = '正在录制音频...';
        bar.style.width = '30%';
        vtaMediaRecorder = new MediaRecorder(dest.stream, { mimeType: 'audio/webm;codecs=opus' });
        vtaMediaRecorder.ondataavailable = e => { if (e.data.size > 0) vtaChunks.push(e.data); };
        vtaMediaRecorder.onstop = async () => {
            status.textContent = '正在处理音频...';
            bar.style.width = '80%';
            const webmBlob = new Blob(vtaChunks, { type: 'audio/webm' });
            vtaAudioBlob = await convertWebmToWav(webmBlob, audioCtx);
            bar.style.width = '100%';
            status.textContent = '✅ 提取完成！';
            document.getElementById('vtaResult').style.display = 'block';
            document.getElementById('vtaResult').innerHTML = `
                <div class="output-area" style="background:#dcfce7">
                    <audio controls style="width:100%;margin-bottom:12px" src="${URL.createObjectURL(vtaAudioBlob)}"></audio>
                    <p style="margin-bottom:8px">文件大小：<b>${(vtaAudioBlob.size/1024).toFixed(1)} KB</b> · 格式：WAV</p>
                    <button class="btn btn-success" onclick="vtaDownload()">💾 下载 WAV 文件</button>
                </div>`;
        };

        video.currentTime = 0;
        await video.play();
        vtaMediaRecorder.start();
        bar.style.width = '50%';

        video.onended = () => {
            vtaMediaRecorder.stop();
        };

        // Safety timeout: stop if video is very long (> 5 min)
        const timeout = Math.min(video.duration * 1000, 300000);
        setTimeout(() => {
            if (vtaMediaRecorder.state === 'recording') {
                vtaMediaRecorder.stop();
                video.pause();
            }
        }, timeout + 2000);

    } catch (err) {
        status.textContent = '❌ 提取失败：' + err.message;
        bar.style.width = '0%';
        document.getElementById('vtaActions').style.display = 'flex';
    }
}

async function convertWebmToWav(webmBlob, audioCtx) {
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBufferToWav(audioBuffer);
}

function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataLength = buffer.length * blockAlign;
    const headerLength = 44;
    const totalLength = headerLength + dataLength;
    const wav = new ArrayBuffer(totalLength);
    const view = new DataView(wav);

    const writeString = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };
    writeString(0, 'RIFF');
    view.setUint32(4, totalLength - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    const samples = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
    }
    return new Blob([wav], { type: 'audio/wav' });
}

function vtaDownload() {
    if (!vtaAudioBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(vtaAudioBlob);
    a.download = 'audio.wav';
    a.click();
}

function vtaReset() {
    document.getElementById('vtaDrop').style.display = 'block';
    document.getElementById('vtaVideo').style.display = 'none';
    document.getElementById('vtaInfo').style.display = 'none';
    document.getElementById('vtaActions').style.display = 'none';
    document.getElementById('vtaProgress').style.display = 'none';
    document.getElementById('vtaResult').style.display = 'none';
    document.getElementById('vtaBar').style.width = '0%';
    vtaAudioBlob = null;
}

function formatDuration(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2,'0')}`;
}
