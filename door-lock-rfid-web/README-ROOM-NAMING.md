# Sistem Penamaan Ruangan Dashboard

## Overview
Dashboard sekarang menggunakan sistem penamaan ruangan yang lebih deskriptif. Nama ruangan diubah dari kode Firebase (seperti "room1") menjadi nama yang lebih mudah dipahami (seperti "Bengkel Mekanik dan Elektronika").

## Fungsi Mapping

### `getRoomDisplayName(roomCode)`
Mengubah kode ruangan Firebase menjadi nama display yang user-friendly.

**Parameter:**
- `roomCode` (string): Kode ruangan dari Firebase (contoh: "room1")

**Return:**
- `string`: Nama display ruangan (contoh: "Bengkel Mekanik dan Elektronika")

**Contoh:**
```javascript
getRoomDisplayName('room1') // Returns: "Lab Perancangan dan Fabrikasi Sistem Elektronika"
getRoomDisplayName('room2') // Returns: "Lab Sistem Kendali"
getRoomDisplayName('unknown') // Returns: "unknown"
```

### `getRoomCode(displayName)`
Mengubah nama display menjadi kode ruangan Firebase (fungsi inverse).

**Parameter:**
- `displayName` (string): Nama display ruangan

**Return:**
- `string`: Kode ruangan Firebase

**Contoh:**
```javascript
getRoomCode('Lab Perancangan dan Fabrikasi Sistem Elektronika') // Returns: "room1"
getRoomCode('Lab Sistem Kendali') // Returns: "room2"
```

## Mapping Saat Ini

| Kode Firebase | Nama Display |
|---------------|------------------------------------------------------|
| room1         | Lab Perancangan dan Fabrikasi Sistem Elektronika     |
| room2         | Lab Sistem Kendali                                  |

## Implementasi

### 1. Kartu Ruangan
Kartu ruangan di dashboard utama sekarang menampilkan nama display:
```javascript
card.innerHTML = `
  <h3>${getRoomDisplayName(room)}</h3>
  // ... rest of card content
`;
```

### 2. Modal Detail Ruangan
Modal detail ruangan menampilkan nama display:
```javascript
document.getElementById("modal-ruang-name").textContent = getRoomDisplayName(room);
```

### 3. Dropdown Ruangan
Dropdown untuk memilih ruangan menampilkan nama display:
```javascript
option.textContent = getRoomDisplayName(room);
```

### 4. Log Akses
Log akses menampilkan nama display ruangan:
```javascript
<span class="room-name">${log.roomDisplayName}</span>
```

### 5. Pesan Error
Pesan error menampilkan nama display ruangan:
```javascript
<p>Belum ada jadwal untuk ruangan ${getRoomDisplayName(room)}</p>
```

## Menambah Ruangan Baru

Untuk menambah ruangan baru, update mapping di fungsi `getRoomDisplayName`:

```javascript
function getRoomDisplayName(roomCode) {
  const roomMapping = {
    'room1': 'Lab Perancangan dan Fabrikasi Sistem Elektronika',
    'room2': 'Lab Sistem Kendali',
    'room3': 'Nama Ruangan Baru' // Tambahkan mapping baru
  };
  
  return roomMapping[roomCode] || roomCode;
}
```

Dan juga update fungsi `getRoomCode`:

```javascript
function getRoomCode(displayName) {
  const roomMapping = {
    'Lab Perancangan dan Fabrikasi Sistem Elektronika': 'room1',
    'Lab Sistem Kendali': 'room2',
    'Nama Ruangan Baru': 'room3' // Tambahkan mapping baru
  };
  
  return roomMapping[displayName] || displayName;
}
```