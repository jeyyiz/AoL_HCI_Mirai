const questions = [
    "I often notice small sounds when others do not",
    "I usually concentrate more on the whole picture, rather than the small details",
    "I find it easy to do more than one thing at once",
    "If there is an interruption, I can switch back to what I was doing very quickly",
    "I can easily understand what people mean, even if they don't say it directly",
    "I can easily notice if someone gets bored while listening to me",
    "I find it difficult to understand characters' intentions when reading a story",
    "I like to collect information about categories of things (e.g. types of car, bird, plant, etc)",
    "I can easily tell what someone is thinking or feeling just by looking at their face",
    "I find it difficult to understand people's intentions"
];

let currentQuestionIndex = 0;
let answers = new Array(questions.length).fill(null);
let userGender = null;
let currentAudio = null;       // Mengontrol audio pertanyaan utama
let currentOptionAudio = null; // Mengontrol audio tombol pilihan jawaban (Baru)

function startQuiz(gender) {
    userGender = gender;
    document.getElementById('introSection').style.display = 'none';
    document.getElementById('quizSection').style.display = 'block';
    updateQuestion();
}

function updateQuestion() {
    stopAudio(); // Otomatis menghentikan semua audio yang sedang berputar (utama & opsi)

    document.getElementById('questionTitle').innerText = questions[currentQuestionIndex];
    document.getElementById('questionCounter').innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + "%";

    const savedAnswer = answers[currentQuestionIndex];
    const options = document.querySelectorAll('.option-item');
    
    options.forEach((opt, i) => {
        opt.classList.remove('selected');
        // Cek berdasarkan indeks tombol fisik (0, 1, 2, 3) agar tidak menyala ganda
        if (savedAnswer !== null && i === savedAnswer.idx) {
            opt.classList.add('selected');
        }
    });

    document.getElementById('prevBtn').style.visibility = (currentQuestionIndex === 0) ? "hidden" : "visible";

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.innerText = (currentQuestionIndex === questions.length - 1) ? "Submit Assessment" : "Next Question →";
    nextBtn.disabled = (answers[currentQuestionIndex] === null);
}

function selectOption(value, el) {
    // Mengambil attribute data-idx (0, 1, 2, atau 3) dari elemen tombol yang diklik
    const idx = parseInt(el.getAttribute('data-idx'));
    
    // Menyimpan nilai biner (value) untuk model dan idx untuk urutan CSS tombol
    answers[currentQuestionIndex] = { value: value, idx: idx };
    updateQuestion();

    // === LOGIKA MEMUTAR AUDIO TOMBOL ===
    // Matikan audio opsi lain yang barangkali masih berputar akibat klik sebelumnya
    if (currentOptionAudio) {
        currentOptionAudio.pause();
        currentOptionAudio.currentTime = 0;
    }

    // Panggil file audio sesuai indeks tombol yang diklik (opt0, opt1, opt2, atau opt3)
    currentOptionAudio = new Audio(`assets/optionaudio/opt${idx}.mp3`);
    
    // Putar audionya
    currentOptionAudio.play().catch(error => {
        // Fallback otomatis mencari ekstensi .wav jika file .mp3 tidak ditemukan
        currentOptionAudio = new Audio(`assets/optionaudio/opt${idx}.wav`);
        currentOptionAudio.play().catch(err => console.log("Audio opsi belum disiapkan atau diblokir browser."));
    });
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestion();
    } else {
        submitAssessment();
    }
}

function submitAssessment() {
    // Mengekstrak hanya nilai binernya saja (0 atau 1) untuk dikirim ke Flask
    const binaryAnswersOnly = answers.map(a => a.value);

    const payload = {
        gender: userGender,
        answers: binaryAnswersOnly
    };

    // Menggunakan URL absolut localhost port 5000 menembak API Flask
    fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Mengarahkan ke file HTML lokal di folder yang sama menggunakan Go Live
            if (data.prediction === 1) {
                window.location.href = 'positive.html';   
            } else if (data.prediction === 0) {
                window.location.href = 'negative.html';   
            }
        } else {
            alert("Terjadi kesalahan: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Gagal terhubung dengan server Flask. Pastikan kamu sudah menjalankan 'python app.py' di terminal.");
    });
}

// === LOGIKA AUDIO PERTANYAAN UTAMA ===
function playAudio() {
    const btn = document.getElementById('speakerBtn');
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        btn.classList.remove('playing');
        return;
    }

    const qNumber = currentQuestionIndex + 1;
    currentAudio = new Audio(`assets/questionaudio/Q${qNumber}.mp3`);
    btn.classList.add('playing');

    currentAudio.play().catch(() => {
        currentAudio = new Audio(`assets/questionaudio/Q${qNumber}.wav`);
        currentAudio.play().catch(() => btn.classList.remove('playing'));
        currentAudio.onended = () => btn.classList.remove('playing');
    });

    currentAudio.onended = () => btn.classList.remove('playing');
}

function stopAudio() {
    // Hentikan audio pertanyaan utama
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    // Hentikan audio opsi jawaban agar suara tidak bertabrakan saat ganti soal
    if (currentOptionAudio) {
        currentOptionAudio.pause();
        currentOptionAudio.currentTime = 0;
        currentOptionAudio = null;
    }
    const btn = document.getElementById('speakerBtn');
    if (btn) btn.classList.remove('playing');
}