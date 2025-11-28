import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, PaperclipIcon, VoiceIcon, VideoIcon, CheckDoubleIcon, PhoneIcon, VideoCameraIcon, BotIcon } from './common/icons';

const mockConversations = [
  { id: 1, name: 'Trip to Bo', lastMessage: 'See you there!', time: '10:42 AM', unread: 2, online: true, avatar: 'https://picsum.photos/seed/1/200' },
  { id: 2, name: 'Family Group', lastMessage: 'Alex: Are we meeting for dinner?', time: 'Yesterday', unread: 0, online: false, avatar: 'https://picsum.photos/seed/2/200' },
  { id: 3, name: 'Hotel Concierge', lastMessage: 'Your booking is confirmed.', time: 'Mar 15', unread: 0, online: true, avatar: 'https://picsum.photos/seed/3/200' },
  { id: 4, name: 'Jane Doe', lastMessage: 'Great, thanks!', time: 'Mar 14', unread: 0, online: false, avatar: 'https://picsum.photos/seed/4/200' }
];

interface ChatMessage {
    sender: 'me' | 'other';
    text: string;
    time: string;
    read?: boolean;
}

const initialMessages: ChatMessage[] = [
    { sender: 'other', text: 'Hey, are you ready for the trip tomorrow?', time: '10:40 AM', read: true },
    { sender: 'me', text: 'Almost! Just packing my last few things. So excited!', time: '10:41 AM', read: true },
    { sender: 'other', text: 'Awesome! I have the tickets. I\'ll pick you up at 8 AM.', time: '10:41 AM', read: true },
    { sender: 'me', text: 'Perfect. See you there!', time: '10:42 AM', read: true },
];

const Chat: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  const sendMessage = (text: string) => {
      if (text.trim() === '') return;
      const newMessage: ChatMessage = { 
          sender: 'me', 
          text, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
      };
      setMessages(prev => [...prev, newMessage]);

      // Simulate read receipt
      setTimeout(() => {
          setMessages(prev => prev.map(msg => msg === newMessage ? {...msg, read: true} : msg));
      }, 800);

      if(text.startsWith('[File:') || text.startsWith('[Video Sent]') || text.startsWith('[Voice Note]')) return;
      
      // Simulate typing indicator and reply
      setIsTyping(true);
      setTimeout(() => {
          setIsTyping(false);
          const reply: ChatMessage = { 
              sender: 'other', 
              text: 'Sounds good!', 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              read: true
          };
          setMessages(prev => [...prev, reply]);
      }, 1500);
  };

  const handleSendText = () => {
      sendMessage(input);
      setInput('');
  }
  
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) { // 2MB limit
              alert('File size exceeds 2MB limit.');
          } else {
              sendMessage(`[File: ${file.name}]`);
          }
          event.target.value = ''; // Reset file input
      }
  };

  const handleSendMedia = (type: 'Voice' | 'Video') => {
      if (type === 'Voice') {
          sendMessage('[Voice Note]');
      } else {
          sendMessage('[Video Sent]');
      }
  }


  return (
    <div className="flex h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
      {/* Sidebar for conversations */}
      <div className={`w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col ${selectedConversation && 'hidden md:flex'}`}>
        <header className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chats</h1>
        </header>
        <div className="flex-grow overflow-y-auto">
          {mockConversations.map(convo => (
            <div key={convo.id} onClick={() => { setSelectedConversation(convo); setMessages(initialMessages); }} className={`flex items-center p-3 cursor-pointer transition-colors border-b border-slate-200 dark:border-slate-800 ${selectedConversation?.id === convo.id ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'}`}>
              <div className="relative">
                <img src={convo.avatar} alt={convo.name} className="w-12 h-12 rounded-full object-cover" />
                {convo.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900"></span>}
              </div>
              <div className="flex-grow ml-3">
                <p className="font-semibold text-sm">{convo.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{convo.lastMessage}</p>
              </div>
              <div className="flex flex-col items-end text-xs text-slate-500 dark:text-slate-400">
                <p>{convo.time}</p>
                {convo.unread > 0 && <span className="mt-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{convo.unread}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main chat window */}
      <div className={`w-full md:w-2/3 flex flex-col ${!selectedConversation && 'hidden md:flex'}`}>
        {selectedConversation ? (
          <>
            <header className="flex items-center p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                <button onClick={() => setSelectedConversation(null)} className="md:hidden mr-2 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
              <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="ml-3 flex-grow">
                <p className="font-semibold text-sm">{selectedConversation.name}</p>
                <p className={`text-xs ${selectedConversation.online ? 'text-green-500' : 'text-slate-500'}`}>{selectedConversation.online ? 'Online' : 'Offline'}</p>
              </div>
               <div className="flex items-center space-x-1">
                <button onClick={() => alert('Starting video call... (mock)')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <VideoCameraIcon />
                </button>
                 <button onClick={() => alert('Starting audio call... (mock)')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <PhoneIcon />
                </button>
              </div>
            </header>
            <div className="flex-grow p-4 overflow-y-auto space-y-2 bg-slate-200/50 dark:bg-slate-800/50" style={{backgroundImage: 'url(https://i.redd.it/qwd83nc4xxf41.png)', backgroundSize: 'contain'}}>
               {messages.map((msg, index) => (
                   <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`relative max-w-xs md:max-w-md py-2 px-3 rounded-lg shadow-sm text-sm ${msg.sender === 'me' ? 'bg-green-100 dark:bg-green-800/80' : 'bg-white dark:bg-slate-700'}`}>
                           <p className="pr-12">{msg.text}</p>
                           <div className="absolute bottom-1 right-2 flex items-center">
                            <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">{msg.time}</span>
                            {msg.sender === 'me' && <CheckDoubleIcon className={msg.read ? "text-blue-500" : "text-slate-400 dark:text-slate-500"} />}
                           </div>
                       </div>
                   </div>
               ))}
               {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>
                )}
               <div ref={messagesEndRef} />
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 flex items-center border-t border-slate-200 dark:border-slate-700">
                <div className="flex">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button onClick={handleFileUploadClick} className="p-2 text-slate-500 hover:text-blue-500"><PaperclipIcon /></button>
                    <button onClick={() => handleSendMedia('Voice')} className="p-2 text-slate-500 hover:text-blue-500"><VoiceIcon /></button>
                    <button onClick={() => handleSendMedia('Video')} className="p-2 text-slate-500 hover:text-blue-500"><VideoIcon /></button>
                </div>

              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                placeholder="Type a message..." 
                className="flex-grow bg-white dark:bg-slate-700 rounded-full py-2 px-4 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
              />
              <button onClick={handleSendText} className="bg-blue-500 p-2.5 rounded-full text-white hover:bg-blue-600">
                <SendIcon />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-slate-900">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
