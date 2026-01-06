import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Zahnarztreisen (Variante C)</h1>
          <nav>
            <Link href="/booking" className="text-gray-600 hover:text-blue-600">Buchung</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow space-y-8">
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold mb-4">Ihr Lächeln, unsere Mission</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Sparen Sie bis zu 70% bei Zahnbehandlungen im Ausland bei höchster Qualität.
            Wir kümmern uns um alles – von der Terminvereinbarung bis zur Reise.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/booking">
              <Button size="lg">Jetzt Termin vereinbaren</Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="lg">Chatbot nutzen</Button>
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Die Förderung</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Viele Krankenkassen übernehmen auch im Ausland einen Teil der Kosten (Festzuschuss).
                Zusätzlich bieten wir spezielle Förderprogramme für Reisekosten an.
                Informieren Sie sich über Ihre Möglichkeiten!
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Warum Ausland?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Modernste Kliniken</li>
                <li>Deutschsprachige Betreuung</li>
                <li>Keine langen Wartezeiten</li>
                <li>Kombinierbar mit einem Kurzurlaub</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Zahnarztreisen Waldher</p>
      </footer>
    </div>
  );
}
