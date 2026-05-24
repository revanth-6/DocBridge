import { useState, useRef, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { aiApi } from '../api/aiApi';

export default function AICompanionPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    aiApi.getSuggestedQuestions()
      .then(res => setSuggested(res.data?.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiApi.chat({ message: text, sessionId });
      if (data.success) {
        setSessionId(data.data.sessionId);
        setMessages(prev => [...prev, { role: 'assistant', content: data.data.message.content, id: data.data.message.id }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', id: Date.now() + 1 }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-130px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">🤖 AI Health Companion</h1>
          <p className="text-sm text-slate-500">Ask me anything about your health records</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => { setMessages([]); setSessionId(null); }}>New Chat</Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden !p-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Hello! I'm your DocBridge AI Companion</h3>
              <p className="text-sm text-slate-500 max-w-md mb-6">I can help you understand your medical records, explain medications, and prepare questions for your doctor.</p>
              <div className="grid sm:grid-cols-2 gap-2 max-w-lg">
                {suggested.slice(0, 4).map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} className="text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-slate-400 hover:text-slate-200 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                    : 'bg-white/5 border border-white/10 text-slate-300'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1"><span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'0.1s'}} /><span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}} /></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Type your health question..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              disabled={loading}
            />
            <Button type="submit" loading={loading} disabled={!input.trim()}>Send</Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
