document.addEventListener('DOMContentLoaded', () => {

    const indentSelect = document.getElementById('indent-select');
    const formatBtn = document.getElementById('format-btn');
    const clearBtn = document.getElementById('clear-btn');

    // Layout toggles
    const layoutHorizontalBtn = document.getElementById('layout-horizontal-btn');
    const layoutVerticalBtn = document.getElementById('layout-vertical-btn');
    const mainGrid = document.getElementById('main-grid');

    // Responsive size toggles
    const sizeDesktopBtn = document.getElementById('size-desktop-btn');
    const sizeTabletBtn = document.getElementById('size-tablet-btn');
    const sizeMobileBtn = document.getElementById('size-mobile-btn');
    const previewFrame = document.getElementById('preview-frame');

    const editorConfig = {
        lineNumbers: true,
        lineWrapping: true, // HTML入力は折り返しがあったほうが見やすい
        viewportMargin: Infinity,
        tabSize: 4,
        indentWithTabs: true,
        theme: '3024-night'
    };

    const inputEditor = CodeMirror(document.getElementById('input-editor-container'), {
        ...editorConfig,
        mode: 'htmlmixed'
    });

    // Dark mode styling for CodeMirror (custom font, height)
    const applyCodeMirrorTheme = () => {
        const wrappers = document.querySelectorAll('.CodeMirror');
        wrappers.forEach(wrapper => {
            wrapper.style.height = '100%';
            wrapper.style.minHeight = '200px';
            wrapper.style.fontFamily = "'JetBrains Mono', monospace";
            wrapper.style.fontSize = "13px";
        });

        const gutters = document.querySelectorAll('.CodeMirror-gutters');
        gutters.forEach(gutter => {
            gutter.style.borderRight = '1px solid #334155';
        });
    };

    applyCodeMirrorTheme();

    let previewTimeoutId;

    // 初期コード設定 (空でもよいが、サンプルがあるとわかりやすい)
    inputEditor.setValue(`<style>
body {
    font-family: sans-serif;
}
h1 {
    color: #4f46e5;
}
</style>

<script>
console.log("Preview loaded");
<\/script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@inc2734/unitone-css/dist/app.css" />
<script src="https://cdn.jsdelivr.net/npm/@inc2734/unitone-css/dist/app.js" defer></script>

<h1>Hello HTML Preview!</h1>
<p>ここにHTMLを入力してください。</p>`);

    // 入力変更時にプレビュー更新 (Debounce付き)
    inputEditor.on('change', () => {
        clearTimeout(previewTimeoutId);
        previewTimeoutId = setTimeout(updatePreview, 300);
    });

    function updatePreview() {
        const code = inputEditor.getValue();
        const defaultStyle = '<style>body { margin: 0; }</style>';
        let previewCode = code;

        if (previewCode.match(/<head[^>]*>/i)) {
            previewCode = previewCode.replace(/(<head[^>]*>)/i, '$1' + defaultStyle);
        } else {
            previewCode = defaultStyle + previewCode;
        }

        previewFrame.srcdoc = previewCode;
    }

    // 初回プレビュー反映
    updatePreview();

    // クリアボタン
    clearBtn.addEventListener('click', () => {
        inputEditor.setValue('');
        inputEditor.focus();
        hideError();
    });

    // フォーマットボタン
    formatBtn.addEventListener('click', async () => {
        const code = inputEditor.getValue();
        if (!code.trim()) return;

        hideError();
        const indentStyle = indentSelect.value;

        // Prettierのベースオプション
        let options = {
            parser: 'html',
            plugins: prettierPlugins,
            printWidth: 10000,
        };

        // インデント設定
        if (indentStyle === '2spaces') {
            options.tabWidth = 2;
            options.useTabs = false;
        } else if (indentStyle === '4spaces') {
            options.tabWidth = 4;
            options.useTabs = false;
        } else if (indentStyle === 'tab') {
            options.tabWidth = 4;
            options.useTabs = true;
        }

        try {
            let formattedCode = await prettier.format(code, options);

            // <style>と<script>の中のインデントを1つ減らす後処理
            const indentStr = indentStyle === 'tab' ? '\t' : (indentStyle === '2spaces' ? '  ' : '    ');
            const regex = /(<(script|style)[^>]*>)([\s\S]*?)(<\/\2>)/gi;
            formattedCode = formattedCode.replace(regex, (match, openTag, tagName, content, closeTag) => {
                const unindentedContent = content.split('\n').map(line => {
                    if (line.startsWith(indentStr)) {
                        return line.substring(indentStr.length);
                    }
                    return line;
                }).join('\n');
                return openTag + unindentedContent + closeTag;
            });

            inputEditor.setValue(formattedCode);
        } catch (err) {
            console.error(err);
            showError('エラー: 構文が正しくないか、フォーマットに失敗しました。');
        }
    });

    const inputLayer = document.getElementById('input-layer');
    const outputLayer = document.getElementById('output-layer');

    // レイアウト切り替え処理
    layoutHorizontalBtn.addEventListener('click', () => {
        mainGrid.className = 'flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 pb-2 lg:pb-6 min-h-0';
        if (inputLayer) {
            inputLayer.classList.add('h-full');
            inputLayer.classList.remove('h-[400px]', 'flex-shrink-0');
        }
        if (outputLayer) {
            outputLayer.classList.add('h-full');
            outputLayer.classList.remove('min-h-[1000px]', 'h-[1000px]', 'flex-shrink-0');
        }

        // Active styling
        layoutHorizontalBtn.classList.remove('text-gray-400', 'hover:text-gray-600', 'dark:hover:text-gray-300', 'bg-transparent');
        layoutHorizontalBtn.classList.add('bg-white', 'dark:bg-gray-700', 'shadow-sm', 'text-indigo-500');

        layoutVerticalBtn.classList.add('text-gray-400', 'hover:text-gray-600', 'dark:hover:text-gray-300');
        layoutVerticalBtn.classList.remove('bg-white', 'dark:bg-gray-700', 'shadow-sm', 'text-indigo-500');
    });

    layoutVerticalBtn.addEventListener('click', () => {
        mainGrid.className = 'flex-grow flex flex-col gap-4 lg:gap-6 pb-2 lg:pb-6 min-h-0 overflow-y-auto';
        if (inputLayer) {
            inputLayer.classList.remove('h-full');
            inputLayer.classList.add('h-[400px]', 'flex-shrink-0');
        }
        if (outputLayer) {
            outputLayer.classList.remove('h-full');
            outputLayer.classList.add('min-h-[1000px]', 'h-[1000px]', 'flex-shrink-0');
        }

        // Active styling
        layoutVerticalBtn.classList.remove('text-gray-400', 'hover:text-gray-600', 'dark:hover:text-gray-300', 'bg-transparent');
        layoutVerticalBtn.classList.add('bg-white', 'dark:bg-gray-700', 'shadow-sm', 'text-indigo-500');

        layoutHorizontalBtn.classList.add('text-gray-400', 'hover:text-gray-600', 'dark:hover:text-gray-300');
        layoutHorizontalBtn.classList.remove('bg-white', 'dark:bg-gray-700', 'shadow-sm', 'text-indigo-500');
    });

    // レスポンシブ切り替え処理
    const updateSizeStyles = (activeBtn) => {
        [sizeDesktopBtn, sizeTabletBtn, sizeMobileBtn].forEach(btn => {
            if (btn === activeBtn) {
                btn.classList.remove('text-gray-400', 'hover:text-gray-600', 'dark:hover:text-gray-300');
                btn.classList.add('bg-white', 'dark:bg-gray-600', 'shadow-sm', 'text-indigo-500');
            } else {
                btn.classList.add('text-gray-400', 'hover:text-gray-600', 'dark:hover:text-gray-300');
                btn.classList.remove('bg-white', 'dark:bg-gray-600', 'shadow-sm', 'text-indigo-500');
            }
        });
    };

    sizeDesktopBtn.addEventListener('click', () => {
        previewFrame.className = 'w-full h-full bg-white border-0 transition-all duration-300 ease-in-out shadow-sm';
        updateSizeStyles(sizeDesktopBtn);
    });

    sizeTabletBtn.addEventListener('click', () => {
        previewFrame.className = 'max-w-[768px] w-full h-full bg-white border-x border-gray-300 dark:border-gray-600 transition-all duration-300 ease-in-out shadow-lg';
        updateSizeStyles(sizeTabletBtn);
    });

    sizeMobileBtn.addEventListener('click', () => {
        previewFrame.className = 'max-w-[375px] w-full h-full bg-white border-x border-gray-300 dark:border-gray-600 transition-all duration-300 ease-in-out shadow-lg';
        updateSizeStyles(sizeMobileBtn);
    });


    function showError(msg) {
        const errorContainer = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');

        if (errorContainer && errorText) {
            errorText.textContent = msg;
            errorContainer.classList.remove('hidden', 'opacity-0');
            errorContainer.classList.add('opacity-100');
        }
    }

    function hideError() {
        const errorContainer = document.getElementById('error-message');
        if (errorContainer) {
            errorContainer.classList.remove('opacity-100');
            errorContainer.classList.add('opacity-0');
            setTimeout(() => {
                if (errorContainer.classList.contains('opacity-0')) {
                    errorContainer.classList.add('hidden');
                }
            }, 300);
        }
    }
});
