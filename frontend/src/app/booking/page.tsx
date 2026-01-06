"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    desiredCountry: "",
    doctorReligion: "",
    language: "DE"
  })
  const [success, setSuccess] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const submit = async () => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) setSuccess(true)
    } catch (e) {
      console.error(e)
    }
  }

  if (success) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Vielen Dank!</CardTitle>
            <CardDescription>Wir haben Ihre Anfrage erhalten. Sie erhalten in Kürze einen Magic-Link zur Bestätigung.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Termin buchen - Schritt {step} von 3</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>E-Mail Adresse</Label>
                <Input value={formData.email} onChange={e => handleChange("email", e.target.value)} placeholder="mail@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Handynummer</Label>
                <Input value={formData.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+49..." />
              </div>
              <Button onClick={() => setStep(2)} className="w-full">Weiter</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Wunschland</Label>
                <Select onValueChange={v => handleChange("desiredCountry", v)}>
                  <SelectTrigger><SelectValue placeholder="Land auswählen" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ungarn">Ungarn</SelectItem>
                    <SelectItem value="Polen">Polen</SelectItem>
                    <SelectItem value="Türkei">Türkei</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ihre Sprache</Label>
                <Select onValueChange={v => handleChange("language", v)} defaultValue="DE">
                  <SelectTrigger><SelectValue placeholder="Sprache" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DE">Deutsch</SelectItem>
                    <SelectItem value="EN">Englisch</SelectItem>
                    <SelectItem value="TR">Türkisch</SelectItem>
                  </SelectContent>
                </Select>
                {formData.language !== "DE" && <p className="text-xs text-yellow-600">Dolmetscher wird automatisch angefordert.</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Zurück</Button>
                <Button onClick={() => setStep(3)} className="flex-1">Weiter</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Religion des Behandlers (Optional)</Label>
                <Select onValueChange={v => handleChange("doctorReligion", v)}>
                   <SelectTrigger><SelectValue placeholder="Keine Präferenz" /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Christentum">Christentum</SelectItem>
                     <SelectItem value="Islam">Islam</SelectItem>
                     <SelectItem value="Judentum">Judentum</SelectItem>
                     <SelectItem value="Keine">Keine Präferenz</SelectItem>
                   </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Zurück</Button>
                <Button onClick={submit} className="flex-1">Absenden</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
