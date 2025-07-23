class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedCards = 0;
        this.moves = 0;
        this.score = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.gameStarted = false;
        this.difficulty = 'medium';
        
        // Emojis para os pares de cartas
        this.emojis = ['🎮', '🎯', '🎪', '🎨', '🎭', '🎬', '🎧', '🎸', '🎺', '🎻', '🎲', '🎳', '🚗', '🚀', '🚁', '🚢', '🏠', '🏥'];
        
        this.initializeElements();
        this.setupEventListeners();
        this.startGame();
    }

    initializeElements() {
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.timerElement = document.getElementById('timer');
        this.restartBtn = document.getElementById('restart-btn');
        this.difficultySelect = document.getElementById('difficulty');
        this.winModal = document.getElementById('win-modal');
        this.finalScore = document.getElementById('final-score');
        this.finalTime = document.getElementById('final-time');
        this.finalMoves = document.getElementById('final-moves');
        this.playAgainBtn = document.getElementById('play-again');
    }

    setupEventListeners() {
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.restartGame();
        });
        this.playAgainBtn.addEventListener('click', () => {
            this.winModal.classList.add('hidden');
            this.restartGame();
        });
    }

    startGame() {
        this.createCards();
        this.renderCards();
        this.startTimer();
        this.gameStarted = true;
    }

    createCards() {
        let pairs = 8; // Padrão para fácil/médio
        
        if (this.difficulty === 'hard') {
            pairs = 18; // 6x6 grid
        }

        // Seleciona emojis aleatórios
        const selectedEmojis = this.shuffleArray([...this.emojis]).slice(0, pairs);
        const cardValues = [...selectedEmojis, ...selectedEmojis];
        const shuffledValues = this.shuffleArray(cardValues);

        this.cards = shuffledValues.map((value, index) => ({
            id: index,
            value: value,
            flipped: false,
            matched: false
        }));

        this.matchedCards = 0;
        this.moves = 0;
        this.score = 0;
        this.updateDisplay();
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    renderCards() {
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = `game-board ${this.difficulty}`;

        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = `memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`;
            cardElement.dataset.id = card.id;

            cardElement.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-front">?</div>
                    <div class="memory-card-back">${card.value}</div>
                </div>
            `;

            cardElement.addEventListener('click', () => this.flipCard(card.id));
            this.gameBoard.appendChild(cardElement);
        });
    }

    flipCard(cardId) {
        const card = this.cards.find(c => c.id === cardId);

        // Não permite virar cartas já viradas ou combinadas
        if (card.flipped || card.matched || this.flippedCards.length === 2) {
            return;
        }

        // Inicia o timer no primeiro movimento
        if (!this.gameStarted) {
            this.startTimer();
            this.gameStarted = true;
        }

        card.flipped = true;
        this.flippedCards.push(card);
        this.renderCards();

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkForMatch();
        }
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.value === card2.value) {
            // Combinação encontrada
            card1.matched = true;
            card2.matched = true;
            this.matchedCards += 2;
            this.score += 10;
            this.flippedCards = [];
            this.updateDisplay();

            // Verifica vitória
            if (this.matchedCards === this.cards.length) {
                this.endGame();
            }
        } else {
            // Não combina - vira as cartas de volta
            setTimeout(() => {
                card1.flipped = false;
                card2.flipped = false;
                this.flippedCards = [];
                this.renderCards();
            }, 1000);
        }
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.startTime = new Date();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        if (this.startTime) {
            const currentTime = new Date();
            const elapsed = Math.floor((currentTime - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            this.timerElement.textContent = `${minutes}:${seconds}`;
        }
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.movesElement.textContent = this.moves;
    }

    endGame() {
        clearInterval(this.timerInterval);
        const finalTime = this.timerElement.textContent;
        
        this.finalScore.textContent = this.score;
        this.finalTime.textContent = finalTime;
        this.finalMoves.textContent = this.moves;
        
        setTimeout(() => {
            this.winModal.classList.remove('hidden');
        }, 500);
    }

    restartGame() {
        clearInterval(this.timerInterval);
        this.flippedCards = [];
        this.startTime = null;
        this.timerElement.textContent = '00:00';
        this.gameStarted = false;
        this.startGame();
    }
}

// Inicializa o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});

// Efeitos sonoros (opcional)
const playFlipSound = () => {
    // Você pode adicionar sons aqui se quiser
    console.log('Flip!');
};

const playMatchSound = () => {
    console.log('Match!');
};

const playWinSound = () => {
    console.log('Win!');
};