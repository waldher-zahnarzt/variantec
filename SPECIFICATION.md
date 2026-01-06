# Spezifikation für Zahnarztreisen - Variante C

## Überblick
Variante C ist eine Ausprägung der Zahnarztreisen-Plattform, die sich auf die Vermittlung von Zahnarztterminen im Ausland spezialisiert.

## Funktionale Anforderungen

### 1. Öffentliches Portal (Homepage)
- **Übersicht:** Einführung in das Konzept von Zahnarztreisen.
- **Informationen:** Erklärungen zu den Reisen und kurze, prägnante Informationen über mögliche Förderungen (Zuschüsse).
- **Navigation:** Klarer Einstieg in den Buchungsprozess (Chatbot oder Formular).

### 2. Terminbuchung
Der Benutzer kann eine Reise und einen Zahnarzttermin auf zwei Wegen buchen:
1.  **KI-gestützter Chatbot:** Führt dialogbasiert durch den Prozess.
2.  **Mehrseitiges Formular (Wizard):** Schritt-für-Schritt-Abfrage der Daten.

**Erforderliche Daten:**
- **Kontakt:** E-Mail-Adresse oder Handynummer (zwingend erforderlich für Bestätigung).
- **Reisepräferenzen:** Wunschland.
- **Behandlerpräferenzen:** Religion des Behandlers.

### 3. Sprache & Dolmetscher
- Erfassung der bevorzugten Sprache des Nutzers.
- **Dolmetscher-Check:** Wenn die Sprache nicht Deutsch ist, wird automatisch vermerkt, dass ggf. ein Dolmetscher benötigt wird.

### 4. Terminverwaltung & Magic Link
- **Zugriff:** Benutzer können ihre Termindetails über einen "Magic Link" abrufen.
- **Versand:** Der Link wird theoretisch per E-Mail, SMS oder WhatsApp versendet.
- **Simulation:** Da keine echten Mails/SMS/WhatsApp-Nachrichten versendet werden können, wird dieser Vorgang im System simuliert (z.B. Ausgabe im Log oder Anzeige eines "Simulations-Postfachs" im Frontend).

### 5. Backoffice / Verwaltung
- Bestätigung der Termine durch einen Mitarbeiter (weiterhin gültig).

## Technische Architektur

### Frontend
- **Framework:** Next.js
- **UI-Library:** shadcn/ui
- **Kommunikation:** REST API zum Backend.

### Backend
- **Framework:** Spring Boot
- **Sprache:** Java (OpenJDK 21)
- **Datenbank:** (TBD - z.B. H2 für Dev, PostgreSQL für Prod)

### Infrastruktur
- **Hosting:** Google Kubernetes Engine (GKE) Autopilot
- **Ingress:** GCE Ingress
- **Domain:** `variantec.zahnarzt.waldher.com`

## Simulations-Hinweis
Alle externen Kommunikationskanäle (E-Mail, SMS, WhatsApp) sind zu simulieren. Es findet kein realer Versand statt.
