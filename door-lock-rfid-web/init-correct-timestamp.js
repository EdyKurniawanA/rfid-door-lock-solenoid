// Script untuk menambahkan data test dengan timestamp yang benar
// Jalankan di console browser setelah membuka dashboard.html

// Firebase configuration (copy dari dashboard.js)
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
const db = firebase.database();

// Fungsi untuk menambah log dengan timestamp yang benar
function addTestLog(roomName, cardId, status, timestampFormat = 'iso') {
  let timestamp;
  
  switch(timestampFormat) {
    case 'iso':
      timestamp = new Date().toISOString();
      break;
    case 'firebase':
      timestamp = {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      };
      break;
    case 'firebase_underscore':
      timestamp = {
        _seconds: Math.floor(Date.now() / 1000),
        _nanoseconds: 0
      };
      break;
    case 'unix_seconds':
      timestamp = Math.floor(Date.now() / 1000);
      break;
    case 'unix_milliseconds':
      timestamp = Date.now();
      break;
    case 'date_string':
      timestamp = new Date().toLocaleString('id-ID');
      break;
    default:
      timestamp = new Date().toISOString();
  }
  
  const logData = {
    timestamp: timestamp,
    card_id: cardId,
    status: status
  };
  
  console.log(`📝 Menambah log untuk ${roomName} dengan format ${timestampFormat}:`);
  console.log('   Timestamp:', timestamp);
  console.log('   Type:', typeof timestamp);
  console.log('   JSON:', JSON.stringify(timestamp));
  
  const logRef = db.ref(`/${roomName}/access_history/access_records`);
  
  return logRef.push(logData)
    .then(() => {
      console.log('✅ Log berhasil ditambahkan!');
      return true;
    })
    .catch((error) => {
      console.log(`❌ Error: ${error.message}`);
      return false;
    });
}

// Fungsi untuk menambah multiple test logs dengan berbagai format
function addMultipleTestLogs() {
  const roomName = 'room1';
  const cardId = 'test-card-123';
  const status = 'granted';
  
  console.log('🚀 Menambah multiple test logs dengan berbagai format timestamp...');
  
  const formats = ['iso', 'firebase', 'firebase_underscore', 'unix_seconds', 'unix_milliseconds', 'date_string'];
  
  let promises = [];
  
  formats.forEach((format, index) => {
    // Delay setiap log 1 detik
    setTimeout(() => {
      addTestLog(roomName, cardId, status, format);
    }, index * 1000);
  });
  
  console.log('⏳ Menunggu semua log selesai...');
}

// Fungsi untuk menambah log dengan timestamp custom
function addCustomTimestampLog(roomName, cardId, status, customTimestamp) {
  const logData = {
    timestamp: customTimestamp,
    card_id: cardId,
    status: status
  };
  
  console.log(`📝 Menambah log dengan timestamp custom untuk ${roomName}:`);
  console.log('   Timestamp:', customTimestamp);
  console.log('   Type:', typeof customTimestamp);
  console.log('   JSON:', JSON.stringify(customTimestamp));
  
  const logRef = db.ref(`/${roomName}/access_history/access_records`);
  
  return logRef.push(logData)
    .then(() => {
      console.log('✅ Log custom berhasil ditambahkan!');
      return true;
    })
    .catch((error) => {
      console.log(`❌ Error: ${error.message}`);
      return false;
    });
}

// Fungsi untuk membersihkan semua log test
function clearTestLogs() {
  console.log('🧹 Membersihkan semua log test...');
  
  const logRef = db.ref('/room1/access_history/access_records');
  
  return logRef.remove()
    .then(() => {
      console.log('✅ Semua log test berhasil dihapus!');
      return true;
    })
    .catch((error) => {
      console.log(`❌ Error: ${error.message}`);
      return false;
    });
}

// Fungsi untuk melihat semua log yang ada
function viewAllLogs() {
  console.log('📋 Mengambil semua log dari Firebase...');
  
  const logRef = db.ref('/room1/access_history/access_records');
  
  return logRef.once('value')
    .then((snapshot) => {
      const logs = snapshot.val();
      console.log('📊 Semua log yang ada:');
      
      if (!logs) {
        console.log('   Tidak ada log');
        return;
      }
      
      Object.keys(logs).forEach((key, index) => {
        const log = logs[key];
        console.log(`   Log ${index + 1} (${key}):`);
        console.log(`     Timestamp: ${log.timestamp}`);
        console.log(`     Type: ${typeof log.timestamp}`);
        console.log(`     Card ID: ${log.card_id}`);
        console.log(`     Status: ${log.status}`);
        console.log(`     JSON: ${JSON.stringify(log.timestamp)}`);
        console.log('');
      });
    })
    .catch((error) => {
      console.log(`❌ Error: ${error.message}`);
    });
}

// Fungsi untuk test format timestamp
function testTimestampFormat(timestamp) {
  console.log('🔍 Testing format timestamp:');
  console.log('   Input:', timestamp);
  console.log('   Type:', typeof timestamp);
  console.log('   JSON:', JSON.stringify(timestamp));
  
  let date;
  
  try {
    if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (timestamp && timestamp.seconds !== undefined) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp && timestamp._seconds !== undefined) {
      date = new Date(timestamp._seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) {
      console.log('   ❌ Timestamp tidak valid');
      return false;
    } else {
      console.log('   ✅ Timestamp valid:', date.toISOString());
      return true;
    }
  } catch (error) {
    console.log('   ❌ Error parsing:', error.message);
    return false;
  }
}

// Export fungsi ke global scope
window.addTestLog = addTestLog;
window.addMultipleTestLogs = addMultipleTestLogs;
window.addCustomTimestampLog = addCustomTimestampLog;
window.clearTestLogs = clearTestLogs;
window.viewAllLogs = viewAllLogs;
window.testTimestampFormat = testTimestampFormat;

console.log('🚀 Script init-correct-timestamp.js loaded!');
console.log('📋 Fungsi yang tersedia:');
console.log('   addTestLog(roomName, cardId, status, format)');
console.log('   addMultipleTestLogs()');
console.log('   addCustomTimestampLog(roomName, cardId, status, customTimestamp)');
console.log('   clearTestLogs()');
console.log('   viewAllLogs()');
console.log('   testTimestampFormat(timestamp)');
console.log('');
console.log('💡 Contoh penggunaan:');
console.log('   addTestLog("room1", "card123", "granted", "iso")');
console.log('   addMultipleTestLogs()');
console.log('   viewAllLogs()'); 