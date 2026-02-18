
import React, { useState } from 'react';
import { Customer, Account, Movement } from '../types';

const Simulation: React.FC = () => {
  const [customers] = useState<Customer[]>([
    { id: '1', name: 'César Oleas', gender: 'Masculino', identification: '1717171717', address: 'Quito, Ecuador', phone: '099999999', state: true }
  ]);

  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', number: '478758', type: 'Ahorro', initialBalance: 2000, state: true, customerId: '1' }
  ]);

  const [movements, setMovements] = useState<Movement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [movementValue, setMovementValue] = useState<number>(0);
  const [movementType, setMovementType] = useState<'Deposito' | 'Retiro'>('Retiro');
  const [showReport, setShowReport] = useState(false);

  const handleTransaction = () => {
    setError(null);
    if (movementValue <= 0) {
      setError("El valor debe ser mayor que cero");
      return;
    }

    const account = accounts[0];
    const value = movementType === 'Retiro' ? -movementValue : movementValue;
    const newBalance = account.initialBalance + value;

    if (newBalance < 0) {
      setError("Saldo no disponible"); // F3 EXACTO
      return;
    }

    setAccounts([{ ...account, initialBalance: newBalance }]);
    const newM = { id: Date.now().toString(), accountId: '1', date: new Date().toISOString().split('T')[0], type: movementType, value: movementValue, balance: newBalance };
    setMovements([newM, ...movements]);
    setMovementValue(0);
  };

  return (
    <div className="flex-1 p-8 bg-[#0f172a] overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white">Pruebas de Funcionamiento (F1-F7)</h2>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Cliente: {customers[0].name}</p>
          </div>
          <button 
            onClick={() => setShowReport(!showReport)}
            className="px-6 py-2 bg-blue-600 rounded-full text-xs font-black uppercase tracking-widest text-white hover:bg-blue-500 shadow-lg"
          >
            {showReport ? 'Volver a Operaciones' : 'Generar Reporte (F4)'}
          </button>
        </div>

        {showReport ? (
          <div className="bg-slate-800 p-8 rounded-xl border border-blue-500/30 animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-white mb-6">Estado de Cuenta <span className="text-blue-500">/reports/1</span></h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-700">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Cliente</p>
                  <p className="text-white font-medium">{customers[0].name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Identificación</p>
                  <p className="text-white font-medium">{customers[0].identification}</p>
                </div>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 border-b border-slate-700">
                  <tr><th className="py-3">Fecha</th><th className="py-3">Cuenta</th><th className="py-3">Tipo</th><th className="py-3">Movimiento</th><th className="py-3">Saldo</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {movements.length === 0 ? (
                    <tr><td colSpan={5} className="py-10 text-center text-slate-500">Sin movimientos</td></tr>
                  ) : (
                    movements.map(m => (
                      <tr key={m.id}>
                        <td className="py-4 text-slate-400">{m.date}</td>
                        <td className="py-4 text-white font-mono">478758</td>
                        <td className="py-4 text-slate-300">Ahorro</td>
                        <td className={`py-4 font-bold ${m.type === 'Retiro' ? 'text-red-400' : 'text-green-400'}`}>{m.type === 'Retiro' ? '-' : ''}${m.value.toFixed(2)}</td>
                        <td className="py-4 text-white font-bold">${m.balance.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
              <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">Registrar Movimiento (F2)</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Acción</label>
                    <select value={movementType} onChange={e => setMovementType(e.target.value as any)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none">
                      <option value="Retiro">Retiro</option>
                      <option value="Deposito">Depósito</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Valor</label>
                    <input type="number" value={movementValue} onChange={e => setMovementValue(parseFloat(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none" placeholder="0.00" />
                  </div>
                </div>
                {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs font-bold text-center">{error}</div>}
                <button onClick={handleTransaction} className="w-full bg-blue-600 py-3 rounded-lg font-black text-white text-xs uppercase tracking-widest hover:bg-blue-500 shadow-lg">Ejecutar (F3 Validation)</button>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl flex flex-col justify-center items-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Saldo Disponible (F1 Account)</p>
              <h4 className="text-5xl font-black text-white">${accounts[0].initialBalance.toFixed(2)}</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;
