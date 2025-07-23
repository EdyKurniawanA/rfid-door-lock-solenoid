// Script untuk menginisialisasi data test dengan timestamp yang benar
// Jalankan script ini di console browser setelah membuka dashboard

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

// Data test untuk room1
const testData = {
  room1: {
    name: "Ruang Kelas 1",
    capacity: 30,
    current_occupancy: 0,
    status: "available",
    access_history: {
      access_records: {
        "test1": {
          timestamp: new Date().toISOString(),
          card_id: "5e487e00",
          status: "granted"
        },
        "test2": {
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 menit yang lalu
          card_id: "5e487e01",
          status: "granted"
        },
        "test3": {
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 menit yang lalu
          card_id: "5e487e02",
          status: "denied"
        },
        "test4": {
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 menit yang lalu
          card_id: "5e487e00",
          status: "granted"
        },
        "test5": {
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 menit yang lalu
          card_id: "5e487e03",
          status: "granted"
        }
      }
    },
    schedule: {
      monday: [
        { start: "08:00", end: "10:00", subject: "Matematika", teacher: "Pak Ahmad" },
        { start: "10:30", end: "12:00", subject: "Fisika", teacher: "Bu Sari" }
      ],
      tuesday: [
        { start: "08:00", end: "09:30", subject: "Kimia", teacher: "Pak Budi" },
        { start: "10:00", end: "11:30", subject: "Biologi", teacher: "Bu Rina" }
      ]
    }
  },
  room2: {
    name: "Ruang Kelas 2",
    capacity: 25,
    current_occupancy: 0,
    status: "available",
    access_history: {
      access_records: {
        "test6": {
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 menit yang lalu
          card_id: "5e487e04",
          status: "granted"
        },
        "test7": {
          timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(), // 7 menit yang lalu
          card_id: "5e487e05",
          status: "granted"
        }
      }
    },
    schedule: {
      monday: [
        { start: "13:00", end: "15:00", subject: "Bahasa Indonesia", teacher: "Bu Dewi" }
      ],
      tuesday: [
        { start: "13:00", end: "14:30", subject: "Bahasa Inggris", teacher: "Mr. John" }
      ]
    }
  }
};

// Data card mapping
const cardMappingData = {
  card_mapping: {
    "5e487e00": "Ahmad Siswanto",
    "5e487e01": "Sari Indah",
    "5e487e02": "Budi Santoso",
    "5e487e03": "Rina Wati",
    "5e487e04": "Dewi Sartika",
    "5e487e05": "John Smith"
  }
};

// Fungsi untuk menginisialisasi data test
function initTestData() {
  console.log("🚀 Memulai inisialisasi data test...");
  
  const db = firebase.database();
  
  // Tambah data ruangan
  db.ref().update(testData)
    .then(() => {
      console.log("✅ Data ruangan berhasil ditambahkan");
      
      // Tambah data card mapping
      return db.ref().update(cardMappingData);
    })
    .then(() => {
      console.log("✅ Data card mapping berhasil ditambahkan");
      console.log("🎉 Inisialisasi data test selesai!");
      console.log("📊 Data yang ditambahkan:");
      console.log("- 2 ruangan dengan jadwal");
      console.log("- 6 log akses dengan timestamp yang benar");
      console.log("- 6 mapping kartu RFID");
      console.log("🔄 Refresh halaman dashboard untuk melihat hasil");
    })
    .catch((error) => {
      console.error("❌ Error saat inisialisasi:", error);
    });
}

// Fungsi untuk membersihkan data test
function clearTestData() {
  console.log("🧹 Memulai pembersihan data test...");
  
  const db = firebase.database();
  
  db.ref().remove()
    .then(() => {
      console.log("✅ Data test berhasil dihapus");
      console.log("🔄 Refresh halaman dashboard");
    })
    .catch((error) => {
      console.error("❌ Error saat menghapus data:", error);
    });
}

// Fungsi untuk menambah log akses test
function addTestAccessLog(roomName, cardId, status) {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp: timestamp,
    card_id: cardId,
    status: status
  };
  
  const db = firebase.database();
  const logRef = db.ref(`/${roomName}/access_history/access_records`);
  
  logRef.push(logData)
    .then(() => {
      console.log(`✅ Log akses berhasil ditambahkan untuk ${roomName}`);
      console.log(`   Timestamp: ${timestamp}`);
      console.log(`   Card ID: ${cardId}`);
      console.log(`   Status: ${status}`);
    })
    .catch((error) => {
      console.error("❌ Error menambah log:", error);
    });
}

// Export fungsi untuk digunakan di console
window.initTestData = initTestData;
window.clearTestData = clearTestData;
window.addTestAccessLog = addTestAccessLog;

console.log("📋 Script test data loaded!");
console.log("Fungsi yang tersedia:");
console.log("- initTestData() : Inisialisasi data test");
console.log("- clearTestData() : Hapus semua data test");
console.log("- addTestAccessLog(room, cardId, status) : Tambah log akses test");
console.log("");
console.log("💡 Contoh penggunaan:");
console.log("initTestData() // Inisialisasi data test");
console.log("addTestAccessLog('room1', '5e487e00', 'granted') // Tambah log akses"); 