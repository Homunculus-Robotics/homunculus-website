---
title: Der Sandkasten — Homunculus Robotics
description: BuilderLayer ist ein Web-Sandkasten, in dem Roboterteile wie digitales LEGO zusammengesteckt werden — und die Physik-Engine sagt vom ersten Zug an Ja oder Nein. Noch nicht öffentlich — hier steht, was es ist und wo es steht.
hero:
  eyebrow: Produkt Ⅰ — BuilderLayer
  headline: Teile zusammenstecken.
  headlineAccent: Die Engine sagt Ja oder Nein.
  lede: Ein Web-Sandkasten, in dem ein Roboter zusammengesteckt wird wie LEGO — und jede akzeptierte Konstruktion
  ledeEm: lädt garantiert, steht stabil und ist ansteuerbar.
  status: In Entwicklung — noch nicht öffentlich
  ctas:
    - { label: Bescheid geben, wenn es öffnet, href: '#access' }
    - { label: Solange einen Körper erfinden, href: /designchallenge }
walls:
  eyebrow: 01 — Warum es das noch nicht gibt
  heading: Drei Mauern, und alle drei stehen vor dem ersten Feedback.
  aside: Web-URDF-Editoren knabbern an der ersten. RL-Spielwiesen an der zweiten. Nichts verbindet alle drei zu einer Schleife.
  items:
    - num: Ⅰ
      title: Beschreibungsformate
      body: Für einen Simulator existiert ein Roboter nur als URDF- oder MJCF-XML — verschachtelte Körper, Trägheitstensoren, Gelenkkoordinatensysteme, Aktuator-Übersetzungen. Das von Hand zu schreiben ist Spezialistenarbeit, und ein falsches Koordinatensystem ergibt eine Maschine, die sauber lädt und sich wie Unsinn verhält.
    - num: Ⅱ
      title: Simulator-Setup
      body: MuJoCo, Isaac Lab und Genesis sind allesamt hervorragend — und setzen allesamt eine Linux-Workstation, eine Python-Umgebung, eine NVIDIA-GPU und Vertrautheit mit RL-Werkzeugen voraus, bevor sich der erste Roboter bewegt.
    - num: Ⅲ
      title: Reward Engineering
      body: Selbst mit einem gültigen Roboter in einem laufenden Simulator heißt Lernen, eine Belohnungsfunktion zu entwerfen — den Teil, den Fachleute selbst als schwarze Kunst bezeichnen.
loop:
  eyebrow: 02 — Die Schleife
  heading: Ziehen, einrasten, reagieren sehen, nachbessern.
  aside: Die Schleife muss eng genug bleiben, um Spiel zu sein und nicht Arbeit. Von der Konstruktion zur sichtbaren physikalischen Reaktion vergeht unter einer Sekunde, ohne Server-Roundtrip.
  items:
    - num: Ⅰ
      tone: accent
      kicker: Zusammenbauen
      title: Teile statt XML
      body: Teile aus einer Kiste in einen 3D-Arbeitsbereich ziehen und an definierten Andockpunkten einrasten lassen. Der kinematische Baum ergibt sich aus dem Zusammengesteckten, er wird nie selbst geschrieben. Drei Arten von Teilen, die der Baukasten nicht unterscheidet — idealisierte Module, echte Verkörperungen (ein SO-101-Arm, ein IRB 1200, die Adapterplatte dazwischen) und 3D-Modelle, zerlegt in verbundene, gelenkige Teile.
      status: Ausgeliefert
    - num: Ⅱ
      tone: signal
      kicker: Validieren
      title: Die Engine ist das Orakel
      body: Gültigkeit entscheidet nie eine Nachbildung physikalischer Regeln. Ein Entwurf ist gültig, weil MuJoCo ihn geladen und stabil simuliert hat — im eigenen Tab, fortlaufend, ab dem ersten Zug. Eine Ablehnung benennt das störende Modul und eine konkrete Korrektur, sofort beim Bauen statt Stunden später im Stillen.
      status: Ausgeliefert
    - num: Ⅲ
      tone: accent
      kicker: Lernen
      title: Diesen Roboter trainieren
      body: >-
        Ein Ziel wählen, und der validierte Roboter trainiert darauf. Bewusst kein Live-Stream: Trainieren schreibt das Bundle aus dem Tab, der Lauf passiert über Nacht auf der eigenen CPU, und Lauf öffnen spielt die Epochen danach als Montage ab — stürzt, stolpert, läuft. Kein Server, keine Job-API, keine GPU-Rechnung. Cloud-Training ist der Weg nach dem MVP und wird auch so benannt.
      status: PPO lernt seit August 2026
gate:
  eyebrow: 03 — Die Gültigkeitsgarantie
  pull: '„Exportiert“ und „funktioniert“'
  pullAccent: hören auf, zwei Aussagen zu sein.
  stats:
    - { value: '66/66', label: Korpus-Konstruktionen bestehen, tone: green }
    - { value: '<1', unit: s, label: Konstruktion → Physik-Reaktion, tone: plain }
    - { value: '57/59', label: Übereinstimmung der Engines, tone: gold }
  note: >-
    Das Ziel in der Überschrift sind 100 %, und die Messung ist noch nicht dort. Von den 59 Korpus-Robotern, die bis zum MJCF kommen, bewertet Desktop-MuJoCo 3.11.0 zwei anders als der Browser. Einer davon ist harmlos — ein abgelehnter Roboter, den die Desktop-Engine akzeptiert hätte. Einer ist es nicht: ein Roboter, der als fertig gilt und den ein Desktop-Trainer ablehnt. Beide sind namentlich festgehalten und werden bei jedem CI-Lauf erneut geprüft, damit die Lücke nicht still wächst.
contact:
  eyebrow: 04 — Zugang
  heading: Noch nicht öffentlich. Ein Wort, und du erfährst es zuerst.
  body: Baukasten, Gate und Trainer sind in aktiver Entwicklung in einem privaten Repository. Wer früh testen will, es mit dem eigenen Arm ausprobieren möchte oder daran arbeiten will — eine Adresse, gelesen von einem Menschen.
  email: hello@homunculusrobotics.com
---

Tiefe vor Breite. Die eine Invariante, auf der alles andere steht, ist:
**der Trainer bekommt nie einen Roboter, der nicht trainierbar ist** — deshalb
ist die Physik-Engine ab dem ersten Zug da und nicht erst beim Export.

Die naheliegende Alternative ist ein Web-URDF-Editor plus, getrennt davon, ein
RL-Framework. Von beidem gibt es gute. Diese Paarung lässt einen aber mit dem
schwersten Stück allein: der Garantie, dass das Gezeichnete überhaupt etwas ist,
das ein Simulator trainieren kann. Wir drehen das um. Statische Prüfungen gibt es
weiterhin, aber nur für **bessere Fehlermeldungen** — nie als Quelle der Wahrheit.
