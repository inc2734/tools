const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const copyNotification = document.getElementById('copy-notification');

function convertUnicode(str) {
    if (!str) return '';
    try {
        // Replace \uXXXX sequences with proper characters using regex
        return str.replace(/\\u[\dA-F]{4}/gi, (match) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    } catch (e) {
        return '変換エラー: ' + e.message;
    }
}

inputText.addEventListener('input', () => {
    outputText.value = convertUnicode(inputText.value);
});

clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    inputText.focus();
});

copyBtn.addEventListener('click', () => {
    if (!outputText.value) return;
    navigator.clipboard.writeText(outputText.value).then(() => {
        copyNotification.classList.remove('opacity-0');
        setTimeout(() => {
            copyNotification.classList.add('opacity-0');
        }, 2000);
    });
});
