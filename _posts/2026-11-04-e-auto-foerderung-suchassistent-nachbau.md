---
layout: post
title: "E-Auto-Förderung: Suchassistent Nachbau"
date: 2026-11-04
permalink: /2026/11/04/e-auto-foerderung-suchassistent-nachbau/
description: "Ein täglicher Preis- und Prämien-Check für ein kleines E-Auto: Was er prüft, wie er rechnet, wann er schweigt – und wie du ihn in Claude, ChatGPT oder Grok nachbaust."
excerpt: "Ein täglicher Preis- und Prämien-Check für ein kleines E-Auto: Was er prüft, wie er rechnet, wann er schweigt – und wie du ihn in Claude, ChatGPT oder Grok nachbaust."
categories:
  - e-auto
  - ki
tags:
  - e-auto
  - ki
image: /assets/posts/2026-11-04-e-auto/hero-ev-tablet-v2.jpg
image_alt: "Kompaktes Elektroauto in der Einfahrt, auf der Motorhaube ein Tablet mit Preisvergleich"
image_caption: "Ein kleines E-Auto, ein Tablet, eine Frage: Was kostet es heute wirklich?"
image_width: 1280
image_height: 720
---

Eine deutsche Familie sucht ein kleines E-Auto. Der Zielpreis liegt bei rund 15.000 € nach Prämie. Prämien, Listenpreise und Herstelleraktionen ändern sich laufend, und kaum jemand hat Lust, jeden Tag fünf Websites abzuklappern. Also übernimmt das ein KI-Assistent: Er prüft einmal am Tag, rechnet den Nettopreis und meldet sich nur, wenn sich etwas Relevantes getan hat.

Dieser Beitrag beschreibt ein echtes Bot-Setup, anonymisiert. Du kannst es in Claude, ChatGPT oder Grok nachbauen.

## Was der Assistent tut

Der Assistent hat einen engen Auftrag: kleine E-Autos für eine Familie, Nettopreis nach BAFA-Förderung um 15.000 € (Beispielrahmen). Er beobachtet ein paar Favoriten, im Beispiel Citroën ë-C3, Fiat Grande Panda Elektro und Hyundai Inster, und lässt die Klasse für Alternativen offen. Täglich prüft er vier Dinge: die Förderung, die Listenpreise, laufende Herstelleraktionen und neue Modelle, die in den Markt kommen.

Nebenbei rechnet er Finanzierung und Leasing durch, vergleicht Ausstattungen und schätzt den Restwert des Altwagens. Der wichtigste Teil ist aber eine Regel: **Ändert sich nichts Relevantes, schickt er keine Nachricht.**

## Der tägliche Loop

Jeden Morgen gegen 9 Uhr (Europe/Berlin) läuft dieselbe Schleife:

| Schritt | Was passiert | Wozu |
|---|---|---|
| 1. Baseline laden | Letzten bekannten Stand aus `baseline.md` lesen | Vergleichsbasis statt Bauchgefühl |
| 2. Recherchieren | Förderung, Listenpreise, Aktionen, Neuheiten prüfen | Aktuelle Fakten, jede mit Quelle |
| 3. Rechnen | Listenpreis → Herstellerbonus → BAFA → Nettopreis | Vergleichbare Zahl pro Modell |
| 4. Vergleichen | Neuer Stand gegen Baseline | Delta erkennen |
| 5. Entscheiden | Relevante Änderung? | Melden oder still bleiben |
| 6. Festhalten | `changelog.md` ergänzen, Baseline aktualisieren | Nachvollziehbare Historie |

Typische Quellen: BAFA und BMUV für die Förderung, Hersteller-Preislisten und Pressemitteilungen, ADAC, electrive, carwow, AutoScout24, mobile.de und Online-Vermittler.

<figure class="day-flow">
  <ol class="day-flow-steps">
    <li>
      <span class="day-flow-mark" aria-hidden="true"></span>
      <span class="day-flow-body"><span class="day-flow-when">09:00</span><strong>Routine startet</strong></span>
    </li>
    <li>
      <span class="day-flow-mark" aria-hidden="true"></span>
      <span class="day-flow-body"><strong>baseline.md laden</strong></span>
    </li>
    <li>
      <span class="day-flow-mark" aria-hidden="true"></span>
      <span class="day-flow-body"><strong>Web-Recherche</strong><span class="day-flow-note">Förderung, Preise, Aktionen, Neuheiten</span></span>
    </li>
    <li>
      <span class="day-flow-mark" aria-hidden="true"></span>
      <span class="day-flow-body"><strong>Nettopreis rechnen</strong></span>
    </li>
    <li>
      <span class="day-flow-mark" aria-hidden="true"></span>
      <span class="day-flow-body"><strong>Mit der Baseline vergleichen</strong></span>
    </li>
  </ol>
  <p class="day-flow-q">Relevante Änderung?</p>
  <div class="day-flow-split">
    <div class="day-flow-branch">
      <span class="day-flow-tag">nein</span>
      <strong>still bleiben</strong>
      <p>nur Prüfdatum notieren</p>
    </div>
    <div class="day-flow-branch day-flow-branch-yes">
      <span class="day-flow-tag">ja</span>
      <strong>Meldung mit Zahl, URL und Datum</strong>
      <p>changelog.md und baseline.md aktualisieren</p>
    </div>
  </div>
  <figcaption>Sechs Schritte, ein Ergebnis: melden oder schweigen.</figcaption>
</figure>

<figure class="morning" data-morning>
  <div class="morning-bar">
    <p class="morning-kicker">Jeden Morgen, 9:00</p>
    <button type="button" class="morning-pause" data-morning-pause hidden aria-pressed="false">Animation anhalten</button>
  </div>
  <div class="morning-live" aria-hidden="true">
    <p class="morning-clock" data-clock>09:00 <span>Europe/Berlin · Beispiel</span></p>
    <div class="morning-board">
      <div class="morning-card" data-base>
        <span class="morning-label">Baseline</span>
        <span class="morning-price">15.760&nbsp;€</span>
        <span class="morning-meta">3. Nov. 2026</span>
      </div>
      <div class="morning-card" data-same>
        <span class="morning-label">Neuer Stand</span>
        <span class="morning-price">15.760&nbsp;€</span>
        <span class="morning-meta">4. Nov. 2026</span>
      </div>
      <div class="morning-card" data-delta>
        <span class="morning-label">Neuer Stand</span>
        <span class="morning-price">14.890&nbsp;€</span>
        <span class="morning-meta">4. Nov. 2026</span>
      </div>
      <p class="morning-still" data-still>still</p>
      <div class="morning-alert" data-alert>
        <p class="morning-alert-kicker">Meldung</p>
        <p class="morning-alert-number">−870&nbsp;€</p>
        <p class="morning-alert-source">Quelle · Hersteller-Preisliste</p>
        <p class="morning-alert-date">4. Nov. 2026</p>
      </div>
    </div>
  </div>
  <div class="morning-static" aria-hidden="true">
    <div class="morning-case">
      <p class="morning-case-label">Delta null</p>
      <div class="morning-pair">
        <div class="morning-card">
          <span class="morning-label">Baseline</span>
          <span class="morning-price">15.760&nbsp;€</span>
          <span class="morning-meta">3. Nov. 2026</span>
        </div>
        <div class="morning-card">
          <span class="morning-label">Neuer Stand</span>
          <span class="morning-price">15.760&nbsp;€</span>
          <span class="morning-meta">4. Nov. 2026</span>
        </div>
      </div>
      <p class="morning-still">still</p>
    </div>
    <div class="morning-case">
      <p class="morning-case-label">Preis geändert</p>
      <div class="morning-pair">
        <div class="morning-card">
          <span class="morning-label">Baseline</span>
          <span class="morning-price">15.760&nbsp;€</span>
          <span class="morning-meta">3. Nov. 2026</span>
        </div>
        <div class="morning-card">
          <span class="morning-label">Neuer Stand</span>
          <span class="morning-price">14.890&nbsp;€</span>
          <span class="morning-meta">4. Nov. 2026</span>
        </div>
      </div>
      <div class="morning-alert">
        <p class="morning-alert-kicker">Meldung</p>
        <p class="morning-alert-number">−870&nbsp;€</p>
        <p class="morning-alert-source">Quelle · Hersteller-Preisliste</p>
        <p class="morning-alert-date">4. Nov. 2026</p>
      </div>
    </div>
  </div>
  <figcaption>Jeden Morgen um 9 Uhr stehen Baseline und neuer Stand nebeneinander. Ist das Delta null, blendet die Szene auf „still“. Springt der Nettopreis, erscheint eine einzelne Meldung mit Zahl, Quelle und Datum. Im Beispiel bleibt er bei 15.760&nbsp;€ oder fällt auf 14.890&nbsp;€, dann lautet die Meldung −870&nbsp;€, Quelle Hersteller-Preisliste, 4.&nbsp;Nov.&nbsp;2026. Beispielwerte, keine aktuellen Angebote.</figcaption>
</figure>

## Baseline, Changelog und „still, wenn gleich“

Zwei einfache Markdown-Dateien bilden das Gedächtnis des Assistenten:

- **`baseline.md`**: der aktuelle Stand pro Modell, also Listenpreis, Aktion mit Enddatum, Förderstufe, Nettopreis, jeweils mit URL und Abrufdatum.
- **`changelog.md`**: jede relevante Änderung mit Datum, alter Wert, neuer Wert, Quelle.

Kriterien, Zielpreis und Favoriten liegen zusätzlich im dauerhaften Speicher (Memory) des Assistenten. Dort stehen die Regeln, in den Dateien die Daten.

„Relevant“ muss man festlegen, sonst wird der Bot zur Spam-Quelle. Ein sinnvoller Rahmen:

- Förderung neu, geändert oder beendet
- Nettopreis eines Favoriten ändert sich spürbar (Schwelle selbst wählen, etwa einige hundert Euro)
- Neue oder auslaufende Herstelleraktion
- Neues Modell in der Klasse, das den Zielpreis erreichen könnte

Alles andere landet höchstens als Prüfvermerk im Log. Für dich heißt das: keine Nachricht ist auch eine Information, nämlich dass sich nichts geändert hat.

## Deal-Mathe: Was kostet das Auto wirklich?

Die Rechnung ist immer dieselbe, und der Assistent zeigt jeden Schritt:

1. **Listenpreis** laut Hersteller-Preisliste
2. **minus Herstellerbonus** (Aktion, mit Enddatum und Bedingungen)
3. **minus BAFA-Förderung**, und zwar die Stufe, die für den eigenen Haushalt gilt (zum Beispiel mit Kinderbonus), nicht die Maximalprämie aus der Schlagzeile
4. **= Nettopreis**
5. **Überführung und Zulassung separat** ausweisen, weil sie in Werbepreisen oft fehlen

<figure class="post-figure">
  <img src="{{ '/assets/posts/2026-11-04-e-auto/technikkreis-carl-statistik-c3-v4.png' | relative_url }}" alt="Wasserfall-Diagramm: Listenpreis, minus Herstellerbonus, minus BAFA, ergibt Nettopreis; Hinweis auf Vorstrecken" width="2000" height="992" loading="lazy" decoding="async">
  <figcaption>Vom Listenpreis zum Nettopreis. Beispielwerte, keine aktuellen Angebote. Die BAFA-Förderung kommt erst nach der Zulassung, bis dahin streckst du sie vor.</figcaption>
</figure>

**Vorstrecken nicht vergessen.** Die Förderung wird erst nach Antrag und Zulassung ausgezahlt. Beim Kauf zahlst du also den Preis *vor* BAFA und bekommst das Geld später zurück. Der Assistent nennt deshalb immer zwei Zahlen: den Nettopreis und den Betrag, der bis zur Auszahlung gebunden ist. Für ein Familienbudget macht das einen echten Unterschied.

Dazu kommen drei Prüfpunkte bei Aktionen:

- **Enddatum**: Gilt der Deal noch, wenn das Auto erst in drei Monaten zugelassen wird?
- **Nachweise**: Was verlangt Hersteller oder Händler (Inzahlungnahme, Haltedauer, Wohnsitz)?
- **Kombinierbarkeit**: Lässt sich der Herstellerbonus überhaupt mit der Förderung oder einer zweiten Aktion stapeln?

## Nachbau in Claude, ChatGPT oder Grok

Auf allen drei Plattformen gleich ist das **Prinzip**: ein fester Auftrag (Prompt), Websuche, ein Ort für Baseline und Changelog und eine klare Melde-Regel. Unterschiedlich sind vor allem zwei Dinge, nämlich wo der Zustand liegt und wer den täglichen Start auslöst.

<div class="compare">
  <div class="compare-row">
    <p class="compare-key">Auftrag</p>
    <ul>
      <li><span>Claude</span> Project mit Projekt-Anweisungen</li>
      <li><span>ChatGPT</span> Custom GPT oder Project mit Anweisungen</li>
      <li><span>Grok</span> Grok Bot mit Anweisungen und Memory</li>
    </ul>
  </div>
  <div class="compare-row">
    <p class="compare-key">Baseline/Changelog</p>
    <ul>
      <li><span>Claude</span> Als Projektdateien hinterlegen, nach jedem Lauf aktualisieren</li>
      <li><span>ChatGPT</span> Als Dateien im Project/GPT, nach jedem Lauf aktualisieren</li>
      <li><span>Grok</span> Dateien auf dem Bot-Rechner (<code>baseline.md</code>, <code>changelog.md</code>)</li>
    </ul>
  </div>
  <div class="compare-row">
    <p class="compare-key">Täglicher Start</p>
    <ul>
      <li><span>Claude</span> Je nach Version: geplante Aufgabe oder manuell anstoßen</li>
      <li><span>ChatGPT</span> Je nach Plan: geplante Aufgabe oder manuell anstoßen</li>
      <li><span>Grok</span> Routine, täglich ~9 Uhr, mit Intent-Prompt</li>
    </ul>
  </div>
  <div class="compare-row">
    <p class="compare-key">„Still, wenn gleich“</p>
    <ul>
      <li><span>Claude</span> Im Prompt festlegen</li>
      <li><span>ChatGPT</span> Im Prompt festlegen</li>
      <li><span>Grok</span> Im Prompt der Routine festlegen: keine Nachricht ohne Änderung</li>
    </ul>
  </div>
</div>

Die Funktionsnamen und -umfänge ändern sich schnell. Prüf vor dem Nachbau, was dein Tarif gerade kann. Wenn es keine Zeitplanung gibt, reicht auch ein fester Kalendertermin, bei dem du den Assistenten selbst anstößt. Die Logik mit Baseline, Vergleich und Melde-Regel bleibt dieselbe.

**Der heikelste Punkt ist der Zustand.** Wenn der Assistent die Baseline nicht zuverlässig lesen *und* zurückschreiben kann, vergleicht er gegen nichts und meldet jeden Tag alles. Teste das zuerst, mit zwei Läufen hintereinander. Der zweite sollte still bleiben.

## Prompt-Kern zum Kopieren

Anonymisiert und leicht gekürzt. Ersetze `X`, Förderstufe und Favoriten durch deine Werte.

```text
Du bist mein E-Auto-Kauf-Assistent.
- Ziel: kleines E-Auto für eine Familie, Nettopreis nach BAFA ca. X €.
- Rechne mit der konkreten BAFA-Stufe meines Haushalts, nicht mit der Maximalprämie.
- Prüfe täglich: Förderung, Listenpreise, Herstelleraktionen, neue Modelle der Klasse.
- Vergleiche mit baseline.md und changelog.md. Melde dich nur bei relevanter Änderung, sonst keine Nachricht.
- Nenne zu jeder Zahl Quelle (URL) und Abrufdatum. Erfinde keine Preise.
- Zeige Nettopreis UND den Betrag, den ich bis zur BAFA-Auszahlung vorstrecken muss.
- Bei Aktionen: Enddatum, nötige Nachweise, Kombinierbarkeit mit Förderung und anderen Aktionen.
- Bei Finanzierung/Leasing: Gesamtkosten, Schlussrate, Überführung separat.
- Achte auf Sitzplätze und Familientauglichkeit, wenn relevant.
- Aktualisiere nach jedem Lauf baseline.md und changelog.md.
```

## Was du bewusst weglässt

- **Kein Kauf, kein Vertrag** ohne ausdrücklichen Auftrag. Der Assistent recherchiert und rechnet, er unterschreibt nichts.
- **Keine erfundenen Preise.** Ohne Quelle gibt es keine Zahl, dann lieber „nicht gefunden“.
- **Kein täglicher Noise.** Eine „Heute nichts Neues“-Nachricht gewöhnt dich nur ans Wegklicken.
- **Keine Finanz- oder Rechtsberatung.** Er rechnet Varianten durch, die Entscheidung triffst du.
- **Keine Prämien-Garantie.** Wer später zulässt, bekommt die Förderung womöglich nicht mehr, und das schreibt der Assistent auch dazu.
- **Keine persönlichen Daten im Prompt, die er nicht braucht.** Die Förderstufe reicht, Einkommen oder Adresse gehören nicht hinein.

## Fazit

Ein guter Kauf-Assistent fällt vor allem dadurch auf, dass er selten etwas schickt. Baseline, Changelog und eine klare Melde-Regel sind dabei wichtiger als die Wahl der Plattform. Wenn die Mathe stimmt, also Nettopreis plus Vorstrecken, jeweils mit Quelle, ist die Nachricht, die dann kommt, auch etwas wert.
