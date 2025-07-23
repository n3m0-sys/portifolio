let display = document.getElementById('display');
let historyList = document.getElementById('history-list');
let currentInput = '';
let operator = '';
let previousInput = '';
let calculationHistory = [];

// Função para adicionar números e operadores ao display
function appendToDisplay(value) {
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
}

// Função para limpar o display
function clearDisplay() {
    display.value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
}

// Função para deletar o último caractere
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Função para realizar cálculos
function calculate() {
    try {
        // Substitui × por * para avaliação
        let expression = display.value.replace(/×/g, '*');
        
        // Avalia a expressão matemática
        let result = eval(expression);
        
        // Adiciona ao histórico
        addToHistory(display.value, result);
        
        // Mostra o resultado
        display.value = result;
        
        // Reseta as variáveis
        currentInput = '';
        operator = '';
        previousInput = '';
        
    } catch (error) {
        display.value = 'Erro';
        setTimeout(clearDisplay, 1000);
    }
}

// Função para adicionar ao histórico
function addToHistory(calculation, result) {
    let historyItem = `${calculation} = ${result}`;
    calculationHistory.unshift(historyItem);
    
    // Limita o histórico a 10 itens
    if (calculationHistory.length > 10) {
        calculationHistory.pop();
    }
    
    updateHistoryDisplay();
}

// Função para atualizar o display do histórico
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    calculationHistory.forEach(item => {
        let div = document.createElement('div');
        div.textContent = item;
        historyList.appendChild(div);
    });
}

// Função para alternar tema
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

// Função para lidar com teclado
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Números
    if (/[0-9]/.test(key)) {
        appendToDisplay(key);
    }
    // Operadores
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    }
    // Ponto decimal
    else if (key === '.') {
        appendToDisplay('.');
    }
    // Enter para calcular
    else if (key === 'Enter') {
        calculate();
    }
    // Backspace para deletar
    else if (key === 'Backspace') {
        deleteLast();
    }
    // Escape para limpar
    else if (key === 'Escape') {
        clearDisplay();
    }
});

// Animação de boas-vindas
window.addEventListener('load', function() {
    display.value = '0';
    
    // Efeito de digitação no título
    const title = document.querySelector('h1');
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 100);
});