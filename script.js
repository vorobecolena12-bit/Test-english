$(document).ready(function () {
    // Повний словник усіх слів, словоформ та ідіом зі скріншотів підручника ("Not All Hackers Are the Same")
    const fullDictionary = [
        // Основна лексика з тексту та Vocabulary Preview
        { ua: "змінювати (інформацію, дані)", en: "alter" },
        { ua: "приватний / особистий (не публічний)", en: "private" },
        { ua: "взаємодіяти / спілкуватися", en: "interact" },
        { ua: "дійсний / правильний (пароль, ліцензія)", en: "valid" },
        { ua: "ділитися / використовувати спільно", en: "share" },
        { ua: "загроза / небезпека", en: "threat" },
        { ua: "несанкціонований (доступ)", en: "unauthorized" },
        { ua: "мережа (комп'ютерна)", en: "network" },
        { ua: "протокол (передачі даних)", en: "protocol" },
        { ua: "маніпулювати / керувати", en: "manipulate" },
        { ua: "пасивний", en: "passive" },
        { ua: "активний", en: "active" },
        { ua: "код", en: "code" },
        { ua: "пароль", en: "password" },
        { ua: "безпека / захист", en: "security" },
        { ua: "хакерство / комп'ютерний злом", en: "hacking" },
        { ua: "доступ", en: "access" },

        // Словоформи із вправи B (Vocabulary Review) та Summary
        { ua: "незаконний (прикметник)", en: "illegal" },
        { ua: "незаконно (прислівник)", en: "illegally" },
        { ua: "легалізувати / узаконити", en: "legalize" },
        { ua: "зміна / переробка (іменник, напр. одягу)", en: "alteration" },
        { ua: "пасивно (прислівник)", en: "passively" },
        { ua: "пасивність (іменник)", en: "passivity" },

        // Ідіоми (Idiomatic Expressions)
        { ua: "свого роду / певною мірою (ідіома)", en: "sort of" },
        { ua: "відчувати приплив адреналіну / кайф (ідіома)", en: "get a rush" },
        { ua: "безумовно / з великим відривом (ідіома)", en: "by far" },

        // Додаткові слова з тексту та тестів (Reading & Vocabulary Review)
        { ua: "видаляти", en: "delete" },
        { ua: "красти", en: "steal" },
        { ua: "поширювати (віруси)", en: "spread" },
        { ua: "пошкоджувати / завдавати шкоди", en: "damage" },
        { ua: "знищувати / руйнувати", en: "destroy" },
        { ua: "програмне забезпечення", en: "software" },
        { ua: "визначати / встановлювати", en: "determine" },
        { ua: "необмежений", en: "unlimited" },
        { ua: "зазвичай / загалом (прислівник)", en: "commonly" },
        { ua: "складний / що кидає виклик", en: "challenging" },
        { ua: "військовий", en: "military" },
        { ua: "випускати (вірус)", en: "release" },
        { ua: "небезпечний", en: "dangerous" },
        { ua: "захищати", en: "protect" },
        { ua: "незвичайний", en: "unusual" },
        { ua: "вгадувати", en: "guess" },
        { ua: "пристрій", en: "device" },
        { ua: "завантажувати (з інтернету)", en: "download" },
        { ua: "вважатися (напр. великим вченим)", en: "considered" },
        { ua: "відкладений / із затримкою (ефект вірусу)", en: "delayed" },
        { ua: "шкідливий", en: "harmful" },
        { ua: "обліковий запис / акаунт", en: "account" },
        { ua: "інакше / в іншому випадку", en: "otherwise" },
        { ua: "додатковий", en: "additional" }
    ];

    const TEST_SIZE = 15; // Кількість слів в одному тесті
    let testWords = [];
    let currentIndex = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let cardStates = [];
    let userAnswers = [];

    // Відображення загальної кількості слів у кнопці словника
    $("#total-dict-count").text(fullDictionary.length);

    // Алгоритм Фішера-Єйтса для якісного рандомного перемішування
    function shuffleArray(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function startGame() {
        currentIndex = 0;
        correctCount = 0;
        wrongCount = 0;
        cardStates = new Array(TEST_SIZE).fill(null);
        userAnswers = new Array(TEST_SIZE).fill("");

        // Перемішуємо весь словник і беремо перші 15 випадкових слів
        testWords = shuffleArray(fullDictionary).slice(0, TEST_SIZE);

        $("#correct-count").text(correctCount);
        $("#wrong-count").text(wrongCount);
        $("#result-modal").fadeOut(200);

        showWord();
    }

    function showWord() {
        let currentWord = testWords[currentIndex];
        $("#current-word").text(currentWord.ua);
        $("#step-counter").text((currentIndex + 1) + "/" + TEST_SIZE);
        $("#validation-error").text("");
        $("#word-card").removeClass("card-correct card-wrong");

        if (cardStates[currentIndex] === null) {
            $("#translation-input").val("").prop("disabled", false).focus();
        } else {
            $("#translation-input").val(userAnswers[currentIndex]).prop("disabled", true);
            if (cardStates[currentIndex] === true) {
                $("#word-card").addClass("card-correct");
            } else {
                $("#word-card").addClass("card-wrong");
                $("#validation-error").text("Правильно: " + currentWord.en);
            }
        }
    }

    // Перевірка слова при кліку на картку
    $("#word-card").click(function () {
        if (cardStates[currentIndex] !== null) return;

        let answer = $("#translation-input").val().trim().toLowerCase().replace(/\s+/g, " ");

        if (answer === "") {
            $("#validation-error").text("Введіть переклад англійською!");
            return;
        }

        let englishRegex = /^[a-zA-Z\s-]+$/;
        if (!englishRegex.test(answer)) {
            $("#validation-error").text("Тільки англійські літери!");
            return;
        }

        $("#translation-input").prop("disabled", true);
        $("#validation-error").text("");
        userAnswers[currentIndex] = answer;

        let correctEn = testWords[currentIndex].en.toLowerCase();

        if (answer === correctEn) {
            correctCount++;
            $("#correct-count").text(correctCount);
            $("#word-card").addClass("card-correct");
            cardStates[currentIndex] = true;
        } else {
            wrongCount++;
            $("#wrong-count").text(wrongCount);
            $("#word-card").addClass("card-wrong");
            $("#validation-error").text("Правильно: " + testWords[currentIndex].en);
            cardStates[currentIndex] = false;
        }

        setTimeout(function () {
            if (!cardStates.includes(null)) {
                showResults();
            } else if (currentIndex < TEST_SIZE - 1) {
                currentIndex++;
                showWord();
            }
        }, 900);
    });

    // Перевірка по натисканню Enter
    $("#translation-input").on("keydown", function (e) {
        if (e.key === "Enter") {
            $("#word-card").click();
        }
    });

    // Навігація вперед/назад
    $("#next-btn").click(function () {
        if (currentIndex < TEST_SIZE - 1) {
            currentIndex++;
            showWord();
        }
    });

    $("#prev-btn").click(function () {
        if (currentIndex > 0) {
            currentIndex--;
            showWord();
        }
    });

    // Виведення модального вікна з результатами та списком помилок
    function showResults() {
        let percentage = Math.round((correctCount / TEST_SIZE) * 100);
        $("#modal-score").text(`Вірно: ${correctCount} з ${TEST_SIZE} (${percentage}%)`);

        if (correctCount >= 13) {
            $("#modal-level").text("Рівень: Advanced (Відмінно!)").css("color", "#10b981");
        } else if (correctCount >= 10) {
            $("#modal-level").text("Рівень: Intermediate (Добре)").css("color", "#3b82f6");
        } else if (correctCount >= 7) {
            $("#modal-level").text("Рівень: Elementary (Задовільно)").css("color", "#f59e0b");
        } else {
            $("#modal-level").text("Рівень: Beginner (Варто повторити слова)").css("color", "#ef4444");
        }

        // Формування списку неправильних відповідей
        const $mistakesList = $("#mistakes-list");
        const $mistakesWrapper = $("#mistakes-wrapper");
        $mistakesList.empty();

        let hasMistakes = false;
        for (let i = 0; i < TEST_SIZE; i++) {
            if (cardStates[i] === false) {
                hasMistakes = true;
                $mistakesList.append(`
                    <div class="mistake-item">
                        <span class="mistake-ua">${testWords[i].ua}</span>
                        <span class="mistake-user">${userAnswers[i]}</span>
                        <span class="mistake-correct">&rarr; ${testWords[i].en}</span>
                    </div>
                `);
            }
        }

        if (hasMistakes) {
            $mistakesWrapper.show();
            $(".no-mistakes").remove();
        } else {
            $mistakesWrapper.hide();
            if ($(".no-mistakes").length === 0) {
                $("<div class='no-mistakes'>Жодної помилки! Ідеальний результат!</div>").insertBefore("#restart-btn");
            }
        }

        $("#result-modal").css("display", "flex").hide().fadeIn(300);
    }

    // Рендер повного словника у модальному вікні
    function renderDictionary(filterText = "") {
        const $list = $("#dictionary-list");
        $list.empty();
        const query = filterText.trim().toLowerCase();

        // Сортуємо за англійським алфавітом для зручного перегляду
        const sortedDict = [...fullDictionary].sort((a, b) => a.en.localeCompare(b.en));

        sortedDict.forEach(item => {
            if (item.en.toLowerCase().includes(query) || item.ua.toLowerCase().includes(query)) {
                $list.append(`
                    <div class="dict-row">
                        <span class="dict-en">${item.en}</span>
                        <span class="dict-ua">${item.ua}</span>
                    </div>
                `);
            }
        });
    }

    // Відкриття та закриття модального вікна словника
    $("#open-dict-btn").click(function () {
        $("#dict-search").val("");
        renderDictionary();
        $("#dictionary-modal").css("display", "flex").hide().fadeIn(250);
    });

    $("#close-dict-btn").click(function () {
        $("#dictionary-modal").fadeOut(200);
    });

    $("#dict-search").on("input", function () {
        renderDictionary($(this).val());
    });

    $("#restart-btn").click(startGame);

    startGame();
});
