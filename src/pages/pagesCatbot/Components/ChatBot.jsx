import React, { useState } from "react";
import { SendHorizontal } from "lucide-react";

export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
//Logica
const ChatInterface = () => {
  // Sistema de mensajes personalizado
  const systemMessage = {
    role: "system",
    content: `Eres Wizybot, un asistente amigable y profesional. Por favor:
    - Empieza la primera respuesta con buena ortografia y que empiza con "¡Hola! Soy Wizybot, tu experto en tecnologia." y sigue con "¿Qué puedo ayudarte hoy?, si necesitas ayuda adicional, por favor proporciona un correo elecrónico en caso de que se pierda la conexion."
    - Usa un tono conversacional y cercano
    - Mantén las respuestas concisas y claras
    - Usa emojis ocasionalmente para dar más calidez pero no todas la veces 
    - Si no entiendes algo, pide aclaraciones de manera amable
    - Ofrece ejemplos prácticos cuando sea relevante
    - Evita respuestas demasiado técnicas a menos que se soliciten específicamente
    - Intenta mantener un balance entre profesionalismo y cercanía`,
  };
  // mensaje de inicio para el la bienvenida
  const [messages, setMessages] = useState([
    systemMessage,
    {
      role: "assistant",
      content: "¡Hola! Estoy en línea si necesitas ayuda... 👋",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Función para procesar el mensaje antes de enviarlo
  const preprocessMessage = (message) => {
    // Detectar el tipo de consulta para personalizar la respuesta
    const keywords = {
      technical: ["código", "programación", "error", "bug", "función"],
      general: ["ayuda", "cómo", "qué es", "explicar"],
      greeting: ["hola", "buenos días", "buenas tardes", "buenos días"],
    };

    let context = "";

    if (
      keywords.technical.some((word) => message.toLowerCase().includes(word))
    ) {
      context =
        "Proporciona una respuesta técnica detallada con ejemplos si es posible.";
    } else if (
      keywords.greeting.some((word) => message.toLowerCase().includes(word))
    ) {
      context = "Responde de manera amigable y pregunta en qué puedes ayudar.";
    } else {
      context = "Proporciona una respuesta clara y concisa.";
    }

    return context;
  };

  const sendMessageToOpenAI = async (userMessage) => {
    setIsLoading(true);
    try {
      const context = preprocessMessage(userMessage);
      const apiMessages = [
        systemMessage,
        { role: "system", content: context },
        ...messages.filter((m) => m.role !== "system"),
        { role: "user", content: userMessage },
      ];

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: apiMessages,
            temperature: 0.7, // Ajusta la creatividad de las respuestas
            max_tokens: 1000, // Limita la longitud de las respuestas
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || `Error HTTP: ${response.status}`
        );
      }

      if (!data.choices?.[0]?.message) {
        throw new Error("Formato de respuesta inválido");
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error detallado:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      const userMessage = { role: "user", content: inputMessage };
      setMessages((prev) => [...prev, userMessage]);
      const currentMessage = inputMessage;
      setInputMessage("");

      try {
        const response = await sendMessageToOpenAI(currentMessage);
        const assistantMessage = { role: "assistant", content: response };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Lo siento, ha ocurrido un error. ¿Podrías intentarlo de nuevo? 🙇‍♂️\nError: ${
              error.message || "Hubo un problema al comunicarse con OpenAI"
            }`,
          },
        ]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Front chat de wizybot con OpenAI que permite enviar mensajes y recibir respuestas
  return (
    <div className="flex flex-col rounded-xl bg-gray-100 lg:mx-auto lg:w-[30%] lg:h-[90vh] lg:my-8 lg:rounded-xl lg:shadow-xl">
      {/* Header */}
      <div className="rounded-t-xl bg-gradient-to-r from-blue-950 to-indigo-500 text-white p-4 flex items-center space-x-2 lg:rounded-t-xl">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-xl">
            <img
              src="https://static.wixstatic.com/media/0abc3f_361e29410af046ec93e78ac409a4909e%7Emv2.png/v1/fill/w_32%2Ch_32%2Clg_1%2Cusm_0.66_1.00_0.01/0abc3f_361e29410af046ec93e78ac409a4909e%7Emv2.png"
              alt="logo Wizybot"
            />
          </span>
        </div>
        <div className="flex-col">
          <p className="text-sm text-left">Habla con </p>
          <h1 className="text-xl font-medium">Wizybot</h1>
        </div>
        <div> logo</div>
      </div>
      <div className="bg-gradient-to-r from-blue-950 to-indigo-500 text-white p-1 pl-8">
        <ul className="list-disc pl-5 text-green-600">
          <li>
            <p className="text-white text-left">Respondemos inmediatamente!</p>
          </li>
        </ul>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(
          (message, index) =>
            message.role !== "system" && (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] lg:max-w-[60%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-950 to-indigo-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            )
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg rounded-bl-none p-3 animate-pulse">
              Escribiendo...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t rounded-b-xl bg-white p-4 lg:rounded-b-xl">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ingrese su mensaje..."
            disabled={isLoading}
            className="flex-1 p-3 border rounded-full focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="p-3 bg-gradient-to-r from-blue-950 to-indigo-500 text-white rounded-full hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
