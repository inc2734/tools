const editor = document.getElementById('editor');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const copyNotification = document.getElementById('copy-notification');

// Initialize Turndown service
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    hr: '---',
    bulletListMarker: '-',
});

editor.addEventListener('paste', (e) => {
    const html = e.clipboardData.getData('text/html');
    
    // If there is HTML content in the clipboard
    if (html) {
        e.preventDefault();
        
        try {
            // Convert HTML to Markdown
            let markdown = turndownService.turndown(html);
            
            // Clean up unnecessary spaces and newlines
            // 1. Remove excessive spaces after lists, headers, and blockquotes
            markdown = markdown.replace(/^([\s]*(?:#{1,6}|>|[-*+]|\d+\.))[ \t]+/gm, '$1 ');
            // 2. Remove trailing spaces from each line
            markdown = markdown.replace(/[ \t]+$/gm, '');
            // 3. Reduce multiple empty lines to a maximum of one empty line (two consecutive newlines)
            markdown = markdown.replace(/\n{3,}/g, '\n\n');
            // 4. Trim leading/trailing whitespace of the whole text
            markdown = markdown.trim();
            
            // Insert at cursor position
            const startPos = editor.selectionStart;
            const endPos = editor.selectionEnd;
            const textBefore = editor.value.substring(0, startPos);
            const textAfter = editor.value.substring(endPos, editor.value.length);
            
            editor.value = textBefore + markdown + textAfter;
            
            // Move cursor to end of inserted text
            editor.selectionStart = editor.selectionEnd = startPos + markdown.length;
        } catch (err) {
            console.error('Error converting HTML to Markdown:', err);
            // Fallback to plain text if conversion fails
            const plainText = e.clipboardData.getData('text/plain');
            if (plainText) {
                const startPos = editor.selectionStart;
                const endPos = editor.selectionEnd;
                const textBefore = editor.value.substring(0, startPos);
                const textAfter = editor.value.substring(endPos, editor.value.length);
                editor.value = textBefore + plainText + textAfter;
                editor.selectionStart = editor.selectionEnd = startPos + plainText.length;
            }
        }
    }
    // If no HTML, default plain text paste will happen automatically
});

clearBtn.addEventListener('click', () => {
    editor.value = '';
    editor.focus();
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(editor.value).then(() => {
        if (copyNotification) {
            copyNotification.classList.remove('opacity-0');
            setTimeout(() => {
                copyNotification.classList.add('opacity-0');
            }, 2000);
        }
    });
});
