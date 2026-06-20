function simpleMarkdown(md) {
    let h = md
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
        .replace(/^---$/gm, '<hr>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    return '<p>' + h + '</p>';
}

regTool('markdown', '📝 Markdown 编辑器', initMarkdown);

function initMarkdown(c) {
    c.innerHTML = `
        <p style="color:var(--text-light);margin-bottom:16px">在线 Markdown 编辑器，支持实时预览。左侧编辑，右侧预览。</p>
        <div class="md-editor">
            <textarea id="mi" oninput="updMd()" placeholder="输入 Markdown 内容..."></textarea>
            <div class="md-preview" id="mp"></div>
        </div>`;
    document.getElementById('mi').value = '# Hello World\n\n这是 **Markdown** 编辑器。\n\n## 功能\n- 标题、粗体、斜体\n- 链接和图片\n- 代码高亮\n- 列表和引用';
    updMd();
}

function updMd() {
    document.getElementById('mp').innerHTML = simpleMarkdown(document.getElementById('mi').value);
}
