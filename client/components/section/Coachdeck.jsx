// File: client/components/section/Coachdeck.jsx

import React, { useEffect, useState } from "react"; // Tambahkan useState dan useEffect
import Coach from "../ui/coach";
import useAuth from "../../src/hook/useAuth";
import axios from "axios"; // Pastikan axios di-import

export function Coachdeck() {
  const { user, loading } = useAuth(); 
  
  // 1. Definisikan Hooks di bagian atas, sebelum return kondisional apa pun.
  const [coaches, setCoaches] = useState([]); 
  const [dataLoading, setDataLoading] = useState(true); 

  // 2. useEffect untuk fetch data
  useEffect(() => {
    // Pastikan user sudah selesai loading, sudah login, dan BUKAN coach
    if (!loading && user && !user.is_coach) {
        const fetchApprovedCoaches = async () => {
            try {
                // Gunakan endpoint yang sudah diproteksi dan ambil data coach
                const res = await axios.get("http://localhost:5000/approved-coaches", { 
                    withCredentials: true // Penting untuk mengirim token/cookie sesi
                }); 
                setCoaches(res.data);
            } catch (err) {
                console.error("Failed to fetch approved coaches:", err);
                // Jika gagal (misalnya 403 Forbidden), set coaches menjadi array kosong
                setCoaches([]); 
            } finally {
                setDataLoading(false);
            }
        };
        fetchApprovedCoaches();
    } else if (!loading) {
        // Jika tidak ada user, atau user adalah coach, set dataLoading ke false agar tidak terus "Loading..."
        setDataLoading(false);
        setCoaches([]);
    }
    
  }, [user, loading]); // Dependencies: user dan loading dari useAuth

  // 3. Logic Kondisional (Pengecekan Tampilan)
  
  // Jika masih loading otentikasi, jangan tampilkan apa-apa (opsional, bisa diganti loading spinner)
  if (loading) return null; 

  // Jika user belum login ATAU user adalah coach, sembunyikan seluruh komponen.
  // Logic ini memfilter user yang boleh melihat data coach (yaitu, Student/Pengguna Biasa yang sudah login).
  if (!user || user.is_coach) {
      return null;
  }
  
  // 4. Tampilan Loading saat fetch data coach
  if (dataLoading) return <div className="p-8 text-center">Loading Coaches...</div>; 

  // 5. Tampilan Data Coach
  return (
    <div className="border border-dashed border-gray-300 rounded-lg lg:h-160 px-4 py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 min-h-[85vh]">
      
      {coaches.length > 0 ? (
        coaches.map((coach) => (
          <div
            key={coach.userId} // Menggunakan userId dari Profile
            className="flex flex-col items-center text-center rounded-xl"
          >
            <div className="mb-0"> 
              <Coach
                // Ganti dengan field gambar yang sesuai, default ke user.jpg
                // Gambar-gambar Anda ada di public: albert.webp, bill.jpg, user.jpg
                imageSrc={coach.image || "user.jpg"} 
                altText={coach.name}
                captionText={coach.skill || "General Coaching"} // Tampilkan skill/keahlian dari Profile
                imageHeight="200px"
                imageWidth="200px"
                scaleOnHover={1.05}
                rotateAmplitude={12}
              />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-0">
              {coach.name}
            </h3>
            <p className="text-sm text-gray-500">{coach.skill || coach.interest || coach.city}</p> 
            {/* Tambahkan link ke detail coach jika ada */}
            <a 
                href={`/coach/${coach.userId}`} 
                className="text-blue-500 hover:underline text-xs mt-1"
            >
                View Profile
            </a>
          </div>
        ))
      ) : (
        <div className="sm:col-span-2 md:col-span-3 text-center p-10">No approved coaches found.</div>
      )}
      
      {/* Hapus tombol "Join as Coach" karena hanya Student yang sudah login yang bisa melihat halaman ini */}
    </div>
  );
}