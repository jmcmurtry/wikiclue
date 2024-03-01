# wikiclue
This repository is for the development of a web application for our SENG 513 project using SvelteKit and Firebase.

## Authors:
- Colin Christophe
- Kenny Jeon
- John McMurtry
- Harrison Mondragon
- Tyler Witzke

## How to run:
This project is currently in development. Use the following instructions to run the project:
- Ensure a recent version of npm is installed
- Navigate to project root directory `wikiclue/wikiclue`
- Run `npm install`
- Run `npm run dev`
- The client will be running on `http://localhost:5173/`

## How to run as docker container
- Ensure you have docker installed on your device
- run `docker-compose --file docker-compose.dev.yml up --build`
- Image will run on localhost:5173

## UI/UX Design:
UI/UX designs have been created on Figma. We have separate mockups for [Computer](https://www.figma.com/file/bI5E1qi820KH3M59GDhDcO/Computer?type=design&node-id=0%3A1&mode=design&t=9cHrGGIiWYxIyYot-1) and [Mobile](https://www.figma.com/file/GVt4gFmJDPROsmAa51QyG3/Mobile?type=design&node-id=0%3A1&mode=design&t=yKPYNnlhwFWcsKAp-1)

## New Feature Workflow:
When developing a new feature, the following workflow should be followed:

1. Ensure that your local repository is up to date with this one. Run the command ```git pull``` in the main branch to check.
2. Create a new branch to work on the changes by using the command ```git checkout -b <ticket-name>```. Branches should follow the naming convention used on the team Jira.
3. Do all of the necessary coding and testing of the feature within this branch, using ```git add``` and ```git commit``` to save your progress.
4. Once the feature is complete and has been thoroughly tested, use ```git push``` to push these changes to this repository. You will likely need to set the upstream branch after running this command.
5. Open a new pull request to merge the branch into the main branch. Write a title and description for the feature and assign a team member who did not work on the feature to review the changes. The pull request should be named with the following format: "branch: jira ticket name."
6. Once your pull request is approved the changes will be merged into the main branch.
