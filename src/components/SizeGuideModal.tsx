import React from 'react';
import { X, Ruler, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { SIZE_CHART } from '../data/mockProducts';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        id="size-guide-modal"
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Guia Oficial de Medidas (P, M, G, GG)
              </h2>
              <p className="text-xs text-stone-500">
                Encontre o tamanho perfeito em Renda, Poliamida e Cetim
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Fechar guia de medidas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-900 text-stone-200 text-[11px] sm:text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Tamanho</th>
                  <th className="py-3 px-4 font-semibold">Manequim</th>
                  <th className="py-3 px-4 font-semibold">Busto</th>
                  <th className="py-3 px-4 font-semibold">Abaixo do Busto</th>
                  <th className="py-3 px-4 font-semibold">Cintura</th>
                  <th className="py-3 px-4 font-semibold">Quadril</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {SIZE_CHART.map((item) => (
                  <tr key={item.size} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      <span className="w-7 h-7 rounded-lg bg-stone-100 border border-stone-300 flex items-center justify-center font-extrabold">
                        {item.size}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-700">{item.num}</td>
                    <td className="py-3.5 px-4 text-stone-600">{item.bust}</td>
                    <td className="py-3.5 px-4 text-stone-600">{item.underbust}</td>
                    <td className="py-3.5 px-4 text-stone-600">{item.waist}</td>
                    <td className="py-3.5 px-4 text-stone-600">{item.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Como tirar suas medidas com facilidade:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">1. Busto</span>
                <p className="text-stone-600 leading-relaxed">
                  Passe a fita métrica sobre a parte mais saliente dos seios, mantendo a fita paralela ao chão sem apertar.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">2. Cintura</span>
                <p className="text-stone-600 leading-relaxed">
                  Meça na linha mais fina do seu abdômen, cerca de 2 dedos acima da altura do umbigo.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">3. Quadril</span>
                <p className="text-stone-600 leading-relaxed">
                  Passe a fita métrica contornando a parte de maior projeção dos glúteos e quadris.
                </p>
              </div>
            </div>
          </div>

          {/* Fabrics Fit Info */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-stone-700 space-y-2">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Comportamento dos Tecidos no Corpo:
            </span>
            <ul className="space-y-1.5 text-stone-600 pl-1">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Renda Francesa:</strong> Possui 10% elastano, adaptando-se confortavelmente às curvas. Se estiver entre dois tamanhos, escolha o maior para mais conforto.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Microfibra de Poliamida:</strong> Altíssima elasticidade e toque gelado anatômico com compressão suave.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Cetim de Seda:</strong> Caimento solto e fluído, não estica tanto quanto a malha, por isso nossos moldes possuem folga inteligente e alças reguláveis.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Dúvidas? Fale com a consultora pelo WhatsApp
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Entendido, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
