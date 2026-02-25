// `index.html` の `<script>` タグで読み込まれた Prettier のグローバル変数（`prettier`, `prettierPlugins`）を利用します。

document.addEventListener('DOMContentLoaded', () => {

    const languageSelect = document.getElementById('languageSelect');
    const indentSelect = document.getElementById('indent-select');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');

    const editorConfig = {
        lineNumbers: true,
        lineWrapping: false, // 横スクロールを維持
        viewportMargin: Infinity,
        tabSize: 4,
        indentWithTabs: true
    };

    const inputEditor = CodeMirror(document.getElementById('input-editor-container'), {
        ...editorConfig,
        mode: 'htmlmixed'
    });

    const outputEditor = CodeMirror(document.getElementById('output-editor-container'), {
        ...editorConfig,
        mode: 'htmlmixed',
        readOnly: true
    });

    // Dark mode styling for CodeMirror
    const applyCodeMirrorTheme = () => {
        const wrappers = document.querySelectorAll('.CodeMirror');
        wrappers.forEach(wrapper => {
            wrapper.style.backgroundColor = 'transparent';
            wrapper.style.color = '#e2e8f0';
            wrapper.style.height = '100%';
            wrapper.style.minHeight = '400px';
            wrapper.style.fontFamily = "'JetBrains Mono', monospace";
            wrapper.style.fontSize = "13px";
        });

        const gutters = document.querySelectorAll('.CodeMirror-gutters');
        gutters.forEach(gutter => {
            gutter.style.backgroundColor = 'transparent';
            gutter.style.borderRight = '1px solid #334155';
        });
    };

    applyCodeMirrorTheme();

    let formatTimeoutId;

    // 言語が変わったときのエディタハイライト変更＋自動整形実行
    languageSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        let cmMode = 'htmlmixed';
        if (lang === 'css') cmMode = 'css';
        if (lang === 'javascript') cmMode = 'javascript';
        if (lang === 'php') cmMode = 'application/x-httpd-php';

        inputEditor.setOption('mode', cmMode);
        outputEditor.setOption('mode', cmMode);

        formatCode(); // 言語変更時にも即時反映
    });

    // インデント設定が変わったときも自動整形を実行
    indentSelect.addEventListener('change', formatCode);

    clearBtn.addEventListener('click', () => {
        inputEditor.setValue('');
        outputEditor.setValue('');
        inputEditor.focus();
        hideError();
    });

    // 入力変更時に自動フォーマット (Debounce付き)
    inputEditor.on('change', () => {
        clearTimeout(formatTimeoutId);
        formatTimeoutId = setTimeout(formatCode, 300);
    });

    async function formatCode() {
        const code = inputEditor.getValue();
        if (!code.trim()) {
            outputEditor.setValue('');
            hideError();
            return;
        }

        hideError();

        const lang = languageSelect.value;
        const indentStyle = indentSelect.value;

        // Prettierのベースオプション
        let options = {
            printWidth: 10000, // 無限（折り返さない）ための大きな値
            singleQuote: true, // PHP等でシングルクオートを強制
        };

        // 言語別パーサーとプラグイン設定
        if (lang === 'html') {
            options.parser = 'html';
            options.plugins = prettierPlugins;
        } else if (lang === 'css') {
            options.parser = 'css';
            options.plugins = prettierPlugins;
        } else if (lang === 'javascript') {
            options.parser = 'babel';
            options.plugins = prettierPlugins;
        } else if (lang === 'php') {
            options.parser = 'php';
            options.plugins = prettierPlugins;
        }

        // インデント設定
        if (indentStyle === '2spaces') {
            options.tabWidth = 2;
            options.useTabs = false;
        } else if (indentStyle === '4spaces') {
            options.tabWidth = 4;
            options.useTabs = false;
        } else if (indentStyle === 'tab') {
            options.tabWidth = 4; // Prettier internal tab
            options.useTabs = true;
        }

        try {
            let formattedCode = code;

            // Prettier が無名関数を1行にまとめるのを防ぐための前処理
            // 文字列リテラル内のマッチを除外しながら、カンマの後の function または fn の前に改行とコメントを挿入
            const regex = /(['"`])(?:(?!\1)[^\\]|\\.)*\1|,\s*(function\s*\(|fn\s*\()/gi;
            formattedCode = formattedCode.replace(regex, (match, quote, funcText) => {
                if (quote) {
                    return match;
                }
                return ',\n// prettier-break\n' + funcText;
            });

            if (lang === 'php') {
                let hasPhpTag = /^\s*(<\?php|<\?=)/i.test(formattedCode);
                if (!hasPhpTag) {
                    formattedCode = "<?php\n" + formattedCode;
                }

                formattedCode = await prettier.format(formattedCode, options);
            } else {
                formattedCode = await prettier.format(formattedCode, options);
            }

            // 前処理で挿入したコメントを除去する後処理
            formattedCode = formattedCode.replace(/\n\s*\/\/\s*prettier-break\n/g, '\n');

            outputEditor.setValue(formattedCode);

        } catch (err) {
            console.error(err);
            showError('エラー: 構文が正しくないか、フォーマットに失敗しました。');
            outputEditor.setValue(err.message);
        }
    }

    copyBtn.addEventListener('click', () => {
        const formatted = outputEditor.getValue();

        navigator.clipboard.writeText(formatted).then(() => {
            const notification = document.getElementById('copy-notification');
            notification.classList.remove('opacity-0', 'scale-95');
            notification.classList.add('opacity-100', 'scale-100');

            setTimeout(() => {
                notification.classList.remove('opacity-100', 'scale-100');
                notification.classList.add('opacity-0', 'scale-95');
            }, 2000);
        });
    });

    function showError(msg) {
        const errorContainer = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');

        errorText.textContent = msg;
        errorContainer.classList.remove('hidden', 'opacity-0');
        errorContainer.classList.add('opacity-100');
    }

    function hideError() {
        const errorContainer = document.getElementById('error-message');
        errorContainer.classList.remove('opacity-100');
        errorContainer.classList.add('opacity-0');
        setTimeout(() => {
            if (errorContainer.classList.contains('opacity-0')) {
                errorContainer.classList.add('hidden');
            }
        }, 300);
    }
});
