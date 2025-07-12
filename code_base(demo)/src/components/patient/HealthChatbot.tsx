import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Heart, Brain, Pill, Activity } from 'lucide-react';
import { ChatMessage } from '../../types';
import { chatAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../common/LoadingSpinner';

const HealthChatbot: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { text: 'I have a fever', icon: Heart, category: 'symptoms' },
    { text: 'Blood pressure concerns', icon: Activity, category: 'health' },
    { text: 'Diet recommendations', icon: Pill, category: 'diet' },
    { text: 'Exercise guidance', icon: Brain, category: 'fitness' }
  ];

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;
      
      try {
        const history = await chatAPI.getHistory(user.id);
        if (history.length === 0) {
          // Add welcome message
          const welcomeMessage: ChatMessage = {
            id: 'welcome',
            patientId: user.id,
            message: t('chatbot.greeting'),
            isBot: true,
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        } else {
          setMessages(history);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [user, t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || !user) return;

    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const updatedMessages = await chatAPI.sendMessage(user.id, textToSend);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-xl p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">{t('chatbot.title')}</h1>
            <p className="text-green-100 text-sm">AI-powered health assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                message.isBot
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-green-600 text-white'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.isBot && (
                  <Bot className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.isBot ? 'text-gray-500' : 'text-green-100'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {!message.isBot && (
                  <User className="w-4 h-4 mt-1 text-green-100 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg max-w-xs">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-green-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question) => {
              const Icon = question.icon;
              return (
                <button
                  key={question.text}
                  onClick={() => handleQuickQuestion(question.text)}
                  className="flex items-center space-x-2 p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4 text-green-600" />
                  <span>{question.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chatbot.placeholder')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthChatbot;