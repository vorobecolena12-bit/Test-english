$(document).ready(function () {
    // Оновлений словник зі скріншотів тексту "Weird Inventions"
    const fullDictionary = [
        { ua: "суперечити / заперечувати", en: "contradict" },
        { ua: "фізика", en: "physics" },
        { ua: "зрошення / іригація", en: "irrigation" },
        { ua: "хвиля", en: "wave" },
        { ua: "химерний / дуже дивний", en: "bizarre" },
        { ua: "розробляти / проектувати", en: "design" },
        { ua: "вихід на пенсію / пенсія", en: "retirement" },
        { ua: "трубка / труба", en: "tube" },
        { ua: "клапан / відкидна стулка", en: "flap" },
        { ua: "випадково", en: "accidentally" },
        { ua: "зручний / корисний", en: "handy" },
        { ua: "запускати (напр. сигналізацію)", en: "set off" },
        { ua: "дивний / несподіваний (ідіома)", en: "out in left field" },
        { ua: "бути в хорошій компанії (ідіома)", en: "be in good company" },
        { ua: "винахід", en: "invention" },
        { ua: "винахідник", en: "inventor" },
        { ua: "винаходити", en: "invent" },
        { ua: "нереалістичний", en: "unrealistic" },
        { ua: "відстань", en: "distance" },
        { ua: "танути / плавитися", en: "melt" },
        { ua: "пустеля", en: "desert" },
        { ua: "напрямок", en: "direction" },
        { ua: "запобігати", en: "prevent" },
        { ua: "крадіжка", en: "theft" },
        { ua: "красти", en: "steal" },
        { ua: "полум'я", en: "flame" },
        { ua: "травмований / поранений", en: "injured" },
        { ua: "безлад", en: "mess" },
        { ua: "спраглий", en: "thirsty" },
        { ua: "серйозний", en: "serious" },
        { ua: "з'єднувати", en: "connect" },
        { ua: "визначати", en: "determine" },
        { ua: "експеримент", en: "experiment" },
        { ua: "дослідник", en: "researcher" },
        { ua: "клімат", en: "climate" },
        { ua: "зрошувати", en: "irrigate" },
        { ua: "дизайнер", en: "designer" },
        { ua: "суперечність", en: "contradiction" },
        { ua: "суперечливий", en: "contradictory" },
        { ua: "дивовижно", en: "surprisingly" },
        { ua: "традиційно", en: "traditionally" },
        { ua: "з'єднання", en: "connection" },
        { ua: "реальність", en: "reality" },
        { ua: "медицина / ліки", en: "medicine" },
        { ua: "базовий / основний", en: "basic" },
        { ua: "прикріплений", en: "attached" }
    ];

    const TEST_SIZE = 15;
    let testWords = [];
    let currentIndex = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let cardStates = [];
    let userAnswers = [];

    $("#total-dict-count").text(fullDictionary.length);

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

    $("#translation-input").on("keydown", function (e) {
        if (e.key === "Enter") {
            $("#word-card").click();
        }
    });

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

    function renderDictionary(filterText = "") {
        const $list = $("#dictionary-list");
        $list.empty();
        const query = filterText.trim().toLowerCase();

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
