document.addEventListener('DOMContentLoaded', () => {
    const minViewportInput = document.getElementById('minViewport');
    const maxViewportInput = document.getElementById('maxViewport');
    const minFontSizeInput = document.getElementById('minFontSize');
    const maxFontSizeInput = document.getElementById('maxFontSize');
    const baseFontSizeInput = document.getElementById('baseFontSize');
    
    const outputElement = document.getElementById('output');
    const copyBtn = document.getElementById('copy-btn');
    const toast = document.getElementById('toast');

    function updateOutput() {
        const minVw = parseFloat(minViewportInput.value) || 0;
        const maxVw = parseFloat(maxViewportInput.value) || 0;
        const minFs = parseFloat(minFontSizeInput.value) || 0;
        const maxFs = parseFloat(maxFontSizeInput.value) || 0;
        const baseFs = parseFloat(baseFontSizeInput.value) || 16;

        if (baseFs === 0) {
            outputElement.textContent = '/* 基準文字サイズは0より大きい値を指定してください */';
            return;
        }

        if (minVw === maxVw) {
            outputElement.textContent = '/* 最小ビューポートと最大ビューポートは異なる値を指定してください */';
            return;
        }

        const formatNumber = (val) => Number(val.toFixed(4));
        
        const minFsRem = formatNumber(minFs / baseFs);
        const maxFsRem = formatNumber(maxFs / baseFs);

        const slope = (maxFs - minFs) / (maxVw - minVw);
        const slopeVw = formatNumber(slope * 100);
        
        const yIntercept = minFs - (slope * minVw);
        const yInterceptRem = formatNumber(yIntercept / baseFs);

        let preferredValue = '';
        if (yInterceptRem === 0) {
            preferredValue = `${slopeVw}vw`;
        } else if (yInterceptRem > 0) {
            preferredValue = `${yInterceptRem}rem + ${slopeVw}vw`;
        } else {
            // yInterceptRem is negative, formatting nicely like `5vw - 1.5rem` or `-1.5rem + 5vw`
            preferredValue = `${yInterceptRem}rem + ${slopeVw}vw`;
        }

        const result = `font-size: clamp(${minFsRem}rem, ${preferredValue}, ${maxFsRem}rem);`;
        outputElement.textContent = result;
    }

    // Attach event listeners
    [minViewportInput, maxViewportInput, minFontSizeInput, maxFontSizeInput, baseFontSizeInput].forEach(input => {
        input.addEventListener('input', updateOutput);
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        const textToCopy = outputElement.textContent;
        if (!textToCopy || textToCopy.startsWith('/*')) return;
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            showToast();
        } catch (err) {
            console.error('Failed to copy text: ', err);
            
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast();
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textArea);
        }
    });

    let toastTimeout;
    function showToast() {
        toast.classList.remove('opacity-0');
        toast.classList.add('opacity-100');
        
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0');
        }, 2000);
    }

    // Initial calculation
    updateOutput();
});
