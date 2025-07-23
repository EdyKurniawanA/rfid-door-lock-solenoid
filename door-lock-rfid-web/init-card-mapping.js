// Script untuk menginisialisasi mapping kartu RFID di Firebase
// Jalankan script ini sekali untuk setup awal

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbJXnRwSGreNGDtP9L7fHx6WUwncMYA9M",
  authDomain: "monitoring-ruang-kelas.firebaseapp.com",
  databaseURL: "https://monitoring-ruang-kelas-default-rtdb.firebaseio.com",
  projectId: "monitoring-ruang-kelas",
  storageBucket: "monitoring-ruang-kelas.firebasestorage.app",
  messagingSenderId: "811142630328",
  appId: "1:811142630328:web:2be668fbe63c372c1a5d4d",
  measurementId: "G-GTE9ZMV222"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Data mapping kartu RFID ke nama pengguna
const initialCardMapping = {
  // Contoh data - sesuaikan dengan ID kartu RFID yang Anda miliki
  "5e487e00": "Pak syukri",
  "9abc7900": "Pak syam", 
  "d4a71e85": "Ibu Kartika",
  "6da3341f": "Pak Rijal", 
  // Tambahkan mapping lainnya sesuai kebutuhan
};

// Fungsi untuk menginisialisasi mapping kartu
function initializeCardMapping() {
  const db = firebase.database();
  const cardMappingRef = db.ref('/card_mapping');
  
  console.log("Memulai inisialisasi mapping kartu...");
  
  cardMappingRef.set(initialCardMapping)
    .then(() => {
      console.log("✅ Mapping kartu berhasil diinisialisasi!");
      console.log("Data yang ditambahkan:", initialCardMapping);
    })
    .catch((error) => {
      console.error("❌ Error saat inisialisasi mapping kartu:", error);
    });
}

// Fungsi untuk menambah kartu baru
function addCard(cardId, userName) {
  const db = firebase.database();
  const cardMappingRef = db.ref('/card_mapping');
  
  cardMappingRef.child(cardId).set(userName)
    .then(() => {
      console.log(`✅ Kartu ${cardId} berhasil ditambahkan untuk ${userName}`);
    })
    .catch((error) => {
      console.error(`❌ Error menambah kartu ${cardId}:`, error);
    });
}

// Fungsi untuk melihat semua mapping kartu
function viewAllCards() {
  const db = firebase.database();
  const cardMappingRef = db.ref('/card_mapping');
  
  cardMappingRef.once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log("📋 Daftar semua kartu terdaftar:");
        Object.keys(data).forEach(cardId => {
          console.log(`  ${cardId}: ${data[cardId]}`);
        });
      } else {
        console.log("📋 Belum ada kartu terdaftar");
      }
    })
    .catch((error) => {
      console.error("❌ Error mengambil data kartu:", error);
    });
}

// Export fungsi untuk digunakan di console browser
window.initializeCardMapping = initializeCardMapping;
window.addCard = addCard;
window.viewAllCards = viewAllCards;

console.log("🚀 Script inisialisasi kartu RFID siap!");
console.log("Gunakan fungsi berikut di console:");
console.log("- initializeCardMapping() - untuk setup awal");
console.log("- addCard('ID_KARTU', 'Nama Pengguna') - untuk menambah kartu baru");
console.log("- viewAllCards() - untuk melihat semua kartu terdaftar"); 