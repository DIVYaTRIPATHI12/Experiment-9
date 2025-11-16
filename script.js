const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const previousOperandDisplay = document.querySelector('.previous-operand');
const currentOperandDisplay = document.querySelector('.current-operand');

const state = {
    currentOperand: '0',
    previousOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    shouldResetCurrentOperand: false
};

function updateDisplay() {
    currentOperandDisplay.textContent = state.currentOperand;
    if (state.previousOperand !== null && state.operator !== null) {
        previousOperandDisplay.textContent = `${state.previousOperand} ${state.operator}`;
    } else {
        previousOperandDisplay.textContent = '';
    }
}

updateDisplay();

function handleNumber(number) {
    const { currentOperand, waitingForSecondOperand, shouldResetCurrentOperand } = state;

    if (shouldResetCurrentOperand) { 
        state.currentOperand = number;
        state.shouldResetCurrentOperand = false;
        state.waitingForSecondOperand = false;
    } else if (waitingForSecondOperand === true) {
        state.currentOperand = number;
        state.waitingForSecondOperand = false;
    } else {
        state.currentOperand = currentOperand === '0' ? number : currentOperand + number;
    }
}

function handleDoubleZero() {
    const { currentOperand, waitingForSecondOperand, shouldResetCurrentOperand } = state;

    if (shouldResetCurrentOperand) {
        state.currentOperand = '0';
        state.shouldResetCurrentOperand = false;
        state.waitingForSecondOperand = false;
    } else if (waitingForSecondOperand === true) {
        state.currentOperand = '0'; 
        state.waitingForSecondOperand = false;
    } else {
        if (currentOperand !== '0') {
            state.currentOperand += '00';
        }
    }
}

function handleDecimal() {
    if (state.shouldResetCurrentOperand || state.waitingForSecondOperand) {
        state.currentOperand = '0.';
        state.shouldResetCurrentOperand = false;
        state.waitingForSecondOperand = false;
        return;
    }
    if (!state.currentOperand.includes('.')) {
        state.currentOperand += '.';
    }
}

function handleOperator(nextOperator) {
    const { previousOperand, currentOperand, operator } = state;
    const inputValue = parseFloat(currentOperand);

    if (previousOperand === null && !isNaN(inputValue)) {
        state.previousOperand = inputValue;
    } else if (operator && previousOperand !== null && !isNaN(inputValue)) {
        const result = calculate(previousOperand, inputValue, operator);
        state.currentOperand = String(result);
        state.previousOperand = result;
    }

    state.waitingForSecondOperand = true;
    state.shouldResetCurrentOperand = true; 
    state.operator = nextOperator;
}

function calculate(first, second, operator) {
    first = parseFloat(first);
    second = parseFloat(second);
    if (isNaN(first) || isNaN(second)) return ''; // Handle invalid numbers

    if (operator === '+') return first + second;
    if (operator === '-') return first - second;
    if (operator === '*') return first * second;
    if (operator === '/') return first / second;
    return second;
}

function handleClear() {
    state.currentOperand = '0';
    state.previousOperand = null;
    state.operator = null;
    state.waitingForSecondOperand = false;
    state.shouldResetCurrentOperand = false;
}

function handleDelete() {
    const { currentOperand } = state;
    const newValue = currentOperand.slice(0, -1);
    
    if (newValue === '' || newValue === '-') {
        state.currentOperand = '0';
    } else {
        state.currentOperand = newValue;
    }
}

keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    const { action } = target.dataset;
    const keyContent = target.textContent;
    
    if (keyContent === '00') {
        handleDoubleZero();
    } else if (!action) { 
        handleNumber(keyContent);
    } else if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
        handleOperator(keyContent); 
    } else if (action === 'decimal') {
        handleDecimal();
    } else if (action === 'clear') {
        handleClear();
    } else if (action === 'delete') {
        handleDelete();
    } else if (action === 'calculate') {
        if (state.previousOperand !== null && state.operator !== null) {
            const result = calculate(state.previousOperand, parseFloat(state.currentOperand), state.operator);
            state.currentOperand = String(result);
            state.previousOperand = null; 
            state.operator = null; 
            state.shouldResetCurrentOperand = true; 
            state.waitingForSecondOperand = false; 
        }
    }
    
    updateDisplay();
});