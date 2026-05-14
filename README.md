**🔗 Version live : [VapeMixPro.kazo.ca](https://VapeMixPro.kazo.ca)**

Voici la description complète et technique de l'application web mobile développée pour la gestion de vos recettes de e-liquide. 

Cette application "Single Page" (SPA) a été conçue pour offrir une grande flexibilité dans les calculs, tout en garantissant la persistance de vos données. L'interface mobile-first adopte une esthétique soignée, avec des fonds anthracite foncé et des accents de gradients néon, pour une lisibilité optimale et un style cyber-tech moderne.

### 1. Module de Base : Calculs et Réactivité
Ce module est le cœur de l'application, permettant une modification bidirectionnelle des données sans jamais casser la logique de la recette.

*   **Entrées Principales :** Vous définissez le volume total de liquide souhaité (en ml) et le ratio VG/PG cible.
*   **Réactivité Intelligente :** 
    *   Si vous forcez une nouvelle quantité de PG (en ml), le système recalcule instantanément le ratio VG/PG pour refléter cette modification.
    *   Le volume total reste la constante (l'ancre du calcul) autour de laquelle gravitent les bases neutres.
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

*   **Sauvegarde en Temps Réel :** Chaque modification apportée à la recette (volume, ratio, nicotine) est enregistrée instantanément dans le cache de votre navigateur.
*   **Chargement Automatique :** À l'ouverture de l'application, la dernière recette en cours d'édition est restaurée exactement dans l'état où vous l'avez laissée.
*   **Journal des Mélanges :** Une section "Historique" liste vos productions précédentes (Date, Volume Total, Ratio VG/PG, Taux de nicotine). Un bouton permet de recharger une ancienne configuration en un clic pour la reproduire.

### 5. Architecture Technique
*   **Structure :** Trois fichiers distincts : `index.html` (structure), `style.css` (présentation), `script.js` (logique métier).
*   **Déploiement :** Publié automatiquement sur GitHub Pages via un workflow CI/CD à chaque push sur `main`.
*   **Maintenance :** Le code est abondamment commenté, détaillant chaque fonction de calcul croisé pour faciliter de futures mises à jour ou l'ajout de nouveaux modules (comme les arômes). Les classes Bootstrap assurent un rendu parfait sur mobile.
