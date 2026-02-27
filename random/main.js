/**
 * ランダム文字列生成ロジック
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const lengthInput = document.getElementById('length-input');
    const lengthSlider = document.getElementById('length-slider');
    const charLowercase = document.getElementById('char-lowercase');
    const charUppercase = document.getElementById('char-uppercase');
    const charNumbers = document.getElementById('char-numbers');
    const charSymbols = document.getElementById('char-symbols');
    const outputText = document.getElementById('output-text');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const copyNotification = document.getElementById('copy-notification');

    // Character Sets
    const CHARS = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    /**
     * ランダムな文字列を生成する
     */
    function generateRandomString() {
        const length = parseInt(lengthInput.value, 10);

        // Validation check
        if (isNaN(length) || length < 1) {
            outputText.value = '';
            return;
        }

        let charset = '';
        if (charLowercase.checked) charset += CHARS.lowercase;
        if (charUppercase.checked) charset += CHARS.uppercase;
        if (charNumbers.checked) charset += CHARS.numbers;
        if (charSymbols.checked) charset += CHARS.symbols;

        // エラーハンドリング：すべてのチェックが外れている場合
        if (charset === '') {
            outputText.value = '※文字種別を1つ以上選択してください';
            outputText.classList.add('text-red-500', 'dark:text-red-400');
            outputText.classList.remove('text-gray-900', 'dark:text-gray-100');
            return;
        } else {
            outputText.classList.remove('text-red-500', 'dark:text-red-400');
            outputText.classList.add('text-gray-900', 'dark:text-gray-100');
        }

        let result = '';
        const charsetLength = charset.length;

        // Crypto APIを使用してより安全なランダム値を生成
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            // Uint32Arrayの最大値で割って0-1の範囲にし、それを文字セット長に掛ける
            result += charset[randomValues[i] % charsetLength];
        }

        outputText.value = result;
    }

    /**
     * コピー機能
     */
    async function copyToClipboard() {
        const text = outputText.value;
        if (!text || text === '※文字種別を1つ以上選択してください') return;

        try {
            await navigator.clipboard.writeText(text);

            // Show notification
            copyNotification.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
            copyNotification.classList.add('opacity-100', 'scale-100');

            // Highlight output background temporarily to show success
            outputText.parentElement.classList.add('bg-indigo-50', 'dark:bg-indigo-900/20');
            outputText.parentElement.classList.remove('bg-black/5', 'dark:bg-black/20');

            setTimeout(() => {
                copyNotification.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
                copyNotification.classList.remove('opacity-100', 'scale-100');

                outputText.parentElement.classList.remove('bg-indigo-50', 'dark:bg-indigo-900/20');
                outputText.parentElement.classList.add('bg-black/5', 'dark:bg-black/20');
            }, 2000);
        } catch (err) {
            console.error('コピーに失敗しました', err);
        }
    }

    // --- イベントリスナーの登録 ---

    // Slider と Input Number の同期
    lengthSlider.addEventListener('input', (e) => {
        lengthInput.value = e.target.value;
        generateRandomString();
    });

    lengthInput.addEventListener('input', (e) => {
        // Slider max value limit for visual mapping (slider 64, input up to 1024)
        if (parseInt(e.target.value) <= 64) {
            lengthSlider.value = e.target.value;
        } else {
            lengthSlider.value = 64; // Max out slider visual if input is larger
        }
        generateRandomString();
    });

    // チェックボックス変更時のイベント
    const checkboxes = [charLowercase, charUppercase, charNumbers, charSymbols];
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            // 少なくとも1つのチェックボックスが選択されるように強制する場合の処理はここで可能だが、
            // 今回はエラーメッセージを表示するようにしている
            generateRandomString();
        });
    });

    // 再生成ボタン
    regenerateBtn.addEventListener('click', generateRandomString);

    // コピーボタン
    copyBtn.addEventListener('click', copyToClipboard);

    // 初期化処理: 画面表示時に1度生成する（要件：表示した段階で条件に合致する文字列が表示されている状態）
    generateRandomString();
});
