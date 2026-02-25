const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const copyNotification = document.getElementById('copy-notification');
const indentSelect = document.getElementById('indent-select');
const errorMessage = document.getElementById('error-message');
const outputContainer = document.getElementById('output-container');

function formatJSON() {
    const raw = inputText.value;
    if (!raw.trim()) {
        outputText.value = '';
        hideError();
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        let indent = indentSelect.value;
        if (indent === '2') indent = 2;
        else if (indent === '4') indent = 4;
        else if (indent === 'tab') indent = '\t';

        outputText.value = JSON.stringify(parsed, null, indent);
        hideError();
    } catch (e) {
        showError('無効なJSONです: ' + e.message);
    }
}

function showError(msg) {
    document.getElementById('error-text').textContent = msg;
    errorMessage.classList.remove('opacity-0', '-translate-y-2');
    outputContainer.classList.add('border-rose-300', 'dark:border-rose-800');
}

function hideError() {
    errorMessage.classList.add('opacity-0', '-translate-y-2');
    outputContainer.classList.remove('border-rose-300', 'dark:border-rose-800');
}

// Add debounce to not freeze on large text pastes
let timeoutId;
inputText.addEventListener('input', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(formatJSON, 100);
});

indentSelect.addEventListener('change', formatJSON);

clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    hideError();
    inputText.focus();
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputText.value).then(() => {
        copyNotification.classList.remove('opacity-0');
        setTimeout(() => {
            copyNotification.classList.add('opacity-0');
        }, 2000);
    });
});
