# Find a supervisor — all-fields expansion (2026-11-19)

The directory is no longer civil/structural only. Professors are separated by field across all disciplines — every engineering branch, medicine, the natural and social sciences, the humanities, business, law and education — using the same filter structure (country, university, discipline, field). The field taxonomy lives in `lib/academics.ts` (`DISCIPLINES`).

## What was added on 2026-11-19

48 professors verified on their university's own official staff/profile page, 16 per field batch:

- **Mechanical engineering (16):** MIT 2, Stanford 2, Cambridge 2, Imperial 2, TU Munich 2, Melbourne 2, UNSW 2, Toronto 2. Fields: mechanical-design 5, thermofluids 7, dynamics-vibration 2, manufacturing 1, tribology 1.
- **Medicine (16):** Oxford 2, Cambridge 2, Harvard 2, Johns Hopkins 2, Melbourne 2, Sydney 2, UCL 2, Toronto 2. Fields: clinical-medicine 11, psychology 3, public-health 2.
- **Computer science / AI (16):** MIT 2, Stanford 2, Berkeley 2, Oxford 2, Cambridge 2, Carnegie Mellon 2, Toronto 2, NUS 2. Fields: artificial-intelligence 13, distributed-systems 2, cybersecurity 1.

Source records for the batch: `data/academics-new-mech.json`, `data/academics-new-med.json`, `data/academics-new-cs.json`. They were merged into `data/academics/<region>.json` (us, uk, de, ca, sg, vic, nsw).

## Totals after the merge

- **239 academics** (was 191), **42 universities** (was 37), 9 countries.
- **3 ORCID iDs** on profile pages: Daniele Dini (Imperial, 0000-0002-5518-499X), Gemma Figtree (Sydney, 0000-0002-5080-6083), Neil Lawrence (Cambridge, 0000-0001-9258-1030). ORCID is shown only where the university profile itself publishes it.
- **174 with a published email, 65 "Email not published"** — email is included only where the university's own profile page publishes it.

## Rules (unchanged)

- Name, research focus, email and ORCID come only from the university's own official staff/profile page. Nothing is invented; nothing comes from aggregators or LinkedIn.
- The uploaded CV is read in the browser only and fills the enquiry email template. It is **never** analysed to recommend or match professors.
- Clicking a professor's email opens the existing PhD scholarship / PhD position enquiry template via mailto (Gmail/Outlook as the user's default). The template says the CV is attached; the student attaches the file themselves in their mail app, since mailto cannot attach a file.
- Every professor keeps a "Profile" button linking to their official university profile page.

## Caveats on this batch (for the next check)

- **Emails left null though published elsewhere on the university's own sites** (profile-page-only rule): Jean Abraham (Cambridge, ja344@medschl.cam.ac.uk — on the Department of Oncology / CRUK Cambridge Centre pages, not her medschl profile); Maree Teesson (Sydney, maree.teesson@sydney.edu.au — in the official Matilda Centre PhD handbook PDF, not her profiles.sydney.edu.au page). The parent may choose to add them.
- **Emails from university-hosted documents rather than the profile page itself:** Percy Liang (Stanford-hosted CV), Christos Faloutsos (CMU-hosted CV), Min-Yen Kan and Mohan Kankanhalli (NUS-hosted CVs); Ang Liu (UNSW course outline PDF on unsw.edu.au). If the rule is tightened to "profile page only", these five should be set to null.
- **Michael A. Rosen (Johns Hopkins):** his live profile obfuscates the address; the email mrosen44@jhmi.edu comes from the search crawl of the same official page.
- **ORCIDs deliberately omitted:** Wolfgang Polifke and Ang Liu have ORCID iDs on orcid.org, but they do not appear on their universities' own profile pages, so they were not added.
- **Field approximations:** Anne Becker, Michael Rosen and Maree Teesson (mental health) are filed under "psychology" as the closest field; solid-mechanics / machine-elements professors are filed under "mechanical-design".
- **Empty disciplines:** medicine beyond the three seeded subfields, natural sciences, social sciences, humanities, business, law, education and architecture are declared in the taxonomy with zero professors until someone is transcribed into them from an official staff page. An empty section is honest; an invented professor is not.
