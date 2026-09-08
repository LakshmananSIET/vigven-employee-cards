# Vigven Employee Cards

GitHub Pages static digital business card system.

## Files
- `index.html` — landing page
- `card.html?id=EMPLOYEE_ID` — permanent employee card URL
- `qr.html?id=EMPLOYEE_ID` — QR generator for that employee
- `employees.xlsx` — **source of truth** for employee information
- `images/` — employee photos

## Excel columns
Use these headers in the first worksheet:

`id`, `companyName`, `employeeName`, `rollNumber`, `designation`, `department`, `email`, `phone`, `linkedin`, `website`, `address`, `employeeImage`, `active`, `createdAt`, `updatedAt`

The `id` must stay permanently assigned to an employee. It is used by the QR link. Do not change an employee's ID after printing the visiting card.

`employeeImage` can contain an image filename such as `images/lakshmanan.jpg`, or a full HTTPS image URL.

`active` should be `TRUE` for cards that should be available and `FALSE` to hide a card.

## Employee links

For an employee with ID `vq105k`:

`card.html?id=vq105k`

QR generator:

`qr.html?id=vq105k`

The roll number/ID is used for routing but is not displayed on the public card.

## Updating employees

1. Edit `employees.xlsx` locally.
2. Keep every existing employee `id` unchanged.
3. Add/update photos in `images/` when needed.
4. Commit/push the changed Excel/photos to GitHub.
5. The public cards automatically read the latest Excel data.

Old QR codes continue to point to the same `card.html?id=...` URL, so changing a person's name, designation, phone, etc. does not require reprinting the QR as long as the ID remains unchanged.

## GitHub Pages

Enable GitHub Pages from **Settings → Pages → Deploy from a branch → main → /(root)**.

The resulting site will be:

`https://lakshmanansiet.github.io/vigven-employee-cards/`

A printed QR should use the final `card.html?id=...` URL rather than a temporary GitHub URL.

## Privacy

Because this is a static public site, anything placed in `employees.xlsx` or `images/` can be publicly accessible. Do not put passwords, private employee information, API keys, service-account files, or other secrets in this repository.

> Note: GitHub Pages has restrictions on use as commercial hosting. Check GitHub's current Pages terms/policy before using this as the company's production public site.
