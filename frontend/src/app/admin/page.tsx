"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Booking {
  id: number
  email: string
  phone: string
  desiredCountry: string
  doctorReligion: string
  language: string
  interpreterNeeded: boolean
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(console.error)
  }, [])

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Verwaltung / Buchungen</h1>
      <div className="grid gap-4">
        {bookings.map(b => (
          <Card key={b.id}>
            <CardHeader>
              <CardTitle>Buchung #{b.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Email:</span> <span>{b.email}</span>
                <span className="font-semibold">Telefon:</span> <span>{b.phone}</span>
                <span className="font-semibold">Land:</span> <span>{b.desiredCountry}</span>
                <span className="font-semibold">Sprache:</span> <span>{b.language} {b.interpreterNeeded && "(Dolmetscher nötig)"}</span>
                <span className="font-semibold">Religion:</span> <span>{b.doctorReligion}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {bookings.length === 0 && <p>Keine Buchungen vorhanden.</p>}
      </div>
    </div>
  )
}
