# TyMécano

## Objectif

- Retrouver les docs
- Couple de serrage
- Réparations à faire et temps imparti (pointer le début et la fin)
- Éditer un devis
- CRM et historique de réparation par véhicule

## Liste des vues

- Dashboard (prochain rdv, gamification, meilleur client par période)
- Inscription / Connexion ✅
- Documents
- Mini-apps ✅
    - Couple de serrage
- Mon planning
    - Détail d'un rendez-vous
- Vue devis
- Vue clients
    - Infos personnelles
    - Historique
    - Véhicule

## Liste des tâches

- Conception db
- CRUD entités (clients, véhicules, missions)
- Frontend et mock
- Intégration API et docs

## DB

- Clients
    - Nom
    - Prénom
    - Email
    - Téléphone
    - Code Postal
    - Ville

- Vehicule
    - Immatriculation
    - VIN
    - Marque
    - Modèle

- Missions
    - Date de début
    - Heure de début
    - Date de fin
    - Heure de fin
    - Véhicule associé
    - Pièces nécessaires
        - Prix
        - Nom
    - Prix total

- Applications
    - nom
    - catégorie
    - description
    - "icon" ?
