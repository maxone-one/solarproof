# PRD — Anwalt-Modus & Multi-User-Kollaboration

> Abgeleitet aus Sprachmemo Max Karastelev, 2026-05-18.
> Vorgänger-Konzept: [CONCEPT.md](./CONCEPT.md)
> Status: **Draft — nicht freigegeben**

---

## Problem

SolarProof ist heute ein Einzelnutzer-Tool. Anwalt und Mandant arbeiten
getrennt — der Anwalt bekommt ein PDF, kennt aber nicht den genauen
Zustand der Diagnose, die Import-Qualität oder die Simulations-Parameter.
Wenn er Fragen stellt, muss der Mandant erklären, was er auf dem Bildschirm
sieht. Das kostet Zeit, erzeugt Fehler und skaliert nicht.

---

## Vision (Originalton Max, 2026-05-18)

> „Dann sitzt der Anwalt und ruft kurz an — sagt Robert, setz dich mal
> kurz an den PC, lass mal kurz an deinem Fall arbeiten. Du gehst dran,
> er sitzt dran, ihr macht auf und wisst, wovon ihr redet, weil ihr beide
> dieselbe Oberfläche vor der Nase habt."

**Kern-Pivot:** Unser Kunde ist nicht mehr der SENEC-Geschädigte.
Unser Kunde ist der Anwalt — er zahlt, er verwaltet, er bringt seine
Mandanten mit.

---

## Phasen-Plan

### Phase 0 — Validation (jetzt, vor allem anderen)

**Ziel:** 5 echte Fälle mit echten SENEC-Geschädigten durchspielen.

**Abnahme-Kriterien:**
- Alle 5 Nutzer haben Meilenstein 5 (Briefing) abgeschlossen
- Alle 5 geben subjektive Zufriedenheit ≥ 4/5
- Mindestens 3 haben das PDF tatsächlich an einen Anwalt gesendet

**Ergebnis (bei Erfolg):** Freigabe für Phase 1.
**Ergebnis (bei Fail):** Iterieren, nicht weiterbauen.

---

### Phase 1 — Social Proof

**Ziel:** 5 verifizierte Testimonials, die zeigen: „Hat mir geholfen,
wir haben gewonnen."

**Format pro Testimonial:**
- Vorname + anonymisierter Nachname (z. B. „Klaus M.")
- SENEC-Modell und Defektart
- Ergebnis (außergerichtlich / gewonnen / Vergleich)
- Zitat (1–2 Sätze, im Originalton)
- Optional: Anwalt-Bestätigung

**Verwendung:**
- Trust-Strip im Tool (erweiterbar via CMS)
- Gesonderte Landing-Page-Sektion
- Direkte Referenz in Anwalt-Akquise-Gesprächen

**Abnahme:** 5 vollständige, belegbare Einträge — dann weiter.

---

### Phase 2 — Anwalt-Dashboard & geteilte Fallansicht

**Kern-Feature:** Ein Anwalt-Account sieht alle ihm zugeordneten Mandantenfälle
in einer Übersicht und kann jeden Fall in demselben Interface öffnen, das der
Mandant sieht.

#### 2a — Neue Rolle: `lawyer`

| Eigenschaft       | Wert                                      |
|-------------------|-------------------------------------------|
| Supabase-Rolle    | `app_metadata.role = 'lawyer'`            |
| Vergabe           | manuell durch Admin (Max / Robert)        |
| Auth              | OTP wie alle anderen Nutzer               |
| Sichtbarkeit      | eigenes Dashboard statt Milestone-View    |

#### 2b — Anwalt-Dashboard

Statt der 5-Milestone-Ansicht sieht ein `lawyer`-User nach Login:

```
┌─────────────────────────────────────────────────────┐
│  Meine Fälle                                         │
├────────────────┬──────────────┬──────────────────────┤
│  Mandant       │  Stand       │  Letzte Änderung     │
├────────────────┼──────────────┼──────────────────────┤
│  Klaus M.      │  M3 Analyse  │  heute 14:32         │
│  Sabine W.     │  M5 Briefing │  gestern             │
│  …             │  …           │  …                   │
└────────────────┴──────────────┴──────────────────────┘
```

- Klick auf einen Fall: öffnet dieselbe 5-Milestone-Ansicht wie der Mandant,
  aber **read-only** (Phase 2, kein Co-Editing)
- Anwalt sieht: Diagnose-Ergebnis, Ampel, Import-Status, Simulations-Werte, PDF

#### 2c — Fall teilen (Mandant → Anwalt)

Der Mandant kann nach Login seinen Fall per E-Mail-Eingabe mit einem Anwalt
teilen:

1. Mandant klickt „Mit Anwalt teilen" (neuer Button in M5 oder Header)
2. Gibt Anwalt-E-Mail-Adresse ein
3. `sp_cases.shared_with` wird auf `lawyer_user_id` gesetzt (nach Lookup)
4. Anwalt sieht den Fall sofort in seinem Dashboard

**Alternativ (spätere Iteration):** Anwalt schickt Mandant einen Einladungs-Link.

#### 2d — Collaboration-Session (synchron, kein Realtime-Aufwand)

Der Collaboration-Use-Case ist ein **Telefongespräch**, kein Live-Edit.
Kein WebSocket, kein CRDT — Page-Reload reicht:

> Anwalt ruft an → beide öffnen solarproof.voltfair.de → Anwalt gibt
> Anleitung, Mandant klickt → beim nächsten Öffnen sieht der Anwalt
> den neuen Stand.

Realtime-Sync (Cursor, Live-Edit) ist **Out of Scope** für Phase 2.

---

## Datenmodell-Delta zu CONCEPT.md

```sql
-- sp_cases (bereits vorhanden, Ergänzung)
ALTER TABLE sp_cases ADD COLUMN shared_with uuid REFERENCES auth.users(id);
CREATE INDEX ON sp_cases(shared_with);

-- RLS
CREATE POLICY "Lawyer reads shared cases"
  ON sp_cases FOR SELECT
  USING (shared_with = auth.uid());
```

Lawyers-Tabelle (öffentliche Anwaltsdaten) bleibt unverändert.

---

## Nutzer-Tabelle (aktualisiert)

| Rolle              | Login? | Ansicht             | Zahlend? |
|--------------------|--------|---------------------|----------|
| SENEC-Geschädigter | opt-in | 5-Milestone-Flow    | nein     |
| `lawyer`           | ja     | Anwalt-Dashboard    | **ja**   |
| `admin`            | ja     | Admin-Overlay       | nein     |

---

## Out of Scope (Phase 2)

- Realtime-Kollaboration (Live-Cursor, Co-Edit)
- Mandanten-Einladungs-Link durch Anwalt
- Mehrere Anwälte pro Fall
- Anwalt-Zahlung / Subscription (kommt in Phase 3)
- Mobile App

---

## Abhängigkeiten

| Item                              | Wer        | Wann              |
|-----------------------------------|------------|-------------------|
| 5 Testfälle rekrutieren           | Max+Robert | Phase 0           |
| Testimonial-Format abstimmen      | Max        | vor Phase 1       |
| Anwalt-Pilot-Partner finden       | Robert     | parallel Phase 1  |
| `shared_with`-Spalte in Supabase  | Claude     | Start Phase 2     |
| Design Anwalt-Dashboard           | Max+Claude | Start Phase 2     |

---

## Gate 2 — Phase-0-Abnahme

- [ ] 5 Fälle abgeschlossen
- [ ] 5 × Zufriedenheit ≥ 4/5
- [ ] 3 × PDF an Anwalt gesendet (belegt)
- [ ] Kein kritischer Bug im Feld
- **Freigabe durch:** Max Karastelev
- **Dann:** Phase 1 starten
