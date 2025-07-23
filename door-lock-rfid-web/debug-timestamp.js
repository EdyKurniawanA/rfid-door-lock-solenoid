// Script debug untuk mengidentifikasi masalah timestamp
// Jalankan di console browser setelah membuka dashboard.html

console.log("🔍 DEBUG TIMESTAMP SCRIPT LOADED");
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

// Fungsi untuk debug timestamp dengan detail maksimal
function debugTimestamp(timestamp, context = "") {
  console.log("🔍 DEBUG TIMESTAMP DETAIL");
  console.log("Context:", context);
  console.log("Raw timestamp:", timestamp);
  console.log("Type:", typeof timestamp);
  console.log("Is null:", timestamp === null);
  console.log("Is undefined:", timestamp === undefined);
  console.log("Is object:", typeof timestamp === 'object' && timestamp !== null);
  console.log("Is array:", Array.isArray(timestamp));
  
  if (timestamp !== null && timestamp !== undefined) {
    console.log("String representation:", String(timestamp));
    console.log("JSON stringify:", JSON.stringify(timestamp));
    console.log("JSON stringify (2):", JSON.stringify(timestamp, null, 2));
    
    if (typeof timestamp === 'object') {
      console.log("Object keys:", Object.keys(timestamp));
      console.log("Object values:", Object.values(timestamp));
      console.log("Has seconds property:", 'seconds' in timestamp);
      console.log("Has _seconds property:", '_seconds' in timestamp);
      console.log("Has toDate method:", typeof timestamp.toDate === 'function');
      console.log("Has val method:", typeof timestamp.val === 'function');
    }
  }
  
  console.log("-".repeat(40));
}

// Fungsi untuk test parsing timestamp
function testTimestampParsing(timestamp) {
  console.log("🧪 TESTING TIMESTAMP PARSING");
  console.log("Input:", timestamp);
  console.log("Type:", typeof timestamp);
  
  let date = null;
  let parsingMethod = "none";
  
  try {
    if (typeof timestamp === 'string') {
      parsingMethod = "string";
      date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
      parsingMethod = "number";
      date = new Date(timestamp);
    } else if (timestamp && typeof timestamp === 'object') {
      if (timestamp.seconds !== undefined) {
        parsingMethod = "firebase_seconds";
        date = new Date(timestamp.seconds * 1000);
      } else if (timestamp._seconds !== undefined) {
        parsingMethod = "firebase_underscore_seconds";
        date = new Date(timestamp._seconds * 1000);
      } else if (typeof timestamp.toDate === 'function') {
        parsingMethod = "firestore_timestamp";
        date = timestamp.toDate();
      } else {
        parsingMethod = "generic_object";
        date = new Date(timestamp);
      }
    } else {
      parsingMethod = "generic";
      date = new Date(timestamp);
    }
    
    console.log("Parsing method:", parsingMethod);
    console.log("Date object:", date);
    console.log("Date.getTime():", date.getTime());
    console.log("Is valid (not NaN):", !isNaN(date.getTime()));
    
    if (!isNaN(date.getTime())) {
      try {
        console.log("toISOString():", date.toISOString());
      } catch (e) {
        console.log("toISOString() error:", e.message);
      }
      
      try {
        console.log("toString():", date.toString());
      } catch (e) {
        console.log("toString() error:", e.message);
      }
      
      try {
        console.log("toLocaleString():", date.toLocaleString('id-ID'));
      } catch (e) {
        console.log("toLocaleString() error:", e.message);
      }
    }
    
  } catch (error) {
    console.log("❌ Parsing error:", error.message);
  }
  
  console.log("=".repeat(40));
  return date;
}

// Fungsi untuk melihat semua data dari Firebase
function inspectAllFirebaseData() {
  console.log("📊 INSPECTING ALL FIREBASE DATA");
  
  db.ref('/').once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      console.log("Full Firebase data:", data);
      
      if (data) {
        Object.keys(data).forEach(roomKey => {
          if (roomKey !== 'card_mapping') {
            console.log(`\n🏠 Room: ${roomKey}`);
            const room = data[roomKey];
            
            if (room.access_history && room.access_history.access_records) {
              console.log(`  📋 Access records found: ${Object.keys(room.access_history.access_records).length}`);
              
              Object.keys(room.access_history.access_records).forEach((recordKey, index) => {
                const record = room.access_history.access_records[recordKey];
                console.log(`\n  📝 Record ${index + 1} (${recordKey}):`);
                console.log(`    Card ID: ${record.card_id}`);
                console.log(`    Status: ${record.status}`);
                console.log(`    Timestamp:`, record.timestamp);
                
                // Debug timestamp detail
                debugTimestamp(record.timestamp, `Record ${recordKey}`);
                
                // Test parsing
                testTimestampParsing(record.timestamp);
              });
            } else {
              console.log("  ❌ No access records found");
            }
          }
        });
      } else {
        console.log("❌ No data found in Firebase");
      }
    })
    .catch((error) => {
      console.log("❌ Error accessing Firebase:", error.message);
    });
}

// Fungsi untuk melihat data spesifik room
function inspectRoomData(roomName = 'room1') {
  console.log(`🏠 INSPECTING ROOM: ${roomName}`);
  
  db.ref(`/${roomName}`).once('value')
    .then((snapshot) => {
      const roomData = snapshot.val();
      console.log(`Room ${roomName} data:`, roomData);
      
      if (roomData && roomData.access_history && roomData.access_history.access_records) {
        const records = roomData.access_history.access_records;
        console.log(`\n📋 Found ${Object.keys(records).length} access records`);
        
        Object.keys(records).forEach((key, index) => {
          const record = records[key];
          console.log(`\n📝 Record ${index + 1} (${key}):`);
          console.log(`  Card ID: ${record.card_id}`);
          console.log(`  Status: ${record.status}`);
          console.log(`  Timestamp:`, record.timestamp);
          
          // Debug timestamp detail
          debugTimestamp(record.timestamp, `Record ${key}`);
          
          // Test parsing
          const parsedDate = testTimestampParsing(record.timestamp);
          
          // Test formatTimestamp function dari dashboard
          if (typeof formatTimestamp === 'function') {
            console.log("🎯 Testing dashboard formatTimestamp function:");
            try {
              const result = formatTimestamp(record.timestamp);
              console.log("  Result:", result);
            } catch (error) {
              console.log("  Error:", error.message);
            }
          }
        });
      } else {
        console.log("❌ No access records found in this room");
      }
    })
    .catch((error) => {
      console.log("❌ Error accessing room data:", error.message);
    });
}

// Fungsi untuk menambah data test dengan format yang berbeda
function addTestDataWithDifferentFormats() {
  console.log("➕ ADDING TEST DATA WITH DIFFERENT FORMATS");
  
  const roomName = 'room1';
  const testData = [
    {
      name: "ISO String",
      timestamp: new Date().toISOString(),
      card_id: "test-iso-" + Date.now()
    },
    {
      name: "Firebase Timestamp Object",
      timestamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      },
      card_id: "test-firebase-" + Date.now()
    },
    {
      name: "Unix Timestamp (seconds)",
      timestamp: Math.floor(Date.now() / 1000),
      card_id: "test-unix-sec-" + Date.now()
    },
    {
      name: "Unix Timestamp (milliseconds)",
      timestamp: Date.now(),
      card_id: "test-unix-ms-" + Date.now()
    },
    {
      name: "Date String",
      timestamp: new Date().toString(),
      card_id: "test-date-str-" + Date.now()
    }
  ];
  
  testData.forEach((test, index) => {
    setTimeout(() => {
      console.log(`\n📝 Adding ${test.name} format...`);
      console.log("Timestamp:", test.timestamp);
      console.log("Type:", typeof test.timestamp);
      
      const logData = {
        timestamp: test.timestamp,
        card_id: test.card_id,
        status: 'granted'
      };
      
      db.ref(`/${roomName}/access_history/access_records`).push(logData)
        .then(() => {
          console.log(`✅ ${test.name} added successfully`);
        })
        .catch((error) => {
          console.log(`❌ Error adding ${test.name}:`, error.message);
        });
    }, index * 1000);
  });
}

// Fungsi untuk clear test data
function clearTestData() {
  console.log("🧹 CLEARING TEST DATA");
  
  db.ref('/room1/access_history/access_records').remove()
    .then(() => {
      console.log("✅ Test data cleared");
    })
    .catch((error) => {
      console.log("❌ Error clearing data:", error.message);
    });
}

// Export fungsi ke global scope
window.debugTimestamp = debugTimestamp;
window.testTimestampParsing = testTimestampParsing;
window.inspectAllFirebaseData = inspectAllFirebaseData;
window.inspectRoomData = inspectRoomData;
window.addTestDataWithDifferentFormats = addTestDataWithDifferentFormats;
window.clearTestData = clearTestData;

console.log("📋 Available functions:");
console.log("  debugTimestamp(timestamp, context)");
console.log("  testTimestampParsing(timestamp)");
console.log("  inspectAllFirebaseData()");
console.log("  inspectRoomData(roomName)");
console.log("  addTestDataWithDifferentFormats()");
console.log("  clearTestData()");
console.log("");
console.log("💡 Quick start:");
console.log("  inspectAllFirebaseData() // Lihat semua data");
console.log("  inspectRoomData('room1') // Lihat data room1");
console.log("  addTestDataWithDifferentFormats() // Tambah data test");
console.log("=".repeat(60)); 