class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.history = [];
        this.memory = 0;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Add to history
        this.addToHistory(`${prev} ${this.operation} ${current} = ${computation}`);

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    specialFunction(func) {
        const current = parseFloat(this.currentOperand);
        let result;

        switch (func) {
            case 'x²':
                result = Math.pow(current, 2);
                this.addToHistory(`${current}² = ${result}`);
                break;
            case '√':
                if (current < 0) {
                    alert("Cannot calculate square root of a negative number!");
                    return;
                }
                result = Math.sqrt(current);
                this.addToHistory(`√${current} = ${result}`);
                break;
            case '%':
                result = current / 100;
                this.addToHistory(`${current}% = ${result}`);
                break;
            case '1/x':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    return;
                }
                result = 1 / current;
                this.addToHistory(`1/${current} = ${result}`);
                break;
        }

        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    memoryFunction(func) {
        const current = parseFloat(this.currentOperand);
        
        switch (func) {
            case 'MC':
                this.memory = 0;
                break;
            case 'MR':
                this.currentOperand = this.memory.toString();
                break;
            case 'M+':
                this.memory += current;
                break;
            case 'M-':
                this.memory -= current;
                break;
        }
        this.updateDisplay();
    }

    addToHistory(entry) {
        this.history.push(entry);
        this.updateHistory();
    }

    updateHistory() {
        const historyContent = document.querySelector('.history-content');
        historyContent.innerHTML = '';
        
        this.history.slice().reverse().forEach(entry => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.textContent = entry;
            historyContent.appendChild(historyItem);
        });
    }

    clearHistory() {
        this.history = [];
        this.updateHistory();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Theme toggling
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');
const themeText = themeToggle.querySelector('.toggle-text');

function updateThemeUI(isDark) {
    const themeIcon = document.querySelector('.toggle-icon');
    const themeText = document.querySelector('.toggle-text');
    
    if (isDark) {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
    } else {
        themeIcon.textContent = '🌞';
        themeText.textContent = 'Light Mode';
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    updateThemeUI(newTheme === 'dark');
});

// Initialize theme UI based on current theme
updateThemeUI(html.getAttribute('data-theme') === 'dark');

// Get DOM elements
const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operator');
const functionButtons = document.querySelectorAll('.function');
const memoryButtons = document.querySelectorAll('.memory');
const equalsButton = document.querySelector('.equals');
const deleteButton = document.querySelector('.delete');
const clearButton = document.querySelector('.clear');
const clearHistoryButton = document.getElementById('clearHistory');
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');

// Create calculator instance
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Add event listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

functionButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.specialFunction(button.innerText);
    });
});

memoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.memoryFunction(button.innerText);
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

clearHistoryButton.addEventListener('click', () => {
    calculator.clearHistory();
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    }
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let operation = e.key;
        if (operation === '*') operation = '×';
        if (operation === '/') operation = '÷';
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
    }
    if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    }
    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
}); 