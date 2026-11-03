# Green Carbon Valley website

Biochar from crop leftovers and water hyacinth, made by and for Kenyan smallholder farmers.
Built with React, Vite and Tailwind, with a small Express server for the AI assistant. Runs on Google AI Studio.

## Run it

1. `npm install`
2. Set `GEMINI_API_KEY` (AI Studio does this from its Secrets panel; locally, put it in `.env.local`).
3. `npm run dev` for development, or `npm run build` then `npm start` with `NODE_ENV=production`.

## Changing words and numbers (no coding needed)

Everything visitors read is in **`src/content.ts`**, in English (`en`) and Kiswahili (`sw`).
The AI assistant reads its facts from the same file, so the site and the assistant always agree.

| To do this | Change this in `src/content.ts` |
| --- | --- |
| Show "So far" numbers on the home page | `stats` (replace `null` with the real number) and `statsSince` |
| Use a lab result for a feedstock | the matching row in `feedstocks` (`yield`, `carbon`, and remove `assumption`) |
| Turn on the 3D kiln | export the kiln from Inventor as `.glb`, put it in `public/models/`, set `kiln.glbUrl` to `'/models/<file>.glb'`, and add `kiln.hotspots` |
| Show the kiln's safety parts | list them in `kiln.safetyFeatures` |
| Add your charging mix | step 6 in `how.steps` |
| Update investor progress, targets, backing or ask | `investors.stage`, `investors.targets`, `investors.backing`, `investors.ask` |
| Change photos or the video | `photos` and `video` |
| Change contact details | `contact` |

Rule: a value set to `null` or an empty list is hidden on the site. Never type a guess; leave it empty until it's real.

The Kiswahili is a draft. Have a native speaker check it before launch.

## Pages

`#/` Biochar (home) · `#/how` How we make it · `#/kiln` Our kiln · `#/results` Results (batch log + calculator) · `#/investors` For investors · `#/get-involved` Get involved · `#/privacy` Privacy

## Data

- **Batch log:** Firebase Firestore, collection `batches`. Group leaders sign in with Google. Only entries with `consentPublic: true` are shown.
- **Deploy the rules:** the updated `firestore.rules` must be published to your Firebase project (Firebase console → Firestore → Rules, or `firebase deploy --only firestore:rules`).
- **Contact form:** Formspree (`contact.formspree`).
- **AI assistant:** `server.ts` → Gemini (`gemini-3.8-flash`). Without a key, the assistant tells visitors to use WhatsApp instead of giving canned answers.
