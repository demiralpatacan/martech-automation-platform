import express from 'express'; // Express framework'ünü çağırır
import multer from 'multer'; // Dosya yükleme yönetimi için
import path from 'path'; // Dosya uzantıları işlemleri için
import cors from 'cors'; // Frontend erişimine izin veren güvenlik anahtarı
import fs from 'fs'; // Dosya sistemini içeri aktarır

const app = express(); // Uygulamayı başlatır
app.use(cors()); // Diğer portlardan gelen isteklere kapıyı açar

// Dosyaların nereye ve hangi isimle kaydedileceğini ayarlar
const storage = multer.diskStorage({
    destination: 'uploads/', // Yüklenecek klasör
    filename: (req, file, cb) => {
        const uniqueName = `asset-${Date.now()}${path.extname(file.originalname)}`; // Benzersiz isim oluşturur
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage }); // Ayarları multer'a bağlar

// Tek bir upload rotası yeterli
app.post('/upload', upload.single('asset'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file selected!'); // Dosya yoksa hata döner
    }
    console.log('Asset Cataloged:', req.file.filename); // Terminale bilgi yazar
    res.send(`Asset uploaded as: ${req.file.filename}`); // Frontend'e başarı mesajı gönderir
});

app.use('/uploads', express.static('uploads')); // Yüklenen dosyalara tarayıcıdan erişim sağlar

app.get('/assets', (req, res) => {
    const directoryPath = './uploads'; // Klasör yolunu basitleştirdik
    fs.readdir(directoryPath, (err, files) => { // Klasörü tarar
        if (err) return res.status(500).send('Unable to scan files'); // Hata kontrolü
        res.json(files); // Dosya adlarını dizi olarak döner
    });
});

app.listen(3000, () => console.log('MarTech Platform: http://localhost:3000')); // Sunucuyu başlatır