// Cek status autentikasi
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    // Jika user belum login, redirect ke halaman login
    window.location.href = "index.html";
  }
});

// Mengambil data dari Firebase
const db = firebase.database();
const roomsRef = db.ref('/'); // Referensi ke root database
const cardMappingRef = db.ref('/card_mapping'); // Referensi untuk mapping kartu

let roomsData = {}; // Objek untuk menyimpan data ruangan
let cardIdToName = {}; // Objek untuk menyimpan mapping ID card ke nama

// Konstanta untuk kartu master
const MASTER_CARDS = {
  "PAK_SYAM": "Pak Syam",
  "PAK_SYUKRI": "Pak Syukri",
  "DINA_DESRIANI": "Dina Desriani",
  "RUMAH_TANGGA": "Rumah Tangga"
};

// Fungsi untuk mengecek apakah kartu adalah kartu master
function isMasterCard(cardId) {
  if (!cardId) return false;
  
  // Cek berdasarkan card ID langsung
  if (Object.keys(MASTER_CARDS).includes(cardId)) {
    return true;
  }
  
  // Cek berdasarkan nama dari card mapping
  const cardName = getNameFromCardId(cardId);
  return Object.values(MASTER_CARDS).includes(cardName);
}

// Fungsi untuk mendapatkan nama dari kartu master
function getMasterCardName(cardId) {
  return MASTER_CARDS[cardId] || null;
}

// Fungsi untuk mendapatkan nama berdasarkan ID card
function getNameFromCardId(cardId) {
  // Cek apakah ini kartu master
  const masterName = getMasterCardName(cardId);
  if (masterName) {
    return masterName;
  }
  
  // Jika bukan kartu master, gunakan mapping biasa
  return cardIdToName[cardId] || cardId;
}

// Fungsi untuk menambah mapping ID card baru ke Firebase
function addCardMapping(cardId, userName) {
  cardMappingRef.child(cardId).set(userName)
    .then(() => {
      console.log(`Mapping kartu ${cardId} berhasil ditambahkan`);
      // Refresh daftar kartu
      displayCardMappings();
    })
    .catch((error) => {
      console.error("Error menambah mapping kartu:", error);
    });
}

// Fungsi untuk menghapus mapping ID card dari Firebase
function removeCardMapping(cardId) {
  if (confirm(`Apakah Anda yakin ingin menghapus kartu ${cardId}?`)) {
    cardMappingRef.child(cardId).remove()
      .then(() => {
        console.log(`Mapping kartu ${cardId} berhasil dihapus`);
        // Refresh daftar kartu
        displayCardMappings();
      })
      .catch((error) => {
        console.error("Error menghapus mapping kartu:", error);
      });
  }
}

// Load mapping kartu dari Firebase
cardMappingRef.on('value', (snapshot) => {
  try {
    const data = snapshot.val();
    if (data) {
      cardIdToName = data;
      // Refresh log untuk menampilkan nama baru
      if (roomsData) {
        renderAccessLogs();
      }
      // Refresh daftar kartu
      displayCardMappings();
    } else {
      cardIdToName = {};
      // Refresh daftar kartu
      displayCardMappings();
    }
  } catch (error) {
    console.error("Error saat memproses mapping kartu:", error);
  }
});

roomsRef.on('value', (snapshot) => {
  try {
    const data = snapshot.val();
    if (data) {
      roomsData = data;
      renderRoomCards();
      updateRoomDropdowns();
      renderAccessLogs();
      const selectedRoom = document.getElementById("select-room").value;
      if (selectedRoom) {
        updateRosterTable(selectedRoom);
      }
    } else {
      roomsData = {};
      renderRoomCards();
      updateRoomDropdowns();
      renderAccessLogs();
    }
  } catch (error) {
    console.error("Error saat memproses data Firebase:", error);
  }
});

console.log(roomsData);

// Render kartu ruangan
function renderRoomCards() {
  const container = document.getElementById("room-cards");
  container.innerHTML = "";
  for (const room in roomsData) {
    // Skip card_mapping - hanya tampilkan ruangan yang sebenarnya
    if (room === 'card_mapping') continue;
    
    const data = roomsData[room];
    const card = document.createElement("div");
    card.className = "room-card";
    card.dataset.room = room;

    let statusText = "Tidak Digunakan";
    let statusClass = "free";
    let currentUser = "";

    if (data.access_history && data.access_history.access_records) {
      const accessRecords = Array.isArray(data.access_history.access_records)
        ? data.access_history.access_records
        : Object.values(data.access_history.access_records);

      const validRecords = accessRecords.filter(r => r && r.timestamp);

      if (validRecords.length > 0) {
        // Temukan catatan akses terbaru
        const lastRecord = validRecords.reduce((latest, current) => {
          return new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current;
        });

        if (lastRecord.status === 'granted') {
          const cardId = lastRecord.card_id;
          const userName = getNameFromCardId(cardId);
          // Cek apakah ini kartu master atau Rumah Tangga
          if (
            isMasterCard(cardId) ||
            userName === 'Syukri, S.T.,M.T' ||
            userName === 'Syamruddin, S.T.,M.T' ||
            userName === 'Rumah Tangga'
          ) {
            currentUser = '';
          } else {
            currentUser = userName;
          }
          statusText = currentUser ? "Digunakan" : "Tidak Digunakan";
          statusClass = currentUser ? "used" : "free";
        } else {
          statusText = "Akses Ditolak";
          statusClass = "denied";
        }
      }
    }

    card.innerHTML = `
      <h3>${getRoomDisplayName(room)}</h3>
      <p>Status: <span class="status ${statusClass}">${statusText}</span></p>
      ${currentUser ? `<p>Digunakan oleh: <span class="current-user">${currentUser}</span></p>` : ''}
    `;

    card.addEventListener("click", () => showRoomDetail(room, data));
    container.appendChild(card);
  }
}

// Tampilkan modal detail ruangan
function showRoomDetail(room, data) {
  document.getElementById("modal-ruang-name").textContent = getRoomDisplayName(room);

  // Ambil data tap RFID terakhir untuk status ruangan
  let currentUser = "-";
  let currentTime = "-";
  
  if (data.access_history && data.access_history.access_records) {
    const accessRecords = Array.isArray(data.access_history.access_records)
      ? data.access_history.access_records
      : Object.values(data.access_history.access_records);

    const validRecords = accessRecords.filter(r => r && r.timestamp);

    if (validRecords.length > 0) {
      // Temukan catatan akses terbaru
      const lastRecord = validRecords.reduce((latest, current) => {
        return new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current;
      });

      const userName = getNameFromCardId(lastRecord.card_id);
      // Jika granted dan user master, JANGAN tampilkan modal sama sekali
      if (
        lastRecord.status === 'granted' && (
          isMasterCard(lastRecord.card_id) ||
          userName === 'Syukri, S.T.,M.T' ||
          userName === 'Syamruddin, S.T.,M.T' ||
          userName === 'Rumah Tangga' ||
          userName === 'Dina Desriani'
        )
      ) {
        return;
      }
      // Jika granted dan bukan master, tampilkan data ruangan seperti biasa
      if (lastRecord.status === 'granted') {
        currentUser = userName;
        currentTime = formatTimestamp(lastRecord.timestamp);
        document.getElementById("modal-status-ruangan").innerHTML = '<span style="color:green;font-weight:bold;">Status: Ruangan sedang digunakan</span>';
      } else {
        // Jika denied dan user bukan master, tampilkan info akses ditolak
        currentUser = "Akses Ditolak";
        currentTime = formatTimestamp(lastRecord.timestamp);
        document.getElementById("modal-status-ruangan").innerHTML = '<span style="color:#b30000;font-weight:bold;">Status: Ruangan tidak digunakan</span>';
      }
    }
  }

  // Tampilkan data realtime dari Firebase
  document.getElementById("modal-dosen").textContent = currentUser;
  document.getElementById("modal-waktu").textContent = currentTime;

  // Sembunyikan status ruangan jika akses bukan denied
  if (!document.getElementById("modal-status-ruangan").innerHTML) {
    document.getElementById("modal-status-ruangan").innerHTML = '';
  }

  // Status PIR - data realtime
  const pirStatus = data.sensor_pir?.motion_detected ? "Gerakan Terdeteksi" : "Tidak Ada Gerakan";
  document.getElementById("modal-pir-status").textContent = pirStatus;

  // Status Pintu - data realtime
  const doorStatus = data.door_status?.solenoid_locked ? "Terkunci" : "Terbuka";
  document.getElementById("modal-door-status").textContent = doorStatus;

  // Tampilkan modal
  document.getElementById("modal-detail").style.display = "block";
}

// Fungsi untuk mendapatkan jadwal aktif saat ini
function getCurrentSchedule(schedule) {
  if (!schedule || !Array.isArray(schedule)) return null;
  
  const currentTime = getCurrentLocalTime();

  return schedule.find(jadwal => {
    if (!jadwal || !jadwal.day) return false;
    
    // Cek apakah hari ini
    if (jadwal.day.toLowerCase() !== currentTime.day.toLowerCase()) return false;
    
    // Cek apakah waktu saat ini berada dalam rentang jadwal
    if (jadwal.start_time && jadwal.end_time) {
      return currentTime.time >= jadwal.start_time && currentTime.time <= jadwal.end_time;
        }
    
    return false;
  });
}

// Tutup modal
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("modal-detail").style.display = "none";
});

// Logout button
document.getElementById("btn-logout").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html"; // arahkan ke halaman login
  }).catch((error) => {
    console.error("Logout error:", error);
  });
});

// Render daftar ruangan di dropdown roster
function renderRosterDropdown() {
  const select = document.getElementById("select-room");
  if (!select) return;
  
  select.innerHTML = '<option value="">Pilih Ruangan</option>';
  for (const room in roomsData) {
    // Skip card_mapping - hanya tampilkan ruangan yang sebenarnya
    if (room === 'card_mapping') continue;
    
    const option = document.createElement("option");
    option.value = room;
    option.textContent = getRoomDisplayName(room);
    select.appendChild(option);
  }
}

// Fungsi untuk memperbarui tabel roster
function updateRosterTable(room) {
  console.log('updateRosterTable room:', room);
  console.log('roomsData:', roomsData);
  const tbody = document.querySelector("#roster-table tbody");
  const rosterCount = document.getElementById("roster-count");
  
  if (!tbody) return;
  
  tbody.innerHTML = "";

  if (!room || !roomsData[room] || !roomsData[room].schedule) {
    console.log('Tidak ada schedule untuk room:', room, roomsData[room]);
    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-roster">
            <h4>Tidak ada jadwal</h4>
            <p>${room ? `Belum ada jadwal untuk ruangan ${room}` : 'Pilih ruangan untuk melihat jadwal'}</p>
          </div>
        </td>
      </tr>
    `;
    if (rosterCount) rosterCount.textContent = '0';
    return;
  }

  const schedule = roomsData[room].schedule || [];
  console.log('schedule:', schedule);
  // Ubah objek jadwal menjadi array jika perlu
  const scheduleArray = Array.isArray(schedule) ? schedule : Object.values(schedule);

  // Filter jadwal yang valid dan bukan dosen Syukri atau Syamruddin atau master card
  const validSchedules = scheduleArray.filter(jadwal => {
    if (!jadwal || !jadwal.day || !jadwal.lecturer) return false;
    // Jika semua dosen di jadwal adalah master card, JANGAN tampilkan baris ini
    if (Array.isArray(jadwal.lecturer)) {
      return !jadwal.lecturer.every(dosen => {
        const name = (dosen.name||'').trim();
        return ['Syukri, S.T.,M.T', 'Syamruddin, S.T.,M.T', 'Rumah Tangga'].includes(name) || Object.values(MASTER_CARDS).includes(name);
      });
    } else if (typeof jadwal.lecturer === 'string') {
      const name = jadwal.lecturer.trim();
      return !(['Syukri, S.T.,M.T', 'Syamruddin, S.T.,M.T', 'Rumah Tangga'].includes(name) || Object.values(MASTER_CARDS).includes(name));
    }
    return false;
  });
  
  if (validSchedules.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-roster">
            <h4>Tidak ada jadwal</h4>
            <p>Belum ada jadwal untuk ruangan ${room}</p>
          </div>
        </td>
      </tr>
    `;
    if (rosterCount) rosterCount.textContent = '0';
    return;
  }

  // Update roster count
  if (rosterCount) rosterCount.textContent = validSchedules.length;

  // Dapatkan jadwal aktif saat ini
  const currentSchedule = getCurrentSchedule(scheduleArray);
  const currentTime = getCurrentLocalTime();

  tbody.innerHTML = ""; // Kosongkan tbody sebelum render

  // Urutan hari Senin-Minggu
  const dayOrder = ['senin','selasa','rabu','kamis','jumat','sabtu','minggu'];
  // Sort validSchedules by day order
  validSchedules.sort((a, b) => {
    const aDay = (a.day || '').toLowerCase();
    const bDay = (b.day || '').toLowerCase();
    const aIdx = dayOrder.indexOf(aDay);
    const bIdx = dayOrder.indexOf(bDay);
    if (aIdx === -1 && bIdx === -1) return 0;
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  validSchedules.forEach((jadwal, index) => {
    if (!jadwal) return; // Lewati entri yang null/undefined
    const tr = document.createElement("tr");
    // Highlight jika hari pada jadwal sama dengan hari ini
    const isCurrent = jadwal.day && jadwal.day.toLowerCase() === getCurrentLocalTime().day.toLowerCase();
    if (isCurrent) {
      tr.classList.add('current');
    }
    // Format waktu dengan class yang sesuai
    const startTimeClass = jadwal.start_time ? 'roster-time start' : '';
    const endTimeClass = jadwal.end_time ? 'roster-time end' : '';
    // Sembunyikan dosen master
    let lecturerDisplay = '-';
    if (Array.isArray(jadwal.lecturer)) {
      if (jadwal.lecturer.length > 0 && typeof jadwal.lecturer[0] === 'string') {
        // lecturer berupa array string
        lecturerDisplay = jadwal.lecturer.join('<br>');
      } else {
        // Gabungkan nama dosen kecuali master/rumah tangga dan kartu master (array of object)
        const filtered = jadwal.lecturer.filter(dosen => {
          const name = (dosen.name||'').trim();
          return !['Syukri, S.T.,M.T', 'Syamruddin, S.T.,M.T', 'Rumah Tangga'].includes(name) && !Object.values(MASTER_CARDS).includes(name);
        });
        lecturerDisplay = filtered.length > 0 ? filtered.map(d => d.name).join('<br>') : '-';
      }
    } else if (typeof jadwal.lecturer === 'string') {
      const name = jadwal.lecturer.trim();
      if (!['Syukri, S.T.,M.T', 'Syamruddin, S.T.,M.T', 'Rumah Tangga'].includes(name) && !Object.values(MASTER_CARDS).includes(name)) {
        lecturerDisplay = name;
      }
    }
    tr.innerHTML = `
      <td class="roster-day">${jadwal.day || '-'}</td>
      <td><span class="${startTimeClass}">${jadwal.start_time || '-'}</span></td>
      <td><span class="${endTimeClass}">${jadwal.end_time || '-'}</span></td>
      <td>${jadwal.matkul || '-'}</td>
      <td>${jadwal.kelas || '-'}</td>
      <td class="roster-lecturer">${lecturerDisplay}</td>
      <td>
        <div class="aksi-btn-group">
          <button class="btn btn-primary btn-small" style="padding:4px 10px;font-size:12px;" onclick='openRescheduleModal("${room}", "${jadwal.id}", ${JSON.stringify(jadwal).replace(/"/g, "&quot;")})'>Reschedule</button>
          <button class="btn btn-danger btn-small" style="padding:4px 10px;font-size:12px; margin-top:4px;" onclick='deleteRosterSchedule("${room}", "${jadwal.id}")'>Hapus</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Fungsi hapus jadwal roster
function deleteRosterSchedule(room, jadwalId) {
  if (!confirm('Yakin ingin menghapus jadwal ini?')) return;
  const schedule = roomsData[room].schedule || [];
  const scheduleArray = Array.isArray(schedule) ? schedule : Object.values(schedule);
  const index = scheduleArray.findIndex(j => j.id == jadwalId);
  if (index === -1) {
    alert('Jadwal tidak ditemukan!');
    return;
  }
  scheduleArray.splice(index, 1);
  firebase.database().ref(`${room}/schedule`).set(scheduleArray)
    .then(() => {
      alert('Jadwal berhasil dihapus!');
      // Ambil ulang data dari Firebase sebelum update tampilan
      firebase.database().ref('/').once('value').then(snapshot => {
        roomsData = snapshot.val();
        updateRosterTable(room);
      });
    }).catch((error) => {
      alert('Gagal menghapus jadwal: ' + error.message);
    });
}

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
  // Initialize Firebase listeners
  // initializeFirebaseListeners && initializeFirebaseListeners();
  // Mulai update waktu real-time
  startTimeUpdate && startTimeUpdate();
  
  // Event listener untuk logout
  //document.getElementById("btn-logout").addEventListener("click", logout);
  
  // Event listener untuk close modal
  document.getElementById("close-modal").addEventListener("click", function() {
    document.getElementById("modal-detail").style.display = "none";
  });
  
  // Event listener untuk filter roster
  document.getElementById("select-room").addEventListener("change", function() {
    updateRosterTable(this.value);
  });
  
  // Event listener untuk filter log
  document.getElementById("log-room-select").addEventListener("change", function() {
    renderAccessLogs();
  });
  
  // Event listener untuk refresh log
  document.getElementById("refresh-log").addEventListener("click", function() {
    this.classList.add('rotating');
    renderAccessLogs();
    setTimeout(() => {
      this.classList.remove('rotating');
    }, 1000);
  });
  
  // Close modal when clicking outside
  window.addEventListener("click", function(event) {
    const modal = document.getElementById("modal-detail");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
  
  // Tampilkan daftar kartu saat halaman dimuat
  setTimeout(() => {
    displayCardMappings && displayCardMappings();
  }, 100);

  // Aktifkan kembali loadStaticRoster untuk fallback ke file statis jika data Firebase kosong
  setTimeout(() => {
    if (!roomsData || Object.keys(roomsData).length === 0) {
      loadStaticRoster();
    }
  }, 1000);
});

// Data statis awal kartu RFID
let cardMappings = {
  "5e487e00": "Ahmad Siswanto",
  "5e487e01": "Sari Indah",
  "5e487e02": "Budi Santoso",
  "5e487e03": "Rina Wati"
};
// Cek localStorage untuk data tambahan
if (localStorage.getItem('cardMappings')) {
  cardMappings = JSON.parse(localStorage.getItem('cardMappings'));
}

// Fungsi untuk menampilkan daftar kartu RFID
function displayCardMappings() {
  const container = document.getElementById('card-list-container');
  const cardCount = document.getElementById('card-count');
  const cardIds = Object.keys(cardMappings);
  cardCount.textContent = cardIds.length;
  let html = '';
  cardIds.forEach(cardId => {
    const userName = cardMappings[cardId];
    html += `
      <div class="card-item" data-card-id="${cardId}" data-card-name="${userName}">
        <div class="card-info">
          <div class="card-id">${cardId}</div>
          <div class="card-name">${userName}</div>
          <div class="card-actions">
            <button class="btn btn-danger btn-small" onclick="deleteCard('${cardId}')">🗑️ Hapus</button>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// Fungsi untuk menambah kartu RFID
function addCard() {
  const cardId = document.getElementById('card-id').value.trim();
  const cardName = document.getElementById('card-name').value.trim();
  if (!cardId || !cardName) {
    showNotification('Mohon isi ID kartu dan nama pemilik', 'error');
    return;
  }
  if (!/^[a-zA-Z0-9]+$/.test(cardId)) {
    showNotification('ID kartu hanya boleh berisi huruf dan angka', 'error');
    return;
  }
  if (cardMappings[cardId]) {
    showNotification('Kartu dengan ID tersebut sudah terdaftar', 'error');
    return;
  }
  cardMappings[cardId] = cardName;
  localStorage.setItem('cardMappings', JSON.stringify(cardMappings));
  addCardMapping(cardId, cardName);
  showNotification(`Kartu ${cardId} berhasil ditambahkan untuk ${cardName}`, 'success');
  document.getElementById('card-id').value = '';
  document.getElementById('card-name').value = '';
  document.getElementById('card-id').focus();
  displayCardMappings();
}

// Fungsi untuk mencari kartu
function filterCards() {
  const searchTerm = document.getElementById('card-search').value.toLowerCase();
  const cardItems = document.querySelectorAll('.card-item');
  cardItems.forEach(item => {
    const cardId = item.getAttribute('data-card-id').toLowerCase();
    const cardName = item.getAttribute('data-card-name').toLowerCase();
    if (cardId.includes(searchTerm) || cardName.includes(searchTerm)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  // Update counter untuk kartu yang ditampilkan
  const visibleCards = document.querySelectorAll('.card-item[style="display: block"], .card-item:not([style*="display: none"])');
  const cardCount = document.getElementById('card-count');
  if (searchTerm) {
    cardCount.textContent = `${visibleCards.length} dari ${document.querySelectorAll('.card-item').length}`;
  } else {
    const totalCards = document.querySelectorAll('.card-item').length;
    cardCount.textContent = totalCards;
  }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
  // Hapus notifikasi lama
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
      }

  // Buat notifikasi baru
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: inherit; cursor: pointer; font-size: 18px;">×</button>
  `;
  
  // Tambahkan ke card management section
  const cardManagement = document.querySelector('.card-management');
  cardManagement.insertBefore(notification, cardManagement.firstChild);
  
  // Auto remove setelah 5 detik
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Event listeners untuk form
document.addEventListener('DOMContentLoaded', function() {
  // Enter key untuk form
  const cardIdInput = document.getElementById('card-id');
  const cardNameInput = document.getElementById('card-name');
  
  if (cardIdInput && cardNameInput) {
    cardIdInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        cardNameInput.focus();
      }
    });
    
    cardNameInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addCard();
      }
    });
  }
  
  // Focus ke input pertama
  if (cardIdInput) {
    cardIdInput.focus();
  }
  
  // Tampilkan daftar kartu saat halaman dimuat
  setTimeout(() => {
    displayCardMappings();
  }, 100);
});

// Fungsi untuk menampilkan notifikasi kartu yang belum terdaftar
function showUnregisteredCardsNotification(unregisteredCards) {
  const notification = document.getElementById('unregistered-notification');
  const cardsSpan = document.getElementById('unregistered-cards');
  
  if (!notification || !cardsSpan) {
    console.warn('Notification elements not found');
    return;
  }
  
  if (unregisteredCards.length === 0) {
    notification.style.display = 'none';
    return;
  }
  
  const cardList = unregisteredCards.join(', ');
  cardsSpan.textContent = cardList;
  notification.style.display = 'block';
  
  // Auto hide setelah 10 detik
  setTimeout(() => {
    if (notification) {
      notification.style.display = 'none';
    }
  }, 10000);
}

// Fungsi untuk memformat timestamp
function formatTimestamp(timestamp) {
  if (!timestamp) return "Waktu tidak valid";
  
  try {
    let date;
    
    // Handle berbagai format timestamp dari Firebase
    if (typeof timestamp === 'string') {
      // Jika hanya waktu tanpa tanggal (format "HH:MM:SS")
      if (/^\d{1,2}:\d{2}:\d{2}$/.test(timestamp)) {
        const today = new Date();
        const [hours, minutes, seconds] = timestamp.split(':');
        date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
                       parseInt(hours), parseInt(minutes), parseInt(seconds));
      } else {
        // Coba parse sebagai ISO string atau format lainnya
        date = new Date(timestamp);
      }
    } else if (timestamp && typeof timestamp === 'object') {
      // Handle Firebase Timestamp object
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
    } else if (typeof timestamp === 'number') {
      // Handle Unix timestamp
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }
    
    // Validasi tanggal
    if (isNaN(date.getTime())) {
      console.error('Invalid date from timestamp:', timestamp);
      return "Waktu tidak valid";
    }
    
    // Format ke bahasa Indonesia dengan timezone Asia/Makassar (WITA)
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Makassar'
    };
    
    return date.toLocaleDateString('id-ID', options);
    
  } catch (error) {
    console.error('Error formatting timestamp:', error, 'Timestamp:', timestamp);
    return "Waktu tidak valid";
  }
}

// Fungsi untuk mendapatkan timestamp saat ini dalam format yang konsisten
function getCurrentTimestamp() {
  // Gunakan waktu lokal Indonesia (WITA)
  const now = new Date();
  const makassarTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Makassar"}));
  return makassarTime.toISOString();
}

// Fungsi untuk mendapatkan waktu saat ini dalam format lokal
function getCurrentLocalTime() {
  const now = new Date();
  return {
    day: now.toLocaleDateString('id-ID', { weekday: 'long' }),
    time: now.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    fullDateTime: now.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Makassar'
    })
  };
}

// Fungsi untuk menambah log akses ke Firebase
function addAccessLog(roomName, cardId, status) {
  const timestamp = getCurrentTimestamp();
  const logData = {
    timestamp: timestamp,
    card_id: cardId,
    status: status
  };

  console.log("📝 Menambah log akses:", {
    roomName: roomName,
    cardId: cardId,
    status: status,
    timestamp: timestamp
  });

  // Tambahkan ke Firebase
  const db = firebase.database();
  const logRef = db.ref(`/${roomName}/access_history/access_records`);

  // --- Tambahan: Auto-mapping kartu jika belum ada di card_mapping ---
  if (!cardIdToName[cardId] && !isMasterCard(cardId)) {
    // Tambahkan mapping dengan nama default
    addCardMapping(cardId, 'Kartu Tidak Dikenal');
    console.log(`Auto-mapping: Menambah ${cardId} ke card_mapping dengan nama 'Kartu Tidak Dikenal'`);
  }
  // --- End tambahan ---

  logRef.push(logData)
    .then(() => {
      console.log(`✅ Log akses berhasil ditambahkan untuk ${roomName}`);
      // Refresh log setelah menambah
      setTimeout(() => {
        renderAccessLogs();
      }, 1000);
    })
    .catch((error) => {
      console.error("❌ Error menambah log akses:", error);
    });
}

// Fungsi untuk simulasi kartu RFID di-tap
function simulateCardTap(roomName, cardId, status = 'granted') {
  console.log(`🎫 Simulasi kartu RFID di-tap: ${cardId} di ${roomName}`);
  addAccessLog(roomName, cardId, status);
}

// Fungsi untuk menambah log akses dengan timestamp kustom
function addAccessLogWithCustomTimestamp(roomName, cardId, status, customTimestamp) {
  const logData = {
    timestamp: customTimestamp,
    card_id: cardId,
    status: status
  };

  console.log("📝 Menambah log akses dengan timestamp kustom:", {
    roomName: roomName,
    cardId: cardId,
    status: status,
    timestamp: customTimestamp
  });

  // Tambahkan ke Firebase
  const db = firebase.database();
  const logRef = db.ref(`/${roomName}/access_history/access_records`);
  
  logRef.push(logData)
    .then(() => {
      console.log(`✅ Log akses dengan timestamp kustom berhasil ditambahkan untuk ${roomName}`);
      // Refresh log setelah menambah
      setTimeout(() => {
        renderAccessLogs();
      }, 1000);
    })
    .catch((error) => {
      console.error("❌ Error menambah log akses dengan timestamp kustom:", error);
    });
}

// Render log akses
function renderAccessLogs() {
  const container = document.getElementById("log-table");
  const logCount = document.getElementById("log-count");
  const selectedRoom = document.getElementById("log-room-select").value;
  
  if (!container) return;
  
  container.innerHTML = "";
  
  // Kumpulkan semua log dari semua ruangan
  let allLogs = [];
  
  for (const room in roomsData) {
    if (room === 'card_mapping') continue; // Skip card_mapping
    
    const data = roomsData[room];
    if (data.access_history && data.access_history.access_records) {
      const accessRecords = Array.isArray(data.access_history.access_records)
        ? data.access_history.access_records
        : Object.values(data.access_history.access_records);
      
      // Filter log yang valid dan tambahkan informasi ruangan
      const validLogs = accessRecords
        .filter(record => record && record.timestamp)
        .map(record => ({
          ...record,
          room: room,
          roomDisplayName: getRoomDisplayName(room)
        }));
      
      allLogs = allLogs.concat(validLogs);
    }
  }
  
  // Filter berdasarkan ruangan yang dipilih
  if (selectedRoom && selectedRoom !== 'all') {
    allLogs = allLogs.filter(log => log.room === selectedRoom);
  }
  
  // Urutkan berdasarkan timestamp (terbaru di atas)
  allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Update log count
  if (logCount) {
    logCount.textContent = allLogs.length;
  }
  
  if (allLogs.length === 0) {
    container.innerHTML = `
      <div class="empty-log">
        <div class="empty-icon">📋</div>
        <h4>Tidak ada log akses</h4>
        <p>${selectedRoom && selectedRoom !== 'all' ? `Belum ada log untuk ruangan ${getRoomDisplayName(selectedRoom)}` : 'Belum ada log akses yang tersedia'}</p>
      </div>
    `;
    return;
  }
  
  // Render log items
  allLogs.forEach(log => {
    const cardId = log.card_id;
    const userName = getNameFromCardId(cardId);
    
    const logItem = document.createElement("div");
    logItem.className = `log-item ${log.status}`;
    
    const statusText = log.status === 'granted' ? 'Akses Diberikan' : 'Akses Ditolak';
    const statusClass = log.status === 'granted' ? 'granted' : 'denied';
    
    // Tampilkan nama user atau "Admin" untuk kartu master
    let displayName = userName || 'Kartu Tidak Terdaftar';
    let nameClass = 'user-name';

    // Jika master card atau nama Syukri/Syamruddin, tampilkan sebagai Admin
    if (isMasterCard(cardId) || userName === 'Syukri, S.T.,M.T' || userName === 'Syamruddin, S.T.,M.T') {
      displayName = 'Admin';
      nameClass = 'user-name admin';
    } else if (!userName) {
      nameClass = 'user-name unregistered';
    }
    
    // Tampilkan ID kartu hanya jika kartu tidak terdaftar dan bukan kartu master
    const showCardId = !userName && !isMasterCard(cardId);
    
    logItem.innerHTML = `
      <div class="log-header">
        <div class="log-room">
          <i class="fas fa-door-open"></i>
          <span class="room-name">${log.roomDisplayName}</span>
        </div>
        <div class="log-status ${statusClass}">
          <i class="fas ${log.status === 'granted' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
          ${statusText}
        </div>
      </div>
      <div class="log-details">
        <div class="log-user">
          <i class="fas fa-user"></i>
          <span class="${nameClass}">${displayName}</span>
          ${showCardId ? `<span class="card-id">(${cardId})</span>` : ''}
        </div>
        <div class="log-time">
          <i class="fas fa-clock"></i>
          <span class="time-display">${formatTimestamp(log.timestamp)}</span>
        </div>
      </div>
    `;
    
    container.appendChild(logItem);
  });
}

// Update dropdown ruangan
function updateRoomDropdowns() {
  const rosterSelect = document.getElementById("select-room");
  const logSelect = document.getElementById("log-room-select");
  
  // Simpan nilai yang dipilih sebelum mengupdate
  const selectedLogRoom = logSelect ? logSelect.value : 'all';
  const selectedRosterRoom = rosterSelect ? rosterSelect.value : '';
  
  if (rosterSelect) {
    rosterSelect.innerHTML = '<option value="">Pilih Ruangan</option>';
  }
  
  if (logSelect) {
    logSelect.innerHTML = '<option value="all">Semua Ruangan</option>';
  }
  
  for (const room in roomsData) {
    if (room === 'card_mapping') continue; // Skip card_mapping
    
    if (rosterSelect) {
      const option = document.createElement("option");
      option.value = room;
      option.textContent = getRoomDisplayName(room);
      rosterSelect.appendChild(option);
    }
    
    if (logSelect) {
      const option = document.createElement("option");
      option.value = room;
      option.textContent = getRoomDisplayName(room);
      logSelect.appendChild(option);
    }
  }
  
  // Kembalikan nilai yang dipilih
  if (logSelect && selectedLogRoom) {
    logSelect.value = selectedLogRoom;
  }
  
  if (rosterSelect && selectedRosterRoom) {
    rosterSelect.value = selectedRosterRoom;
  }
}

// Callback ketika data berubah
function onDataChange(snapshot) {
  roomsData = snapshot.val() || {};
  console.log("Data berhasil diperbarui:", roomsData);
  
  // Update UI
  renderRoomCards();
  updateRoomDropdowns();
  updateRosterTable(document.getElementById("select-room")?.value || "");
  renderAccessLogs();
  updateCardList();
  checkUnregisteredCards();
}

// Fungsi untuk mengecek kartu yang belum terdaftar
function checkUnregisteredCards() {
  const notification = document.getElementById("unregistered-notification");
  const unregisteredSpan = document.getElementById("unregistered-cards");
  
  if (!notification || !unregisteredSpan) return;
  
  // Kumpulkan semua card ID dari log akses
  let allCardIds = [];
  
  for (const room in roomsData) {
    if (room === 'card_mapping') continue;
    
    const data = roomsData[room];
    if (data.access_history && data.access_history.access_records) {
      const accessRecords = Array.isArray(data.access_history.access_records)
        ? data.access_history.access_records
        : Object.values(data.access_history.access_records);
      
      accessRecords.forEach(record => {
        if (record && record.card_id) {
          allCardIds.push(record.card_id);
        }
      });
    }
  }
  
  // Filter kartu yang belum terdaftar (exclude kartu master)
  const unregisteredCards = allCardIds.filter(cardId => {
    // Skip kartu master
    if (isMasterCard(cardId)) {
      return false;
    }
    
    // Cek apakah kartu ada di card mapping
    return !getNameFromCardId(cardId);
  });
  
  // Hapus duplikat
  const uniqueUnregistered = [...new Set(unregisteredCards)];
  
  if (uniqueUnregistered.length > 0) {
    unregisteredSpan.textContent = uniqueUnregistered.join(', ');
    notification.style.display = "block";
  } else {
    notification.style.display = "none";
  }
}

// Fungsi untuk mengupdate waktu saat ini di header
function updateCurrentTime() {
  const timeDisplay = document.getElementById('time-display');
  if (timeDisplay) {
    const currentTime = getCurrentLocalTime();
    timeDisplay.textContent = currentTime.fullDateTime;
  }
}

// Fungsi untuk memulai update waktu real-time
function startTimeUpdate() {
  // Update waktu setiap detik
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
}

// Mapping nama ruangan dari kode Firebase ke nama yang lebih deskriptif
function getRoomDisplayName(roomCode) {
  const roomMapping = {
    'room1': 'Lab Perancangan dan Fabrikasi Sistem Elektronika',
    'room2': 'Lab Sistem Kendali',
    'room3': 'Lab Elektronika Digital'
  };
  return roomMapping[roomCode] || roomCode;
}

function getRoomCode(displayName) {
  const roomMapping = {
    'Lab Perancangan dan Fabrikasi Sistem Elektronika': 'room1',
    'Lab Sistem Kendali': 'room2',
    'Lab Elektronika Digital': 'room3'
  };
  return roomMapping[displayName] || displayName;
}

// Fungsi untuk menghapus kartu RFID
function deleteCard(cardId) {
  if (!confirm(`Apakah Anda yakin ingin menghapus kartu ${cardId}?`)) return;
  delete cardMappings[cardId];
  localStorage.setItem('cardMappings', JSON.stringify(cardMappings));
  showNotification(`Kartu ${cardId} berhasil dihapus`, 'success');
  displayCardMappings();
}

// Fungsi untuk generate card_mapping dari seluruh log akses di semua room
function generateCardMappingFromLogs() {
  // Ganti daftar room sesuai dengan yang ada di Firebase Anda
  const rooms = Object.keys(roomsData).filter(room => room !== 'card_mapping');
  const mapping = {};

  Promise.all(
    rooms.map(room =>
      firebase.database().ref(`/${room}/access_history/access_records`).once('value')
        .then(snapshot => {
          const logs = snapshot.val();
          if (logs) {
            Object.values(logs).forEach(log => {
              if (log.card_id) {
                mapping[log.card_id] = "Kartu Tidak Dikenal"; // Atau isi nama jika tahu
              }
            });
          }
        })
    )
  ).then(() => {
    // Simpan ke /card_mapping
    return firebase.database().ref('/card_mapping').set(mapping);
  }).then(() => {
    alert('card_mapping berhasil dibuat/diupdate!');
    console.log('card_mapping:', mapping);
  }).catch((err) => {
    alert('Gagal membuat card_mapping: ' + err.message);
  });
}

localStorage.clear();

async function canAccess(room, cardId) {
  // 1. Ambil jadwal terbaru dari Firebase
  const scheduleSnap = await db.ref(`/${room}/schedule`).once('value');
  const schedule = scheduleSnap.val();
  if (!schedule) {
    console.log('Tidak ada jadwal untuk ruangan ini.');
    return false;
  }

  // 2. Cek waktu sekarang
  const now = new Date();
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const today = days[now.getDay()];
  const currentTime = now.toTimeString().slice(0,5); // format HH:MM

  // 3. Cek apakah ada jadwal aktif untuk ID kartu ini
  const allowed = schedule.some(jadwal => {
    if (jadwal.day.toLowerCase() !== today.toLowerCase()) return false;
    if (!(currentTime >= jadwal.start_time && currentTime <= jadwal.end_time)) return false;
    // Jika lecturer array, cek semua card_id di dalamnya
    if (Array.isArray(jadwal.lecturer)) {
      return jadwal.lecturer.some(dosen => {
        return dosen.card_id && dosen.card_id.trim().toLowerCase() === cardId.trim().toLowerCase();
      });
    }
    // Jika ada lecturer_id atau card_id di level atas (jadwal satu dosen)
    return (jadwal.lecturer_id && jadwal.lecturer_id.trim().toLowerCase() === cardId.trim().toLowerCase()) ||
           (jadwal.card_id && jadwal.card_id.trim().toLowerCase() === cardId.trim().toLowerCase());
  });

  if (allowed) {
    console.log(`Akses diberikan untuk kartu ${cardId}`);
    return true;
  } else {
    console.log(`Akses ditolak untuk kartu ${cardId}`);
    return false;
  }
}

// Tambahkan kembali fungsi loadStaticRoster jika sebelumnya dihapus
async function loadStaticRoster() {
  try {
    const response = await fetch('access_log.json');
    if (!response.ok) throw new Error('Gagal mengambil access_log.json');
    const staticData = await response.json();
    roomsData = staticData;
    updateRoomDropdowns();
    // Pilih ruangan pertama yang valid
    const select = document.getElementById('select-room');
    if (select) {
      let firstRoom = '';
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value) {
          select.selectedIndex = i;
          firstRoom = select.options[i].value;
          break;
        }
      }
      updateRosterTable(firstRoom);
    }
  } catch (err) {
    console.error('Gagal load roster statis:', err);
  }
}

// Fungsi migrasi: tambahkan id unik pada setiap jadwal yang belum punya id
async function migrateScheduleIds() {
  for (const room in roomsData) {
    if (room === 'card_mapping') continue;
    const schedule = roomsData[room].schedule || [];
    const scheduleArray = Array.isArray(schedule) ? schedule : Object.values(schedule);
    let changed = false;
    scheduleArray.forEach(jadwal => {
      if (!jadwal.id) {
        jadwal.id = Date.now() + Math.random(); // id unik
        changed = true;
      }
    });
    if (changed) {
      await firebase.database().ref(`${room}/schedule`).set(scheduleArray);
      console.log(`Migrasi id selesai untuk ${room}`);
    }
  }
  alert('Migrasi id pada semua jadwal selesai!');
}

// Reschedule Modal
    function openRescheduleModal(room, jadwalId, jadwal) {
      document.getElementById('reschedule-id').value = jadwalId;
      document.getElementById('reschedule-hari').value = jadwal.day || '';
      document.getElementById('reschedule-mulai').value = jadwal.start_time || '';
      document.getElementById('reschedule-selesai').value = jadwal.end_time || '';
      document.getElementById('reschedule-matkul').value = jadwal.matkul || '';
      document.getElementById('reschedule-kelas').value = jadwal.kelas || '';
      // Ambil dosen pertama jika array
      if (Array.isArray(jadwal.lecturer) && jadwal.lecturer.length > 0) {
        document.getElementById('reschedule-dosen').value = jadwal.lecturer[0].name || '';
      } else {
        document.getElementById('reschedule-dosen').value = jadwal.lecturer && jadwal.lecturer.name ? jadwal.lecturer.name : (jadwal.lecturer || '');
      }
      document.getElementById('modal-reschedule').dataset.room = room;
      document.getElementById('modal-reschedule').style.display = 'block';
    }
    document.getElementById('reschedule-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const jadwalId = document.getElementById('reschedule-id').value;
      const hari = document.getElementById('reschedule-hari').value;
      const mulai = document.getElementById('reschedule-mulai').value;
      const selesai = document.getElementById('reschedule-selesai').value;
      const matkul = document.getElementById('reschedule-matkul').value;
      const kelas = document.getElementById('reschedule-kelas').value;
      const dosen = document.getElementById('reschedule-dosen').value;
      const room = document.getElementById('modal-reschedule').dataset.room;
      if (!room) {
        alert('Ruangan tidak ditemukan!');
        return;
      }
      const schedule = roomsData[room].schedule || [];
      const scheduleArray = Array.isArray(schedule) ? schedule : Object.values(schedule);
      const index = scheduleArray.findIndex(j => j.id == jadwalId);
      if (index === -1) {
        alert('Jadwal tidak ditemukan!');
        return;
      }
      scheduleArray[index] = {
        ...scheduleArray[index],
        day: hari,
        start_time: mulai,
        end_time: selesai,
        matkul: matkul,
        kelas: kelas,
        lecturer: [{ name: dosen, card_id: scheduleArray[index].lecturer && Array.isArray(scheduleArray[index].lecturer) && scheduleArray[index].lecturer[0] ? scheduleArray[index].lecturer[0].card_id : '' }]
      };
      firebase.database().ref(`${room}/schedule`).set(scheduleArray)
        .then(() => {
          alert('Jadwal berhasil diubah!');
          document.getElementById('modal-reschedule').style.display = 'none';
          updateRosterTable(room);
        }).catch((error) => {
          alert('Gagal mengubah jadwal: ' + error.message);
        });
    });
