# Roadmap

1. **Gestion API** :
  - Utiliser une souscription à un service de mise à jour des taux pour éviter le pooling et avoir des taux réels du marché 
  - Ouvrir éventuellement des routes pour fournir le service de conversion et de taux en json

2. **CI/CD** :
   - Ajouter du CI/CD
   - Ajout des envs

3. **Réutilisable** :
   - Séparer le tableau d'historique dans un composant propre dédié
   - Ajout d'un context ou d'un storage pour l'historique

4. **Support multi-langues** :
   - Ajouter `i18next`.

5. **Améliorer l'UX/UI** :
   - Améliorer l'UX selon un éventuel modèle Figma ou autre

6. **Fonctionnalités** :
   - Proposer des indicateurs statistiques sur les données historiques (moyenne, médiane, écart type) 
   - Proposer de nouvelles currencies
   - Proposer un graphique d'évolution des taux

7. **Gestion des erreurs** :
   - Ajouter une gestion des erreurs plus robuste, notamment au niveau de la récupération du taux

8. **Accessibilité** :
   - Implémenter des attributs ARIA

9. **Compiler** :
   - Ejecter l'app pour utiliser webpack ou vite et avoir un meilleur contrôle

