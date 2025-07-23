// Script untuk memperbaiki data timestamp yang hanya berisi waktu
// Jalankan di console browser setelah membuka dashboard.html

console.log("🔧 FIX TIMESTAMP DATA SCRIPT LOADED");
console.log("=".repeat(60));

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

// Initialize Firebase jika belum
if (!window.firebase) {
  console.log("❌ Firebase SDK tidak tersedia");
} else {
  try {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized");
  } catch (error) {
    console.log("⚠️ Firebase sudah diinisialisasi atau error:", error.message);
  }
}

const db = firebase.database();

// Fungsi untuk memperbaiki timestamp yang hanya berisi waktu
function fixTimeOnlyTimestamp(timestamp) {
  if (typeof timestamp !== 'string') {
    return timestamp; // Bukan string, return as is
  }
  
  // Cek apakah hanya berisi waktu (format HH:MM:SS)
  const timeOnlyRegex = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
  const timeMatch = timestamp.match(timeOnlyRegex);
  
  if (timeMatch) {
    console.log(`🕐 Fixing time-only timestamp: ${timestamp}`);
    const now = new Date();
    const [hours, minutes, seconds] = timeMatch.slice(1);
    
    // Buat timestamp ISO dengan tanggal hari ini dan waktu yang diberikan
    const fixedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    );
    
    const fixedTimestamp = fixedDate.toISOString();
    console.log(`   Fixed to: ${fixedTimestamp}`);
    return fixedTimestamp;
  }
  
  return timestamp; // Tidak perlu diperbaiki
}

// Fungsi untuk scan dan perbaiki semua data
function scanAndFixAllData() {
  console.log("🔍 SCANNING AND FIXING ALL DATA");
  
  db.ref('/').once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      
      if (!data) {
        console.log("❌ Tidak ada data ditemukan");
        return;
      }
      
      let totalFixed = 0;
      let totalRecords = 0;
      
      Object.keys(data).forEach(roomKey => {
        if (roomKey !== 'card_mapping') {
          console.log(`\n🏠 Processing room: ${roomKey}`);
          const room = data[roomKey];
          
          if (room.access_history && room.access_history.access_records) {
            const records = room.access_history.access_records;
            console.log(`  📋 Found ${Object.keys(records).length} access records`);
            
            Object.keys(records).forEach((recordKey) => {
              totalRecords++;
              const record = records[recordKey];
              const originalTimestamp = record.timestamp;
              
              console.log(`\n  📝 Record ${recordKey}:`);
              console.log(`    Original timestamp: ${originalTimestamp}`);
              console.log(`    Type: ${typeof originalTimestamp}`);
              
              // Perbaiki timestamp jika perlu
              const fixedTimestamp = fixTimeOnlyTimestamp(originalTimestamp);
              
              if (fixedTimestamp !== originalTimestamp) {
                console.log(`    ⚠️ Timestamp needs fixing`);
                console.log(`    Fixed timestamp: ${fixedTimestamp}`);
                
                // Update di Firebase
                db.ref(`/${roomKey}/access_history/access_records/${recordKey}/timestamp`).set(fixedTimestamp)
                  .then(() => {
                    console.log(`    ✅ Fixed successfully`);
                    totalFixed++;
                  })
                  .catch((error) => {
                    console.log(`    ❌ Error fixing: ${error.message}`);
                  });
              } else {
                console.log(`    ✅ Timestamp is already correct`);
              }
            });
          } else {
            console.log("  ❌ No access records found");
          }
        }
      });
      
      console.log(`\n📊 SUMMARY:`);
      console.log(`  Total records processed: ${totalRecords}`);
      console.log(`  Total records fixed: ${totalFixed}`);
      console.log(`  Records already correct: ${totalRecords - totalFixed}`);
      
    })
    .catch((error) => {
      console.log("❌ Error accessing data:", error.message);
    });
}

// Fungsi untuk scan dan perbaiki data room tertentu
function scanAndFixRoomData(roomName = 'room1') {
  console.log(`🔍 SCANNING AND FIXING ROOM: ${roomName}`);
  
  db.ref(`/${roomName}`).once('value')
    .then((snapshot) => {
      const roomData = snapshot.val();
      
      if (!roomData) {
        console.log(`❌ Room ${roomName} not found`);
        return;
      }
      
      if (!roomData.access_history || !roomData.access_history.access_records) {
        console.log(`❌ No access records found in ${roomName}`);
        return;
      }
      
      const records = roomData.access_history.access_records;
      console.log(`📋 Found ${Object.keys(records).length} access records`);
      
      let totalFixed = 0;
      let totalRecords = 0;
      
      Object.keys(records).forEach((recordKey) => {
        totalRecords++;
        const record = records[recordKey];
        const originalTimestamp = record.timestamp;
        
        console.log(`\n📝 Record ${recordKey}:`);
        console.log(`  Card ID: ${record.card_id}`);
        console.log(`  Status: ${record.status}`);
        console.log(`  Original timestamp: ${originalTimestamp}`);
        console.log(`  Type: ${typeof originalTimestamp}`);
        
        // Perbaiki timestamp jika perlu
        const fixedTimestamp = fixTimeOnlyTimestamp(originalTimestamp);
        
        if (fixedTimestamp !== originalTimestamp) {
          console.log(`  ⚠️ Timestamp needs fixing`);
          console.log(`  Fixed timestamp: ${fixedTimestamp}`);
          
          // Update di Firebase
          db.ref(`/${roomName}/access_history/access_records/${recordKey}/timestamp`).set(fixedTimestamp)
            .then(() => {
              console.log(`  ✅ Fixed successfully`);
              totalFixed++;
            })
            .catch((error) => {
              console.log(`  ❌ Error fixing: ${error.message}`);
            });
        } else {
          console.log(`  ✅ Timestamp is already correct`);
        }
      });
      
      console.log(`\n📊 SUMMARY for ${roomName}:`);
      console.log(`  Total records processed: ${totalRecords}`);
      console.log(`  Total records fixed: ${totalFixed}`);
      console.log(`  Records already correct: ${totalRecords - totalFixed}`);
      
    })
    .catch((error) => {
      console.log("❌ Error accessing room data:", error.message);
    });
}

// Fungsi untuk preview data yang akan diperbaiki (tanpa mengubah)
function previewDataToFix() {
  console.log("👀 PREVIEWING DATA TO FIX (no changes will be made)");
  
  db.ref('/').once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      
      if (!data) {
        console.log("❌ Tidak ada data ditemukan");
        return;
      }
      
      let totalToFix = 0;
      let totalRecords = 0;
      
      Object.keys(data).forEach(roomKey => {
        if (roomKey !== 'card_mapping') {
          console.log(`\n🏠 Room: ${roomKey}`);
          const room = data[roomKey];
          
          if (room.access_history && room.access_history.access_records) {
            const records = room.access_history.access_records;
            console.log(`  📋 Found ${Object.keys(records).length} access records`);
            
            Object.keys(records).forEach((recordKey) => {
              totalRecords++;
              const record = records[recordKey];
              const originalTimestamp = record.timestamp;
              
              // Cek apakah perlu diperbaiki
              const fixedTimestamp = fixTimeOnlyTimestamp(originalTimestamp);
              
              if (fixedTimestamp !== originalTimestamp) {
                totalToFix++;
                console.log(`  ⚠️ Record ${recordKey} needs fixing:`);
                console.log(`    Card ID: ${record.card_id}`);
                console.log(`    Original: ${originalTimestamp}`);
                console.log(`    Will be fixed to: ${fixedTimestamp}`);
              }
            });
          }
        }
      });
      
      console.log(`\n📊 PREVIEW SUMMARY:`);
      console.log(`  Total records: ${totalRecords}`);
      console.log(`  Records that need fixing: ${totalToFix}`);
      console.log(`  Records already correct: ${totalRecords - totalToFix}`);
      
      if (totalToFix > 0) {
        console.log(`\n💡 To fix the data, run: scanAndFixAllData()`);
      } else {
        console.log(`\n✅ All timestamps are already correct!`);
      }
      
    })
    .catch((error) => {
      console.log("❌ Error accessing data:", error.message);
    });
}

// Export fungsi ke global scope
window.fixTimeOnlyTimestamp = fixTimeOnlyTimestamp;
window.scanAndFixAllData = scanAndFixAllData;
window.scanAndFixRoomData = scanAndFixRoomData;
window.previewDataToFix = previewDataToFix;

console.log("📋 Available functions:");
console.log("  previewDataToFix() // Preview data yang akan diperbaiki");
console.log("  scanAndFixRoomData('room1') // Perbaiki data room tertentu");
console.log("  scanAndFixAllData() // Perbaiki semua data");
console.log("  fixTimeOnlyTimestamp(timestamp) // Perbaiki timestamp tunggal");
console.log("");
console.log("💡 Recommended workflow:");
console.log("  1. previewDataToFix() // Lihat dulu data yang bermasalah");
console.log("  2. scanAndFixAllData() // Perbaiki semua data");
console.log("  3. Refresh dashboard untuk melihat hasil");
console.log("=".repeat(60)); 