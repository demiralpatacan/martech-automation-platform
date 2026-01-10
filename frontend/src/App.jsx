import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [assets, setAssets] = useState([]); // Dosya listesi için state

  // Dosyaları backend'den çeken fonksiyon
  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:3000/assets');
      const data = await response.json();
      setAssets(data);
    } catch (err) {
      console.error("Liste yüklenemedi:", err);
    }
  };

  // Sayfa açıldığında listeyi getir
  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('asset');

    if (!file || file.size === 0) {
      setMessage('Lütfen önce bir dosya seçin!');
      return;
    }

    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.text();
    setMessage(result);
    fetchAssets(); // Yükleme sonrası listeyi tazele
  };

  return (
    <div style={{ backgroundColor: '#141414', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#E50914', textAlign: 'center' }}>NETFLIX ASSET HUB</h1>
      
      <form onSubmit={handleUpload} style={{ textAlign: 'center', marginTop: '30px' }}>
        <input type="file" name="asset" style={{ color: 'white' }} />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#E50914', color: 'white', border: 'none', fontWeight: 'bold' }}>
          UPLOAD TO CLOUD
        </button>
      </form>

      {message && <p style={{ textAlign: 'center', marginTop: '20px', color: '#aaa' }}>{message}</p>}

      <h2 style={{ marginTop: '50px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>My Library</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {assets.map((asset, index) => (
          <div key={index} style={{ backgroundColor: '#222', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
            <img 
              src={`http://localhost:3000/uploads/${asset}`} 
              alt={asset} 
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '2px' }} 
            />
            <p style={{ fontSize: '12px', marginTop: '10px', color: '#eee', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;