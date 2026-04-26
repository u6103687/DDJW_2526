# Pau Martínez Llop U6103687

## 1. Introducció
Aquest projecte és un memory de tota la vida. L'objectiu principal ha estat crear una web interactiva on el jugador pugui posar a prova la seva memòria mitjançant dos modes de joc diferents, un de simple amb configuració propia, i l'altre un mode de nivells infinits amb ranking.

## 2. Descripció del disseny del joc
El disseny se centra en dos modes de joc:

* **Mode Clàssic:** És el mode personalitzat. El jugador pot anar a "Opcions" i triar el número de parelles, la dificultat (temps de visió) i si vol fer grups de 2, 3 o 4 cartes iguals.
* **Mode Infinit:** Aquest és el mode competitiu. A mesura que passes nivells, la dificultat puja (apareixen més cartes, els grups es fan més grans i el temps per veure les cartes disminueix).
* **Sistema de Rànquing:** En el mode infinit, s'ha dissenyat un "Top 10" per guardar les millors puntuacions amb el nom/àlies del jugador.
* **Gestió de partides:** El joc permet guardar diferents partides per poder-les continuar més tard.

## 3. Descripció de les parts més rellevants de la implementació
Durant el desenvolupament, les parts que han portat més feina i que són el motor del joc són:

1.  **Lògica d'escalat (Nivells):** S'ha programat una funció que calcula automàticament com fer el joc més difícil a cada nivell, augmentant les penalitzacions de punts i reduint el temps de visió.
2.  **Límit de torns:** Quan el joc arriba a la dificultat màxima (0.2 segons de visió), s'activa automàticament un límit d'intents. Això obliga el jugador a no clicar a l'atzar i a pensar bé cada moviment.
3.  **Sistema de Multi-guardat:** En lloc de guardar només un fitxer, s'ha creat una llista al `localStorage`. Així, cada vegada que guardes, es crea una entrada nova amb la data i l'ID de la partida (#1, #2, #3...).
4.  **Integració de jQuery 4.0.0:** S'ha hagut de treballar la llibreria com un mòdul perquè funciones el joc.

## 4. Conclusions i problemes trobats
Fer el joc ha estat un repte, han sortit bastants problemes tècnic:

* **Errors de llibreries:** Un dels maldecaps més grans ha estat la llibreria jQuery 4.0.0. Al ser una versió "module", donava errors de `ReferenceError: $ is not defined` o `Unexpected token export`.
* **Sintaxi de JavaScript:** Vaig tindre molts errors simples com parèntesis que faltaven o noms de variables que no coincidien.

En conclusió, el joc ha passat de ser simple i "inacabat" ser un joc web més complet i interesant.
