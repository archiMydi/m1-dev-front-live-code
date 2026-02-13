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
    - Tableau générique avec les types de vis (M8 / M10 ...), leur pas (filetage 1.5 / 1.25 ...), leur matière (acier, inox, aluminium ...), et leur couple de serrage (en Nm)
- Mon planning
    - Détail d'un rendez-vous
    - Vue planning
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

## v2

- Utilisateur
    - Type de compte (admin/mécanicien)
    - Admin peut gérer les infos du garage (adresse/logo)
    - Afficher pourcentage de marge
- Planning
    - Au clic sur une mission, obtenir un devis PDF
    - Filtrer par user
    - Pouvoir terminer une mission avec delta par rapport heure prévue
- Véhicules
    - Recherche
    - Nettoyer la vue du tableau
- Comptabilité
    - État comptable par période (graphique)
    - Export CSV
- Garage
    - Ajouter un "onglet" /page "garage"
        - Bouton pour créer un nouveau garage
        - Bouton pour rejoindre un garage (modal qui demande un code d'invitation unique)
        - Liste des garages auxquels l'utilisateur appartient (avec rôle)
    - Page de gestion du garage
        - Si admin :
            - Modifier les infos du garage (c.f. `src/db/schema/index.ts`)
            - Bouton pour inviter un membre qui génère un code d'invitation unique
            - (optionnel) Si le garage n'est pas utilisé (n'a aucun membre ou données liées), bouton pour supprimer le garage
            - Liste de membres avec rôle et bouton pour expulser
        - Sinon (mécanicien) :
            - Voir les infos du garage
            - Bouton pour quitter le garage
            - Voir la liste des membres avec rôle
