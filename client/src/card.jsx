export default function Card() {
  return (
    <main className="min-h-screen bg-yellow-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-16 w-[700px] h-[400px]">
        <h2 className="text-4xl font-bold text-blue-800 text-center mb-12">Student Card</h2>
        <div className="flex items-center justify-between">
          <div className="w-48 h-48 bg-blue-400 rounded-full flex items-center justify-center mr-10">
            <img src="/logo.png" alt="Ubud Logo" className="w-36 h-36 object-contain" />
          </div>
          <div className="flex-1">
            <div className="space-y-4">
              <div className="text-3xl font-semibold text-gray-800">John Smith</div>
              <div className="text-xl text-gray-600">Student ID: 2024001</div>
              <div className="text-xl text-gray-600">Age: 21</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
