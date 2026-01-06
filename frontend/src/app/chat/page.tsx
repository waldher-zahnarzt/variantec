"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from 'react-markdown'

interface Message {
  role: string
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hallo! Ich bin Ihr Assistent für Zahnarztreisen. Wie kann ich Ihnen helfen?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const newHistory = [...messages, { role: "user", content: input }]
    setMessages(newHistory)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newHistory }) 
      })
      const data = await res.json()
      
      if (data.response) {
          setMessages(prev => [...prev, { role: "model", content: data.response }])
      } else if (data.error) {
          setMessages(prev => [...prev, { role: "model", content: "Fehler: " + data.error }])
      }
    } catch (e) {
        setMessages(prev => [...prev, { role: "model", content: "Verbindungsfehler." }])
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl min-h-screen flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center">Chat Assistent</h1>
        <Card className="flex-grow flex flex-col h-[70vh]">
            <CardContent className="flex-grow overflow-auto p-4 space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && <div className="text-center text-sm text-gray-500">Schreibt...</div>}
            </CardContent>
            <div className="p-4 border-t flex gap-2">
                <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ihre Nachricht..." disabled={loading} />
                <Button onClick={send} disabled={loading}>Senden</Button>
            </div>
        </Card>
    </div>
  )
}
