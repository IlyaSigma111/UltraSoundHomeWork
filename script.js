// Основные переменные
let currentTheme = 'light';
let quizData = [];
let currentQuestion = 0;
let score = 0;
let simulationInterval;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initFrequencySlider();
    initQuiz();
    initEventListeners();
    updateWaveAnimation();
});

// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    document.getElementById('themeToggle').addEventListener('click', function() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Слайдер частоты
function initFrequencySlider() {
    const slider = document.getElementById('frequencySlider');
    const currentFreq = document.getElementById('currentFreq');
    const freqValue = document.getElementById('freqValue');
    
    slider.addEventListener('input', function() {
        const value = parseInt(this.value);
        currentFreq.textContent = formatFrequency(value) + ' Гц';
        freqValue.textContent = formatFrequency(value);
        updateWaveAnimation(value);
    });
}

function formatFrequency(freq) {
    if (freq >= 1000) {
        return (freq / 1000).toFixed(freq % 1000 === 0 ? 0 : 1) + 'k';
    }
    return freq;
}

function updateWaveAnimation(freq = 20000) {
    const waves = document.querySelectorAll('.wave');
    const speed = Math.max(0.5, Math.min(5, freq / 40000));
    
    waves.forEach((wave, index) => {
        const waveSpeed = speed * (1 + index * 0.3);
        wave.style.animationDuration = `${5 / waveSpeed}s`;
    });
}

// Инициализация викторины
function initQuiz() {
    quizData = [
        {
            question: "Какая минимальная частота ультразвука?",
            options: [
                "10 000 Гц",
                "20 000 Гц",
                "30 000 Гц",
                "40 000 Гц"
            ],
            correct: 1
        },
        {
            question: "Какое животное НЕ использует ультразвук для эхолокации?",
            options: [
                "Летучая мышь",
                "Дельфин",
                "Сова",
                "Кит"
            ],
            correct: 2
        },
        {
            question: "Что такое УЗИ в медицине?",
            options: [
                "Ультразвуковое исследование",
                "Ультрафиолетовое сканирование",
                "Универсальное зондирование организма",
                "Ускоренное лечение инфекций"
            ],
            correct: 0
        },
        {
            question: "Какой прибор использует ультразвук для очистки?",
            options: [
                "Ультразвуковая ванна",
                "Стиральная машина",
                "Пылесос",
                "Микроволновая печь"
            ],
            correct: 0
        },
        {
            question: "Почему человек не слышит ультразвук?",
            options: [
                "Слишком высокая частота",
                "Слишком низкая частота",
                "Слишком громко",
                "Слишком тихо"
            ],
            correct: 0
        }
    ];
    
    displayQuestion();
}

function displayQuestion() {
    const quizContainer = document.getElementById('quizContainer');
    const question = quizData[currentQuestion];
    
    quizContainer.innerHTML = `
        <div class="question">
            <h3>Вопрос ${currentQuestion + 1} из ${quizData.length}</h3>
            <p>${question.question}</p>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option" data-index="${index}">
                        <div class="option-circle"></div>
                        ${option}
                    </div>
                `).join('')}
            </div>
            <button id="nextQuestion" class="cta-button" style="margin-top: 1rem;">
                ${currentQuestion === quizData.length - 1 ? 'Завершить викторину' : 'Следующий вопрос'}
            </button>
        </div>
    `;
    
    // Добавляем обработчики для вариантов ответа
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
    
    // Обработчик для кнопки "Далее"
    document.getElementById('nextQuestion').addEventListener('click', checkAnswer);
}

function checkAnswer() {
    const selectedOption = document.querySelector('.option.selected');
    
    if (!selectedOption) {
        alert('Выберите ответ!');
        return;
    }
    
    const selectedIndex = parseInt(selectedOption.dataset.index);
    const correctIndex = quizData[currentQuestion].correct;
    
    // Показываем правильный/неправильный ответ
    document.querySelectorAll('.option').forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            option.classList.add('wrong');
        }
        option.style.pointerEvents = 'none';
    });
    
    // Увеличиваем счет если ответ правильный
    if (selectedIndex === correctIndex) {
        score++;
    }
    
    // Переходим к следующему вопросу или показываем результаты
    setTimeout(() => {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            displayQuestion();
        } else {
            showResults();
        }
    }, 2000);
}

function showResults() {
    const quizContainer = document.getElementById('quizContainer');
    const resultsContainer = document.getElementById('quizResults');
    const scoreElement = document.getElementById('score');
    const messageElement = document.getElementById('resultMessage');
    
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    scoreElement.textContent = score;
    
    // Генерируем сообщение в зависимости от результата
    let message = '';
    if (score === 5) {
        message = 'Отлично! Ты настоящий эксперт по ультразвуку!';
    } else if (score >= 3) {
        message = 'Хорошо! Ты хорошо разбираешься в теме!';
    } else {
        message = 'Неплохо, но есть куда расти! Попробуй ещё раз.';
    }
    
    messageElement.textContent = message;
    
    // Обработчик для кнопки "Попробовать ещё раз"
    document.getElementById('retryQuiz').addEventListener('click', function() {
        currentQuestion = 0;
        score = 0;
        resultsContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        displayQuestion();
    });
}

// Симуляция эхолокации
function initEventListeners() {
    // Кнопка "Открыть мир тишины"
    document.getElementById('startJourney').addEventListener('click', function() {
        document.querySelector('#whatIs').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
    
    // Кнопки симуляции
    document.querySelectorAll('.simulate-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const example = this.dataset.example;
            openSimulationModal(example);
        });
    });
    
    // УЗИ сканер
    document.getElementById('scanBtn').addEventListener('click', simulateUltrasound);
    
    // Закрытие модального окна
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // Клик вне модального окна
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('simulationModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Версия для печати
    document.getElementById('printBtn').addEventListener('click', function() {
        window.print();
    });
}

function openSimulationModal(type) {
    const modal = document.getElementById('simulationModal');
    const modalTitle = document.getElementById('modalTitle');
    const description = document.getElementById('simulationDescription');
    
    if (type === 'bat') {
        modalTitle.textContent = 'Симуляция эхолокации летучей мыши';
        description.textContent = 'Летучая мышь испускает ультразвуковые импульсы и по отражённому сигналу определяет расстояние до объектов.';
    } else {
        modalTitle.textContent = 'Симуляция эхолокации дельфина';
        description.textContent = 'Дельфины используют ультразвук для навигации в мутной воде и охоты на рыбу.';
    }
    
    modal.style.display = 'flex';
    
    // Инициализируем канвас для симуляции
    initSimulationCanvas(type);
}

function closeModal() {
    document.getElementById('simulationModal').style.display = 'none';
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }
}

function initSimulationCanvas(type) {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    
    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем фон
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем звёзды (точки)
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Обработчики для кнопок управления симуляцией
    document.getElementById('startSimulation').addEventListener('click', function() {
        startSimulation(type);
    });
    
    document.getElementById('resetSimulation').addEventListener('click', function() {
        initSimulationCanvas(type);
    });
}

function startSimulation(type) {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const speed = parseInt(document.getElementById('simulationSpeed').value);
    
    let animalX = 100;
    let animalY = canvas.height / 2;
    let pulseRadius = 0;
    let pulseActive = false;
    let obstacles = [];
    
    // Создаём препятствия
    for (let i = 0; i < 5; i++) {
        obstacles.push({
            x: 300 + Math.random() * 400,
            y: 50 + Math.random() * (canvas.height - 100),
            width: 20 + Math.random() * 30,
            height: 20 + Math.random() * 30,
            detected: false
        });
    }
    
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }
    
    simulationInterval = setInterval(function() {
        // Очищаем канвас
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем фон
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем звёзды
        ctx.fillStyle = 'white';
        for (let i = 0; i < 50; i++) {
            const x = (Math.random() * canvas.width + Date.now() / 1000) % canvas.width;
            const y = (Math.random() * canvas.height + Date.now() / 1100) % canvas.height;
            const size = Math.random() * 2;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Рисуем животное
        ctx.fillStyle = type === 'bat' ? '#8b5cf6' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(animalX, animalY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Рисуем глаза
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(animalX + 5, animalY - 3, 3, 0, Math.PI * 2);
        ctx.arc(animalX + 5, animalY + 3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Рисуем ультразвуковой импульс
        if (pulseActive) {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(animalX, animalY, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Увеличиваем радиус импульса
            pulseRadius += speed * 5;
            
            // Проверяем столкновение с препятствиями
            obstacles.forEach(obstacle => {
                const distance = Math.sqrt(
                    Math.pow(animalX - (obstacle.x + obstacle.width/2), 2) + 
                    Math.pow(animalY - (obstacle.y + obstacle.height/2), 2)
                );
                
                if (distance < pulseRadius + obstacle.width/2) {
                    obstacle.detected = true;
                }
            });
            
            // Если импульс вышел за границы экрана
            if (pulseRadius > canvas.width) {
                pulseActive = false;
                pulseRadius = 0;
            }
        }
        
        // Рисуем препятствия
        obstacles.forEach(obstacle => {
            ctx.fillStyle = obstacle.detected ? '#10b981' : '#64748b';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        // Двигаем животное
        animalX += speed;
        if (animalX > canvas.width + 50) {
            animalX = -50;
            // Сбрасываем обнаружение препятствий
            obstacles.forEach(obstacle => obstacle.detected = false);
        }
        
        // Периодически испускаем новый импульс
        if (!pulseActive && Math.random() < 0.05) {
            pulseActive = true;
            pulseRadius = 10;
        }
        
    }, 50);
}

function simulateUltrasound() {
    const screen = document.getElementById('scannerScreen');
    const organ = document.getElementById('organSelect').value;
    
    screen.innerHTML = '';
    
    // Создаём "сканирующую" линию
    const scanLine = document.createElement('div');
    scanLine.className = 'scan-line';
    screen.appendChild(scanLine);
    
    // Создаём изображение органа
    setTimeout(() => {
        scanLine.remove();
        
        let organText = '';
        if (organ === 'heart') {
            organText = `
                <pre style="color: #10b981; font-size: 0.8rem;">
                .       .       .       .       .
                  .     .     .     .     .     .
                    .   .   .   .   .   .   .   .
                ________   ________   ________
                \\       \\ /       \\ /       /
                 \\       /\\       /\\       /
                  \\_____/  \\_____/  \\_____/
                </pre>
                <p>Сердце: нормальные размеры, хорошая сократимость</p>
            `;
        } else if (organ === 'baby') {
            organText = `
                <pre style="color: #f472b6; font-size: 0.9rem;">
                     /\\ 
                    /  \\
                   /    \\
                  /______\\
                 / |    | \\
                /  |    |  \\
                </pre>
                <p>Плод: 12 недель, нормальное развитие</p>
            `;
        } else {
            organText = `
                <pre style="color: #f59e0b; font-size: 0.8rem;">
                  /\\/\\/\\
                 /      \\
                /        \\
                \\        /
                 \\______/
                </pre>
                <p>Печень: однородная структура, без патологий</p>
            `;
        }
        
        screen.innerHTML = organText;
    }, 2000);
}
