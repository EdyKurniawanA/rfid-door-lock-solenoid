// Script debug cepat untuk melihat timestamp dari log yang baru ditambahkan
// Jalankan di console browser setelah membuka dashboard.html

console.log("🔍 QUICK DEBUG SCRIPT LOADED");
console.log("=".repeat(50));

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

// Fungsi untuk melihat log terbaru
function checkLatestLogs() {
  console.log("🔍 CHECKING LATEST LOGS");
  
  db.ref('/room1/access_history/access_records').once('value')
    .then((snapshot) => {
      const logs = snapshot.val();
      
      if (!logs) {
        console.log("❌ Tidak ada log ditemukan");
        return;
      }
      
      const logKeys = Object.keys(logs);
      console.log(`📋 Total logs found: ${logKeys.length}`);
      
      // Ambil 5 log terbaru
      const recentLogs = logKeys.slice(-5);
      
      recentLogs.forEach((key, index) => {
        const log = logs[key];
        console.log(`\n📝 Log ${index + 1} (${key}):`);
        console.log(`  Card ID: ${log.card_id}`);
        console.log(`  Status: ${log.status}`);
        console.log(`  Timestamp:`, log.timestamp);
        console.log(`  Timestamp type:`, typeof log.timestamp);
        
        // Debug timestamp detail
        if (log.timestamp) {
          console.log(`  JSON stringify:`, JSON.stringify(log.timestamp));
          
          if (typeof log.timestamp === 'object') {
            console.log(`  Object keys:`, Object.keys(log.timestamp));
            console.log(`  Has seconds:`, 'seconds' in log.timestamp);
            console.log(`  Has _seconds:`, '_seconds' in log.timestamp);
          }
          
          // Test parsing
          console.log(`  Testing parsing:`);
          try {
            let date;
            if (typeof log.timestamp === 'string') {
              date = new Date(log.timestamp);
              console.log(`    String parsing:`, date);
            } else if (typeof log.timestamp === 'number') {
              date = new Date(log.timestamp);
              console.log(`    Number parsing:`, date);
            } else if (log.timestamp && log.timestamp.seconds !== undefined) {
              date = new Date(log.timestamp.seconds * 1000);
              console.log(`    Firebase seconds parsing:`, date);
            } else if (log.timestamp && log.timestamp._seconds !== undefined) {
              date = new Date(log.timestamp._seconds * 1000);
              console.log(`    Firebase _seconds parsing:`, date);
            } else {
              date = new Date(log.timestamp);
              console.log(`    Generic parsing:`, date);
            }
            
            console.log(`    Is valid:`, !isNaN(date.getTime()));
            if (!isNaN(date.getTime())) {
              console.log(`    toISOString:`, date.toISOString());
              console.log(`    toLocaleString:`, date.toLocaleString('id-ID'));
            }
          } catch (error) {
            console.log(`    Parsing error:`, error.message);
          }
        } else {
          console.log(`  ❌ Timestamp is null/undefined`);
        }
        
        // Test formatTimestamp function jika tersedia
        if (typeof formatTimestamp === 'function') {
          console.log(`  Testing dashboard formatTimestamp:`);
          try {
            const result = formatTimestamp(log.timestamp);
            console.log(`    Result:`, result);
          } catch (error) {
            console.log(`    Error:`, error.message);
          }
        }
        
        console.log(`  ${'-'.repeat(40)}`);
      });
    })
    .catch((error) => {
      console.log("❌ Error accessing logs:", error.message);
    });
}

// Fungsi untuk melihat log dengan ID tertentu
function checkSpecificLog(cardId) {
  console.log(`🔍 CHECKING LOG WITH CARD ID: ${cardId}`);
  
  db.ref('/room1/access_history/access_records').once('value')
    .then((snapshot) => {
      const logs = snapshot.val();
      
      if (!logs) {
        console.log("❌ Tidak ada log ditemukan");
        return;
      }
      
      // Cari log dengan card ID yang spesifik
      Object.keys(logs).forEach((key) => {
        const log = logs[key];
        if (log.card_id === cardId) {
          console.log(`\n📝 Found log (${key}):`);
          console.log(`  Card ID: ${log.card_id}`);
          console.log(`  Status: ${log.status}`);
          console.log(`  Timestamp:`, log.timestamp);
          console.log(`  Timestamp type:`, typeof log.timestamp);
          console.log(`  JSON stringify:`, JSON.stringify(log.timestamp));
          
          // Test parsing detail
          if (log.timestamp) {
            console.log(`  Detailed parsing test:`);
            
            if (typeof log.timestamp === 'object') {
              console.log(`    Object keys:`, Object.keys(log.timestamp));
              console.log(`    Object values:`, Object.values(log.timestamp));
            }
            
            // Test berbagai metode parsing
            const parsingMethods = [
              { name: 'String', test: () => new Date(log.timestamp) },
              { name: 'Number', test: () => new Date(Number(log.timestamp)) },
              { name: 'Firebase seconds', test: () => log.timestamp.seconds ? new Date(log.timestamp.seconds * 1000) : null },
              { name: 'Firebase _seconds', test: () => log.timestamp._seconds ? new Date(log.timestamp._seconds * 1000) : null },
              { name: 'Generic', test: () => new Date(log.timestamp) }
            ];
            
            parsingMethods.forEach(method => {
              try {
                const date = method.test();
                if (date) {
                  console.log(`    ${method.name}:`, date);
                  console.log(`      Valid:`, !isNaN(date.getTime()));
                  if (!isNaN(date.getTime())) {
                    console.log(`      ISO:`, date.toISOString());
                    console.log(`      Locale:`, date.toLocaleString('id-ID'));
                  }
                }
              } catch (error) {
                console.log(`    ${method.name}: Error -`, error.message);
              }
            });
          }
        }
      });
    })
    .catch((error) => {
      console.log("❌ Error accessing logs:", error.message);
    });
}

// Fungsi untuk menambah log test dengan format yang berbeda
function addTestLog(format = 'firebase') {
  console.log(`➕ ADDING TEST LOG WITH FORMAT: ${format}`);
  
  let timestamp;
  let cardId = `test-${format}-${Date.now()}`;
  
  switch(format) {
    case 'iso':
      timestamp = new Date().toISOString();
      break;
    case 'firebase':
      timestamp = {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      };
      break;
    case 'unix':
      timestamp = Date.now();
      break;
    case 'string':
      timestamp = new Date().toString();
      break;
    default:
      timestamp = new Date().toISOString();
  }
  
  console.log(`Timestamp:`, timestamp);
  console.log(`Type:`, typeof timestamp);
  console.log(`Card ID:`, cardId);
  
  const logData = {
    timestamp: timestamp,
    card_id: cardId,
    status: 'granted'
  };
  
  db.ref('/room1/access_history/access_records').push(logData)
    .then(() => {
      console.log(`✅ Test log added successfully`);
      console.log(`🔄 Refresh dashboard to see the result`);
    })
    .catch((error) => {
      console.log(`❌ Error adding test log:`, error.message);
    });
}

// Export fungsi ke global scope
window.checkLatestLogs = checkLatestLogs;
window.checkSpecificLog = checkSpecificLog;
window.addTestLog = addTestLog;

console.log("📋 Available functions:");
console.log("  checkLatestLogs() // Lihat 5 log terbaru");
console.log("  checkSpecificLog('card-id') // Lihat log dengan card ID tertentu");
console.log("  addTestLog('iso') // Tambah log dengan format ISO");
console.log("  addTestLog('firebase') // Tambah log dengan format Firebase");
console.log("  addTestLog('unix') // Tambah log dengan format Unix");
console.log("  addTestLog('string') // Tambah log dengan format String");
console.log("");
console.log("💡 Quick start:");
console.log("  checkLatestLogs() // Lihat log terbaru");
console.log("  checkSpecificLog('test-firebase-1751190335545') // Lihat log spesifik");
console.log("=".repeat(50)); 