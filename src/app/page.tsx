import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-white font-bold text-3xl">P</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Praktikumsjournal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Verwalte deine Beobachtungsbögen und führe dein persönliches Journal während des Praktikums
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Beobachtungsbögen</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Dokumentiere deine Beobachtungen mit dynamischen Tabellen. Erfasse Zeit, Beschreibung und Kommentare strukturiert.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Persönliches Journal</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Führe dein Tagebuch mit Stimmungs- und Anstrengungsskala. Teile Einträge optional mit deiner Betreuerin.
            </p>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="group relative px-8 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Jetzt anmelden
            </Link>
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 border border-gray-300 text-lg font-semibold rounded-2xl text-gray-700 bg-white/70 backdrop-blur-sm hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Demo ansehen
            </Link>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sichere & Moderne Technologie</h3>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Supabase Auth
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                TypeScript
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Responsive Design
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
