# Flow Fixes

## Changes made

- **Workspace loading:** A failed Supabase workspace read now blocks autosaving and shows a retry option, so an unavailable read cannot replace saved data with an empty workspace.
- **Studio navigation and saving:** Leaving the Studio with unsaved edits prompts for confirmation. The toolbar reports unsaved edits and cloud save progress or failure.
- **Guest sharing:** Guest previews are read-only. Guests can comment and approve or request changes. Database functions append comments atomically and restrict guest feedback writes so guests cannot directly alter the shared design snapshot or approval metadata.
- **Build plans:** Material quantities and counts are reconciled when a saved design changes. Custom supplies are retained, and saving a design in Studio preserves its existing build plan.
- **Booking requests:** The request form has event type options, disallows past event dates, and shows a review summary before submission. Admins must enter a decision update; users see that update in booking history.
- **Admin navigation:** Admin accounts now see a Booking approvals item in the sidebar.
- **Event brief:** The planning page now collects date and time, venue, guest count, indoor/outdoor setting, decoration services, style and colors, budget amount/currency/scope, venue access and restrictions, accessibility requirements, and optional contact preference/details. The live preview can be copied or downloaded, and an internal request carries the event date and full brief into the booking review form.
- **Admin design review:** A booking request now stores a read-only snapshot of its linked design. Admins can open that snapshot from the request list, without access to the requester's full private workspace. Floor-plan image data is omitted from the snapshot; dimensions and placed décor are retained.

## Supabase setup required

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor. The updated schema adds the booking decision note and design snapshot columns, plus the database functions used for safe share comments and feedback. Until the schema is applied, those database-backed flows will fail against an older Supabase schema.

## Verification

- `npm run build` completed successfully.
- `git diff --check` completed successfully.
- Vite still reports that the main JavaScript bundle exceeds 500 kB after minification.
