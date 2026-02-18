
import React, { useState } from 'react';
import FileExplorer from './components/FileExplorer';
import Editor from './components/Editor';
import Simulation from './components/Simulation';
import { JAVA_PROJECT_DATA } from './services/javaProjectData';
import { JavaFile } from './types';
import { Icons } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'demo' | 'docs'>('code');
  const [selectedFile, setSelectedFile] = useState<JavaFile>(JAVA_PROJECT_DATA[0].files[0]);

  const NavButton: React.FC<{ id: 'code' | 'demo' | 'docs', label: string, icon: React.ReactNode }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
        activeTab === id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0f172a]">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">N</div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Mi Solución - NTT DATA</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Microservicios & Arquitectura Limpia</p>
          </div>
        </div>

        <div className="flex gap-2">
          <NavButton id="code" label="Mi Código" icon={<Icons.Code />} />
          <NavButton id="demo" label="Validación F1-F5" icon={<Icons.Play />} />
          <NavButton id="docs" label="Mis Entregables" icon={<Icons.Terminal />} />
        </div>

        <div className="hidden md:block">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full uppercase">
            Perfil Senior - Implementado
          </div>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'code' && (
          <>
            <FileExplorer 
              onFileSelect={setSelectedFile} 
              selectedFilePath={selectedFile.path} 
            />
            <div className="flex-1 flex flex-col min-w-0">
              <div className="h-9 bg-slate-800 flex items-center px-4 border-b border-slate-700">
                <span className="text-[11px] text-slate-400 font-mono truncate">{selectedFile.path}</span>
              </div>
              <Editor content={selectedFile.content} language={selectedFile.language} />
            </div>
          </>
        )}

        {activeTab === 'demo' && <Simulation />}

        {activeTab === 'docs' && (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-900 text-slate-300">
            <div className="max-w-4xl mx-auto space-y-12">
              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-white">Estado de mis Entregables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800 rounded-lg border border-green-500/30">
                    <h3 className="text-green-400 font-bold text-sm mb-2">✔ Especificación OpenAPI</h3>
                    <p className="text-xs text-slate-500">He incluido el archivo 'openapi.yaml' siguiendo el enfoque Contract First solicitado.</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg border border-green-500/30">
                    <h3 className="text-green-400 font-bold text-sm mb-2">✔ Colección Postman</h3>
                    <p className="text-xs text-slate-500">Mi colección JSON está lista en la carpeta de Entregables para las pruebas de endpoints.</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg border border-green-500/30">
                    <h3 className="text-green-400 font-bold text-sm mb-2">✔ Docker & Orquestación</h3>
                    <p className="text-xs text-slate-500">He configurado el Dockerfile y docker-compose para un despliegue inmediato.</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg border border-green-500/30">
                    <h3 className="text-green-400 font-bold text-sm mb-2">✔ Pruebas Unitarias</h3>
                    <p className="text-xs text-slate-500">Implementé pruebas para la lógica de negocio (saldos) asegurando calidad Senior.</p>
                  </div>
                </div>
              </section>

              <div className="p-6 bg-blue-900/20 border border-blue-800 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Cumplimiento de Buenas Prácticas</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="text-blue-500">✔</span>
                    <span><strong>Clean Code:</strong> Codificación 100% en inglés y nombres descriptivos.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-500">✔</span>
                    <span><strong>Manejo de Errores:</strong> GlobalExceptionHandler con mensajes amigables.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-500">✔</span>
                    <span><strong>Arquitectura:</strong> Desacoplamiento total mediante Kafka y capas bien definidas.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Todo listo para el repositorio</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
