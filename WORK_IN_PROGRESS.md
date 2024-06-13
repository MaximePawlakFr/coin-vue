# Next

- Set better parameters inputs list: search and select
  - Improve radio button
  - Add human-friendly name
  - Make parameters for premium users
- Rename : station => station météo
- Field Dataset: moins large, revoir la flèche
- Mettre en avant la feature d'export
- User Friendly: station > paramètres > date > pas temporel
- Changer la font: Source Sans Pro
- By dataset, show total nb points, min/max date
- Change date inputs to handle better monthly or hourly data
- Add daily "autres-parametres"
- Add messages during data fetching
- apply best practices
- bug: station list on first click is very long

# 2024-06-13

- Change POSTHOG_HOST to custom proxy

# 23

- Colors: inverse back et front
- Remplacer le nom par une accroche
- Add Component InputTextDataList

# 19

- bug:mobile: stations list is reversed
- clean dataStore about stations and parameters
- refactor sqlClient

# 18

- Add vue-i18n and French translations
- Translate Signup Form
- Move Nav to its own file
- Update documentationUrl
- Fix link to parameters definition
- Add "reserved" title
- Display station attributes in array but not in graph
- bug: when selecting station with key, it does not scroll
- bug: when selecting station with key, if station is present and click, then the full list is shown. On arrow key pressed, the list is updated to only one and does not reflect the previous one.

# 08

- Add signup modal
- Add Brevo Conversation
- Add nav bar
- Allow navigating with arrow in list stations

# 05

- Update daily data
- Add monthly data

# 04

- Update links to parquet files to stable links

# 03

- Prevent form to be submitted if not completed
- Set better station input list
- Add npm script version:patch
- Set SEO tags
- Set responsive
- Add links to official documentation

# 02

- Add groups and datasets

# 2024-05-01

- Add Posthog
- Add version and build date in footer
- Régler la largeur sur un vrai 100vw
- Ajouter un loader
- Changer le titre du graph avec le nom de la station
- Set All, None, Example buttons
- Add transition to button
- Corriger les inputs (voir prod) => tailwind était chargé avec le main.css
- Change favicon

# 28

- Add perspective table
- Remove default CSS
- Add department in station select
- Add Tailwind

# 27

- Use defineModels in form
- In plotly, accept all columns from form, not only TX and TN

# 26

- Refacto
- Récupération des infos des stations et des colonnes depuis des constantes

# 25

- Ajout de CONSTANTS et sqlClient pour aider à organiser
- comparaison de perf pour récupérer le nom des stations : l'originale
  Next:
- Améliorer le formulaire

# 2024-04-23

- récupération de la liste des colonnes, des stations, et des ids pour les injecter dans le formulaire
