class MathParser {
  constructor(input) {
    this.tokens = this.tokenize(input);
    this.index = 0;
  }

  tokenize(str) {
    const tokens = [];
    let i = 0;
    
    str = str.replaceAll('×', '*')
             .replaceAll('÷', '/')
             .replaceAll('−', '-')
             .replaceAll(' ', '');

    while (i < str.length) {
      const char = str[i];

      if (/\s/.test(char)) {
        i++;
        continue;
      }

      if ('+-*/%()'.includes(char)) {
        tokens.push({ type: 'OPERATOR', value: char });
        i++;
        continue;
      }

      if (/[0-9.]/.test(char)) {
        let numStr = '';
        let dotCount = 0;
        
        while (i < str.length && /[0-9.]/.test(str[i])) {
          if (str[i] === '.') {
            dotCount++;
            if (dotCount > 1) {
              throw new Error("Invalid decimal format");
            }
          }
          numStr += str[i];
          i++;
        }
        tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
        continue;
      }

      throw new Error(`Unexpected character: ${char}`);
    }
    return tokens;
  }

  peek() {
    return this.tokens[this.index] || null;
  }

  consume() {
    return this.tokens[this.index++];
  }

  parse() {
    if (this.tokens.length === 0) return 0;
    const result = this.expr();
    if (this.peek() !== null) {
      throw new Error("Syntax error");
    }
    return result;
  }

  expr() {
    let node = this.term();
    while (true) {
      const next = this.peek();
      if (next && next.type === 'OPERATOR' && (next.value === '+' || next.value === '-')) {
        const op = this.consume().value;
        const right = this.term();
        if (op === '+') node += right;
        else node -= right;
      } else {
        break;
      }
    }
    return node;
  }

  term() {
    let node = this.factor();
    while (true) {
      const next = this.peek();
      if (next && next.type === 'OPERATOR' && (next.value === '*' || next.value === '/' || next.value === '%')) {
        const op = this.consume().value;
        const right = this.factor();
        if (op === '*') {
          node *= right;
        } else if (op === '/') {
          if (right === 0) throw new Error("Cannot divide by zero");
          node /= right;
        } else {
          if (right === 0) throw new Error("Modulo by zero");
          node %= right;
        }
      } else if (next && next.type === 'OPERATOR' && next.value === '(') {
        const right = this.factor();
        node *= right;
      } else if (next && next.type === 'NUMBER') {
        const right = this.factor();
        node *= right;
      } else {
        break;
      }
    }
    return node;
  }

  factor() {
    const token = this.peek();
    if (!token) {
      throw new Error("Incomplete expression");
    }

    if (token.type === 'OPERATOR' && token.value === '-') {
      this.consume();
      return -this.factor();
    }
    if (token.type === 'OPERATOR' && token.value === '+') {
      this.consume();
      return this.factor();
    }

    if (token.type === 'OPERATOR' && token.value === '(') {
      this.consume();
      const val = this.expr();
      const next = this.consume();
      if (!next || next.value !== ')') {
        throw new Error("Unclosed parenthesis");
      }
      return val;
    }

    if (token.type === 'NUMBER') {
      return this.consume().value;
    }

    throw new Error("Invalid syntax");
  }
}

let expression = "";
let history = [];
let currentModalItem = null;

const exprTextEl = document.getElementById('expression-text');
const resultTextEl = document.getElementById('result-text');
const themeToggleBtn = document.getElementById('theme-toggle');
const historyToggleBtn = document.getElementById('history-toggle');
const historyPaneEl = document.getElementById('history-pane');
const historyListEl = document.getElementById('history-list');
const historyEmptyEl = document.getElementById('history-empty-state');
const clearHistoryBtn = document.getElementById('clear-history');
const scrollContainerEl = document.getElementById('history-scroll-container');

const modalEl = document.getElementById('history-modal');
const modalExprEl = document.getElementById('modal-preview-expr');
const modalResEl = document.getElementById('modal-preview-res');
const useExprBtn = document.getElementById('dialog-use-expr');
const useResBtn = document.getElementById('dialog-use-res');
const closeModalBtn = document.getElementById('dialog-close');

if (localStorage.getItem('calcu_history')) {
  try {
    history = JSON.parse(localStorage.getItem('calcu_history'));
  } catch (e) {
    history = [];
  }
}
const savedTheme = localStorage.getItem('calcu_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

function playTactileClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.012, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
  }
}

function updateDisplay() {
  exprTextEl.textContent = expression;
  
  const container = document.getElementById('expression-container');
  container.scrollLeft = container.scrollWidth;

  if (expression.trim() === "") {
    resultTextEl.textContent = "0";
    resultTextEl.style.opacity = "1";
    return;
  }

  const previewValue = getLivePreview(expression);
  if (previewValue !== null) {
    resultTextEl.textContent = formatResult(previewValue);
    resultTextEl.style.opacity = "0.6";
  } else {
    resultTextEl.style.opacity = "0.6";
  }
}

function getLivePreview(expr) {
  let cleaned = expr.trim();
  if (cleaned === "") return null;

  while (cleaned.endsWith(' ') || '÷×−+%-'.includes(cleaned[cleaned.length - 1])) {
    cleaned = cleaned.trim();
    if (cleaned.endsWith(' +') || cleaned.endsWith(' −') || cleaned.endsWith(' ×') || cleaned.endsWith(' ÷') || cleaned.endsWith(' %')) {
      cleaned = cleaned.slice(0, -2);
    } else if (cleaned.endsWith('(-')) {
      cleaned = cleaned.slice(0, -2);
    } else if ('+−×÷%-'.includes(cleaned[cleaned.length - 1])) {
      cleaned = cleaned.slice(0, -1);
    }
  }

  cleaned = cleaned.trim();
  if (cleaned === "") return null;

  const openCount = (cleaned.match(/\(/g) || []).length;
  const closeCount = (cleaned.match(/\)/g) || []).length;
  if (openCount > closeCount) {
    cleaned += ')'.repeat(openCount - closeCount);
  }

  try {
    const parser = new MathParser(cleaned);
    return parser.parse();
  } catch (e) {
    return null;
  }
}

function formatResult(num) {
  if (isNaN(num)) return "Error";
  if (!isFinite(num)) return "Infinite";
  
  if (Number.isInteger(num)) {
    return num.toLocaleString('en-US');
  }
  
  const numStr = num.toString();
  if (numStr.includes('.')) {
    const parts = numStr.split('.');
    if (parts[1].length > 10) {
      return parseFloat(num.toFixed(10)).toString();
    }
  }
  return num;
}

function appendDigit(digit) {
  if (resultTextEl.style.opacity === "1" && expression !== "") {
    expression = "";
  }
  
  expression += digit;
  updateDisplay();
}

function appendDecimal() {
  if (resultTextEl.style.opacity === "1" && expression !== "") {
    expression = "";
  }

  const segments = expression.split(/[\+\−\×\÷\%\(\)]/);
  const lastSegment = segments[segments.length - 1].trim();
  
  if (!lastSegment.includes('.')) {
    if (lastSegment === "" || expression.endsWith(' ') || expression.endsWith('(')) {
      expression += "0.";
    } else {
      expression += ".";
    }
    updateDisplay();
  }
}

function appendOperator(op) {
  if (resultTextEl.style.opacity === "1" && expression !== "") {
    const prevResult = resultTextEl.textContent.replaceAll(',', '');
    expression = prevResult;
  }

  if (expression === "") {
    if (op === '−') {
      expression = "(-";
    }
    updateDisplay();
    return;
  }

  const lastChar = expression[expression.length - 1];

  if (lastChar === '(') {
    if (op === '−') {
      expression += "-";
    }
    updateDisplay();
    return;
  }

  if (expression.endsWith(' ')) {
    expression = expression.slice(0, -3) + ` ${op} `;
  } else if (expression.endsWith('(-')) {
    if (op !== '−') {
      expression = expression.slice(0, -2) + ` ${op} `;
    }
  } else {
    expression += ` ${op} `;
  }
  updateDisplay();
}

function appendOpenParen() {
  if (resultTextEl.style.opacity === "1" && expression !== "") {
    expression = "";
  }

  const lastChar = expression[expression.length - 1];
  if (lastChar && /[0-9.)]/.test(lastChar)) {
    expression += " × ";
  }

  expression += "(";
  updateDisplay();
}

function appendCloseParen() {
  const openCount = (expression.match(/\(/g) || []).length;
  const closeCount = (expression.match(/\)/g) || []).length;
  
  const lastChar = expression[expression.length - 1];
  const isLastOperator = expression.endsWith(' ') || lastChar === '(' || expression.endsWith('(-');

  if (openCount > closeCount && !isLastOperator) {
    expression += ")";
    updateDisplay();
  }
}

function toggleSign() {
  if (resultTextEl.style.opacity === "1" && expression !== "") {
    const prevResult = resultTextEl.textContent.replaceAll(',', '');
    expression = prevResult;
  }

  if (expression === "") {
    expression = "(-";
    updateDisplay();
    return;
  }

  if (expression.endsWith('(-')) {
    expression = expression.slice(0, -2);
  } else if (expression.endsWith('(')) {
    expression += "-";
  } else if (expression.endsWith(')')) {
    const match = expression.match(/\(\-([0-9.]+)\)$/);
    if (match) {
      expression = expression.replace(/\(\-([0-9.]+)\)$/, "$1");
    }
  } else {
    const match = expression.match(/([0-9.]+)$/);
    if (match) {
      const num = match[1];
      if (expression.endsWith(`(-${num}`)) {
        expression = expression.slice(0, -(num.length + 2)) + num;
      } else {
        expression = expression.slice(0, -num.length) + `(-${num})`;
      }
    } else {
      expression += "(-";
    }
  }
  updateDisplay();
}

function handleBackspace() {
  if (expression.endsWith(' ')) {
    expression = expression.slice(0, -3);
  } else if (expression.endsWith('(-')) {
    expression = expression.slice(0, -2);
  } else {
    expression = expression.slice(0, -1);
  }
  updateDisplay();
}

function clearAll() {
  expression = "";
  updateDisplay();
}

function evaluate() {
  if (expression.trim() === "") return;

  try {
    const parser = new MathParser(expression);
    const result = parser.parse();
    
    const formattedResult = formatResult(result);
    
    saveToHistory(expression, formattedResult);
    
    expression = "";
    resultTextEl.textContent = formattedResult;
    resultTextEl.style.opacity = "1";
  } catch (e) {
    resultTextEl.textContent = e.message || "Error";
    resultTextEl.style.opacity = "1";
  }
}

function saveToHistory(expr, res) {
  if (history.length > 0 && history[0].expr === expr && history[0].res === res) {
    return;
  }
  
  history.unshift({ expr, res, id: Date.now() });
  
  if (history.length > 50) {
    history.pop();
  }
  
  localStorage.setItem('calcu_history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyListEl.innerHTML = "";
  
  if (history.length === 0) {
    historyEmptyEl.style.display = "flex";
    clearHistoryBtn.style.opacity = "0.5";
    clearHistoryBtn.disabled = true;
    return;
  }
  
  historyEmptyEl.style.display = "none";
  clearHistoryBtn.style.opacity = "1";
  clearHistoryBtn.disabled = false;

  history.forEach(item => {
    const li = document.createElement('li');
    li.className = "history-item";
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `Equation: ${item.expr} equals ${item.res}`);
    li.innerHTML = `
      <span class="history-item-expr">${item.expr}</span>
      <span class="history-item-res">= ${item.res}</span>
    `;
    
    li.addEventListener('click', () => {
      playTactileClick();
      openHistoryModal(item);
    });

    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playTactileClick();
        openHistoryModal(item);
      }
    });

    historyListEl.appendChild(li);
  });
}

function openHistoryModal(item) {
  currentModalItem = item;
  modalExprEl.textContent = item.expr;
  modalResEl.textContent = `= ${item.res}`;
  modalEl.showModal();
}

function closeHistoryModal() {
  modalEl.close();
  currentModalItem = null;
}

useExprBtn.addEventListener('click', () => {
  if (currentModalItem) {
    expression = currentModalItem.expr;
    updateDisplay();
  }
  closeHistoryModal();
  playTactileClick();
  
  historyPaneEl.classList.remove('open');
});

useResBtn.addEventListener('click', () => {
  if (currentModalItem) {
    const rawRes = currentModalItem.res.replaceAll(',', '');
    
    if (resultTextEl.style.opacity === "1" && expression !== "") {
      expression = "";
    }
    
    const lastChar = expression[expression.length - 1];
    if (lastChar && /[0-9.)]/.test(lastChar)) {
      expression += " × ";
    }
    
    expression += rawRes;
    updateDisplay();
  }
  closeHistoryModal();
  playTactileClick();
  
  historyPaneEl.classList.remove('open');
});

closeModalBtn.addEventListener('click', () => {
  closeHistoryModal();
  playTactileClick();
});

clearHistoryBtn.addEventListener('click', () => {
  playTactileClick();
  if (confirm("Purge calculation history log?")) {
    history = [];
    localStorage.removeItem('calcu_history');
    renderHistory();
  }
});

document.querySelector('.keypad').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  playTactileClick();
  const key = btn.dataset.key;

  if (/[0-9]/.test(key)) {
    appendDigit(key);
  } else if (key === '.') {
    appendDecimal();
  } else if (key === 'clear') {
    clearAll();
  } else if (key === 'backspace') {
    handleBackspace();
  } else if (key === '(') {
    appendOpenParen();
  } else if (key === ')') {
    appendCloseParen();
  } else if (key === 'negate') {
    toggleSign();
  } else if (key === '=') {
    evaluate();
  } else {
    let visualOp = key;
    if (key === '/') visualOp = '÷';
    if (key === '*') visualOp = '×';
    if (key === '-') visualOp = '−';
    appendOperator(visualOp);
  }
});

historyToggleBtn.addEventListener('click', () => {
  playTactileClick();
  historyPaneEl.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (historyPaneEl.classList.contains('open') &&
      !historyPaneEl.contains(e.target) &&
      !historyToggleBtn.contains(e.target)) {
    historyPaneEl.classList.remove('open');
  }
});

themeToggleBtn.addEventListener('click', () => {
  playTactileClick();
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('calcu_theme', nextTheme);
});

document.addEventListener('keydown', (e) => {
  const key = e.key;
  let targetKeySelector = null;

  if (/[0-9]/.test(key)) {
    e.preventDefault();
    appendDigit(key);
    targetKeySelector = `.btn[data-key="${key}"]`;
  } else if (key === '.') {
    e.preventDefault();
    appendDecimal();
    targetKeySelector = `.btn[data-key="."]`;
  } else if (key === '+') {
    e.preventDefault();
    appendOperator('+');
    targetKeySelector = `.btn[data-key="+"]`;
  } else if (key === '-') {
    e.preventDefault();
    appendOperator('−');
    targetKeySelector = `.btn[data-key="-"]`;
  } else if (key === '*') {
    e.preventDefault();
    appendOperator('×');
    targetKeySelector = `.btn[data-key="*"]`;
  } else if (key === '/') {
    e.preventDefault();
    appendOperator('÷');
    targetKeySelector = `.btn[data-key="/"]`;
  } else if (key === '%') {
    e.preventDefault();
    appendOperator('%');
    targetKeySelector = `.btn[data-key="%"]`;
  } else if (key === '(') {
    e.preventDefault();
    appendOpenParen();
    targetKeySelector = `.btn[data-key="("]`;
  } else if (key === ')') {
    e.preventDefault();
    appendCloseParen();
    targetKeySelector = `.btn[data-key=")"]`;
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    evaluate();
    targetKeySelector = `.btn[data-key="="]`;
  } else if (key === 'Backspace') {
    e.preventDefault();
    handleBackspace();
    targetKeySelector = `.btn[data-key="backspace"]`;
  } else if (key === 'Escape' || key.toLowerCase() === 'c') {
    e.preventDefault();
    clearAll();
    targetKeySelector = `.btn[data-key="clear"]`;
  }

  if (targetKeySelector) {
    playTactileClick();
    const btn = document.querySelector(targetKeySelector);
    if (btn) {
      btn.classList.add('keyboard-active');
      setTimeout(() => {
        btn.classList.remove('keyboard-active');
      }, 100);
    }
  }
});

renderHistory();
updateDisplay();
