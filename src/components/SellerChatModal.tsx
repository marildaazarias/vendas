import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  ExternalLink,
  Sparkles,
  CheckCheck
} from 'lucide-react';
import { Product } from '../types';
import { generateWhatsAppLink } from '../utils/formatters';

interface ChatMessage {
  id: string;
  sender: 'seller' | 'user';
  text: string;
  time: string;
}

interface SellerChatModalProps {
  product: Product;
  onClose: () => void;
}

export const SellerChatModal: React.FC<SellerChatModalProps> = ({ product, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'seller',
      text: `Olá! Sou do atendimento da ${product.seller.name}. Estou à disposição para tirar qualquer dúvida sobre o anúncio "${product.title}". Como posso te ajudar hoje?`,
      time: 'Agora',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Tem pronta entrega para envio hoje?',
    'Acompanha nota fiscal e garantia oficial?',
    'Qual a melhor forma de pagamento?',
    'As fotos do anúncio são reais do produto?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate seller typing and replying
    setIsTyping(true);
    setTimeout(() => {
      let replyText = 'Agradecemos sua mensagem! Todos os nossos produtos anunciados contam com nota fiscal, garantia e envio rápido com código de rastreamento.';
      const lower = textToSend.toLowerCase();

      if (lower.includes('pronta entrega') || lower.includes('envio') || lower.includes('prazo')) {
        replyText = `Sim! Temos ${product.stock} unidades em nosso centro logístico prontas para despacho imediato com coleta diária pelos Correios e transportadora parceira.`;
      } else if (lower.includes('nota fiscal') || lower.includes('garantia')) {
        replyText = `Com certeza! Emitimos NF-e automaticamente no seu CPF/CNPJ e você conta com ${product.warrantyMonths} meses de garantia oficial com suporte direto.`;
      } else if (lower.includes('pagamento') || lower.includes('pix') || lower.includes('desconto')) {
        replyText = 'No Pix oferecemos 5% de desconto automático na finalização do pedido, ou parcelamento em até 10x sem juros no cartão de crédito.';
      } else if (lower.includes('foto') || lower.includes('real')) {
        replyText = 'Todas as fotos de nossa galeria são 100% reais, em alta resolução, capturando os acabamentos, portas e detalhes de fabricação.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          sender: 'seller',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        id="seller-chat-modal"
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
      >
        {/* Chat Header with Seller Info */}
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-stone-700"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold truncate max-w-[180px] sm:max-w-none">
                  {product.seller.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online agora • Resposta média: {product.seller.responseTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={generateWhatsAppLink(product.seller.phoneWhatsapp, product.title, product.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-stone-800 text-emerald-400 hover:text-white transition-colors"
              title="Abrir no WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              aria-label="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Context Banner */}
        <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200 flex items-center gap-3">
          <img
            src={product.images[0].url}
            alt=""
            className="w-9 h-9 rounded-lg object-cover border border-stone-300 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-stone-500 font-medium">Você está tirando dúvidas sobre:</p>
            <p className="text-xs font-bold text-stone-800 truncate">{product.title}</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
          {messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-stone-900 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                      isMe ? 'text-stone-400' : 'text-stone-400'
                    }`}
                  >
                    <span>{m.time}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-stone-500 bg-white border border-stone-200 px-3 py-2 rounded-2xl rounded-bl-xs w-fit text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">Vendedor digitando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Questions */}
        <div className="p-2 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 whitespace-nowrap shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Footer */}
        <div className="p-3 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua mensagem para o vendedor..."
              className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-emerald-700 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-30 text-white transition-colors flex items-center justify-center shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
