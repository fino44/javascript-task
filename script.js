// ===============================
// DATA STUDENT
// ===============================

// Ambil data dari LocalStorage.
// Jika belum ada data, gunakan array kosong.
let students = JSON.parse(localStorage.getItem("students")) || [];

// Menyimpan id siswa yang sedang diedit.
// Nilai null berarti sedang dalam mode tambah.
let editingId = null;


// ===============================
// AMBIL ELEMENT HTML
// ===============================

const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentScore = document.getElementById("studentScore");

const studentList = document.getElementById("studentList");
const totalStudents = document.getElementById("totalStudents");
const averageScore = document.getElementById("averageScore");

const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

const formTitle = document.getElementById("formTitle");
const alertMessage = document.getElementById("alertMessage");


// ===============================
// LOCALSTORAGE
// ===============================

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}


// ===============================
// ALERT / PESAN
// ===============================

function showAlert(message) {
    alertMessage.innerHTML = `<div class="alert">${message}</div>`;

    // Bonus: pesan hilang setelah 3 detik
    setTimeout(function () {
        alertMessage.innerHTML = "";
    }, 3000);
}


// ===============================
// RENDER STUDENT
// ===============================

function renderStudents() {
    studentList.innerHTML = "";

    if (students.length === 0) {
        studentList.innerHTML = `<p class="empty">Belum ada data siswa.</p>`;
        updateStatistics();
        return;
    }

    for (let i = 0; i < students.length; i++) {
        const student = students[i];

        const studentItem = document.createElement("div");
        studentItem.className = "student-item";

        studentItem.innerHTML = `
            <div class="student-info">
                <h3>${i + 1}. ${student.name}</h3>
                <p>Nilai: ${student.score}</p>
            </div>

            <div class="student-buttons">
                <button class="edit-button" onclick="editStudent(${student.id})">
                    ✏️ Ubah
                </button>

                <button class="delete-button" onclick="deleteStudent(${student.id})">
                    🗑️ Hapus
                </button>
            </div>
        `;

        studentList.appendChild(studentItem);
    }

    updateStatistics();
}


// ===============================
// STATISTIK
// ===============================

function updateStatistics() {
    totalStudents.textContent = students.length;

    if (students.length === 0) {
        averageScore.textContent = "0";
        return;
    }

    let totalScore = 0;

    for (let i = 0; i < students.length; i++) {
        totalScore += Number(students[i].score);
    }

    const average = totalScore / students.length;

    averageScore.textContent = average.toFixed(2);
}


// ===============================
// ADD / UPDATE STUDENT
// ===============================

studentForm.addEventListener("submit", function (event) {
    // Mencegah halaman melakukan refresh
    event.preventDefault();

    const name = studentName.value.trim();
    const score = Number(studentScore.value);

    // Validasi nama
    if (name === "") {
        alert("Nama siswa harus diisi.");
        return;
    }

    // Validasi nilai
    if (score < 0 || score > 100 || studentScore.value === "") {
        alert("Nilai harus berada di antara 0 sampai 100.");
        return;
    }

    // Jika editingId masih null, berarti tambah siswa
    if (editingId === null) {
        const newStudent = {
            id: Date.now(),
            name: name,
            score: score
        };

        students.push(newStudent);

        saveStudents();
        renderStudents();

        showAlert(`✅ Data siswa ${name} berhasil ditambahkan.`);

    } else {
        // Jika editingId tidak null, berarti update siswa
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === editingId) {
                students[i].name = name;
                students[i].score = score;
                break;
            }
        }

        saveStudents();
        renderStudents();

        showAlert(`🔄 Data siswa ${name} berhasil diperbarui.`);
    }

    resetForm();
});


// ===============================
// EDIT STUDENT
// ===============================

function editStudent(id) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            studentName.value = students[i].name;
            studentScore.value = students[i].score;

            editingId = id;

            formTitle.textContent = "Edit Siswa";
            submitButton.textContent = "💾 Update Siswa";
            cancelButton.style.display = "block";

            // Scroll ke form agar mudah diedit
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            break;
        }
    }
}


// ===============================
// DELETE STUDENT
// ===============================

function deleteStudent(id) {
    let studentNameToDelete = "";

    // Cari nama siswa berdasarkan id
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            studentNameToDelete = students[i].name;
            break;
        }
    }

    // Confirm sebelum menghapus
    const confirmation = confirm(
        `Apakah kamu yakin ingin menghapus siswa ${studentNameToDelete}?`
    );

    // Jika Cancel, jangan lakukan apa-apa
    if (!confirmation) {
        return;
    }

    // Hapus student berdasarkan id
    students = students.filter(function (student) {
        return student.id !== id;
    });

    saveStudents();
    renderStudents();

    showAlert(`🗑️ Data siswa ${studentNameToDelete} berhasil dihapus.`);

    // Jika siswa yang dihapus sedang diedit
    if (editingId === id) {
        resetForm();
    }
}


// ===============================
// RESET FORM
// ===============================

function resetForm() {
    studentForm.reset();

    editingId = null;

    formTitle.textContent = "Tambah Siswa";
    submitButton.textContent = "➕ Tambah Siswa";
    cancelButton.style.display = "none";
}


// Tombol Batal Edit
cancelButton.addEventListener("click", function () {
    resetForm();
});


// ===============================
// PROGRAM DIJALANKAN SAAT HALAMAN DIBUKA
// ===============================

renderStudents();
