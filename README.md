**🔗 Version live : [VapeMixPro.kazo.ca](https://VapeMixPro.kazo.ca)**

Voici la description complète et technique de l'application web mobile développée pour la gestion de vos recettes de e-liquide. 

Cette application "Single Page" (SPA) a été conçue pour offrir une grande flexibilité dans les calculs, tout en garantissant la persistance de vos données. L'interface mobile-first adopte une esthétique soignée, avec des fonds anthracite foncé et des accents de gradients néon, pour une lisibilité optimale et un style cyber-tech moderne.

### 1. Module de Base : Calculs et Réactivité
Ce module est le cœur de l'application, permettant une modification bidirectionnelle des données sans jamais casser la logique de la recette.

*   **Entrées Principales :** Vous définissez le volume total de liquide souhaité (en ml) et le ratio VG/PG cible.
*   **Réactivité Intelligente :** Toutes les valeurs sont modifiables (volume, ratio, nicotine, booster en ml, VG en ml, PG en ml, concentration du booster). La recette est recalculée en direct, dans les deux sens, sans jamais réécrire le champ en cours de saisie.
*   **Cadenas 🔒 :** Un cadenas à côté d'une valeur la garde fixe pendant les recalculs ; seules les valeurs non verrouillées s'ajustent (maximum 2 cadenas à la fois). Exemples :
    *   Sans cadenas, changer le booster (ml) garde le volume total et affiche la concentration finale obtenue.
    *   Cible de nicotine verrouillée, changer le booster (ml) calcule le volume total qu'on peut produire.
    *   Ratio verrouillé, changer la VG (ml) calcule le volume total possible avec cette quantité de VG.
    *   Booster (ml) verrouillé, changer le volume ou la concentration du booster recalcule la nicotine finale.
*   **Valeurs impossibles :** Si une valeur est impossible (cible plus forte que le booster, volume négatif, cadenas incompatibles), un message s'affiche sous le champ et rien d'autre n'est modifié.
*   **Décimales :** La virgule (« 1,5 ») et le point (« 1.5 ») sont acceptés dans tous les champs ; l'affichage suit la langue choisie.
*   **Transparence Mathématique :** Une zone de texte extensible affiche le détail des opérations mathématiques effectuées en arrière-plan. Cela vous permet de valider mentalement ou manuellement les quantités de VG et de PG allouées.

### 2. Module Nicotine et Optimisation (Optionnel)
Intégrée de manière transparente, la gestion de la nicotine s'adapte à vos contraintes de matériel. Conformément à vos règles, le booster est considéré comme ayant le même ratio VG/PG que votre cible finale.

*   **Configuration :** Vous renseignez la concentration de votre booster source (mg/ml) et la concentration cible souhaitée pour le mélange final.
*   **Modification Manuelle du Booster :** Si vous modifiez le volume (ml) de booster alloué au mélange, l'application verrouille le volume total du liquide et le ratio VG/PG. Elle ajuste dynamiquement les volumes de VG/PG purs et recalcule le taux de nicotine final du liquide.
*   **Moteur d'Optimisation des Mesures :** L'application analyse les résultats. Si elle détecte que la quantité de booster requise est trop infime et difficile à mesurer précisément (ex: 1,2 ml) ou, à l'inverse, qu'elle représente un volume trop massif (ex: 15 ml à cause d'une source trop faible), une alerte non bloquante apparaît. Elle suggère un taux de booster (mg/ml) plus pertinent pour faciliter la manipulation à la seringue ou à la balance.

### 3. Module de Sevrage Progressif (Card Indépendante)
Afin de bien séparer l'aspect "recette" de l'aspect "santé", cette fonctionnalité est isolée dans sa propre section visuelle.

*   **Incrément de Réduction :** Un champ permet de définir la baisse souhaitée (ex. : -0,5 mg/ml ou -1 mg/ml).
*   **Bouton d'Action Rapide :** Un bouton spécifique "Produire avec réduction de nicotine" applique la soustraction à votre cible actuelle, déclenche le recalcul complet des volumes (VG, PG, Booster), et archive immédiatement la nouvelle recette.

### 4. Persistance et Historique (LocalStorage)
Toute l'application est conçue pour fonctionner hors-ligne après le premier chargement, sans aucune base de données externe.

*   **Sauvegarde en Temps Réel :** Chaque modification apportée à la recette (volume, ratio, nicotine, cadenas) est enregistrée instantanément dans le cache de votre navigateur.
*   **Chargement Automatique :** À l'ouverture de l'application, la dernière recette en cours d'édition est restaurée exactement dans l'état où vous l'avez laissée.
*   **Journal des Mélanges :** Une section "Historique" liste vos productions précédentes (Date, Volume Total, Ratio VG/PG, Taux de nicotine). Un bouton permet de recharger une ancienne configuration en un clic pour la reproduire.

### 5. Architecture Technique
*   **Structure :** `index.html` (structure), `style.css` (présentation), `calculator.js` (moteur de calcul pur, sans DOM), `i18n.js` (textes EN/FR), `script.js` (interface et événements).
*   **Tests :** `node --test tests/calculator.test.js` (moteur de calcul). Les tests navigateur `tests/e2e.test.js` utilisent Playwright s'il est installé.
*   **Déploiement :** Publié automatiquement sur GitHub Pages via `.github/workflows/deploy.yml` à chaque push sur `main` : les tests unitaires s'exécutent d'abord, puis seuls les fichiers du site sont publiés. Les pull requests vers `main` sont testées sans être publiées.
*   **Maintenance :** Le moteur de calcul est documenté (variables, relations, priorités de recalcul) pour faciliter l'ajout de nouveaux modules (comme les arômes). Les classes Bootstrap assurent un rendu parfait sur mobile.
