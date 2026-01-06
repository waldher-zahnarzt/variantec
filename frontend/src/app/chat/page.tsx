"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Hallo! Ich bin Ihr Assistent für Zahnarztreisen. Wie kann ich Ihnen helfen? Ich spreche viele Sprachen!" }
  ])
  const [input, setInput] = useState("")

  const send = async () => {
    if (!input.trim()) return
    const newMsg = { role: "user", content: input }
    setMessages(prev => [...prev, newMsg])
    setInput("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.response || "Entschuldigung, ein Fehler ist aufgetreten." }])
    } catch (e) {
        setMessages(prev => [...prev, { role: "assistant", content: "Verbindungsfehler." }])
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl min-h-screen flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center">Chat Assistant</h1>
        <Card className="flex-grow flex flex-col">
            <CardContent className="flex-grow overflow-auto p-4 space-y-4 max-h-[70vh]">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                            {m.content}
                        </div>
                    </div>
                ))}
            </CardContent>
            <div className="p-4 border-t flex gap-2">
                <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ihre Nachricht..." />
                <Button onClick={send}>Senden</Button>
            </div>
        </Card>
    </div>
  )
}
