# CONCEPT — SolarProof

> Pflicht-Dokument nach [Standard 015](https://github.com/maxone-one/maxone-standards/blob/main/standards/015-concept-gate.md).
> Retroaktiv erstellt 2026-05-12 — Projekt läuft seit 2025.

---

## Problem

Solar-Installateure müssen Zertifizierungen und Qualifikationsnachweise digital
verwalten und gegenüber Kunden und Plattformen (wie voltfair) nachweisbar
bereitstellen — ohne Papierstapel oder manuelle Scan-Weiterleitungen.

## Ziel / Erfolgs-Kriterium

20+ Installateure verwalten Zertifikate vollständig digital; Zertifikat-Abruf
für Partnerplattformen unter 2 Sekunden.

## Nutzer

| Rolle              | Anonym? | Eingeloggt? | Zahlend? | Anzahl bei Launch |
|--------------------|---------|-------------|----------|-------------------|
| Installateur       | nein    | ja          | nein     | 10–30             |
| Admin              | nein    | ja          | nein     | 1                 |

## Datenmodell

| Entität           | Felder (Beispiele)                        | Sensitivität                       |
|-------------------|-------------------------------------------|------------------------------------|
| `users`           | email, company, role                      | personenbezogen (DSGVO Art. 4)     |
| `certifications`  | user_id, cert_type, issue_date, file_url  | berufsbezogen                      |

**Besondere Kategorien (Art. 9 DSGVO):** nein.
**DSFA fällig:** nein.

## Auth-Modell

| Entität           | Lesen             | Schreiben           | Löschen     |
|-------------------|-------------------|---------------------|-------------|
| `certifications`  | self + admin      | self (Upload)       | admin       |

**Implementierung:** Supabase RLS. React + Supabase client auth.

## Externe Dienste

| Dienst   | Zweck              | Region | AVV/DPA       | Datenkategorie     |
|----------|--------------------|--------|----------------|---------------------|
| Hetzner  | Hosting            | EU     | ✅ Standard    | alle                |
| Supabase | Auth + DB + Storage| EU     | ✅ Pro-Plan    | User, Cert-Files    |

## Threat-Model (Top 2)

1. **Risiko:** Gefälschte Zertifikate hochgeladen
   **Abwehr:** Admin-Review vor Veröffentlichung; AI-Vision-Check (Claude) geplant

2. **Risiko:** Unbefugter Zugriff auf Zertifikate anderer Nutzer
   **Abwehr:** Supabase RLS user_id-Filter

## Stack-Wahl

| Schicht             | Wahl             | Warum?                    |
|---------------------|------------------|---------------------------|
| Frontend Framework  | React + Vite     | Standard für SPA          |
| DB + Storage        | Supabase         | Auth + File-Storage       |
| Hosting             | Hetzner          | EU, eigene Infra          |

## Out of Scope

- Mobile App
- Öffentliches Installer-Verzeichnis (liegt in voltfair)

---

## Gate 1 — Konzept-Sign-Off

- **Vorgeschlagen von:** Max Karastelev (@karastoni) am 2025-01-01
- **Reviewed von:** Max Karastelev (@karastoni) am 2026-05-12 (retroaktiver Gate-1)
- **Gate 1:** PASSIERT
- **Bekannte Risiken:** AI-Vision-Zertifikat-Check vor Prod-Rollout testen
- **DSFA fällig (DSGVO Art. 35):** nein — geprüft am 2026-05-12
- **Standard 016 (Stack-Whitelist) konform:** ja
