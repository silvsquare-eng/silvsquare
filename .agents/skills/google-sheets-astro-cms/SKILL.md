---
name: google-sheets-astro-cms
description: >-
  Provides the architecture, scripts, and details for building a dual-language Astro/React CMS using Google Sheets as the database. Use this skill when asked to replicate the Silver Square catalog system or when building a new project based on the Google Sheets CMS + Cloudflare Magic Button architecture.
---

# Google Sheets + Astro CMS Architecture

This skill documents the end-to-end architecture for using Google Sheets as a Headless CMS for an Astro + React frontend, complete with dual-language support (Arabic/English), dynamic attributes, image mapping, and a "Magic Button" for triggering Cloudflare Deploy Hooks.

## 1. System Overview

- **Database**: Google Sheets (Published to Web as CSV).
- **Backend/ETL**: A Node.js `sync.js` script that fetches the CSVs, processes dual languages, maps dynamic columns, and outputs JSON files (`catalog.json`, `settings.json`).
- **Frontend**: Astro for SSG (Static Site Generation) and React for interactive components.
- **Deployment**: Cloudflare Pages, triggered by a webhook (Magic Button) from Google Sheets. `npm run build` runs the sync script before Astro builds the HTML.

## 2. Google Sheets Structure

The project uses two main sheets for the catalog to support dual languages:
1. **Arabic Sheet (Base)**: Contains the core product info (id, name, category, description, base_price, main_image).
2. **English Sheet**: Contains translated columns (`name_en`, `description_en`, etc.) mapped to the Arabic row by matching `id` or `id_en`.

### Dynamic Options and Images
- Columns that don't match standard names (e.g., "اللون", "السعة" or "Color", "Capacity") are automatically parsed as dynamic dropdown attributes. Their values are split by commas.
- Columns starting with `image_` or `صورة_` or ending with `_image` or ` image` are parsed as attribute-specific images. For example, `Plain white_image` maps its value to the "Plain white" dropdown option.

## 3. Sync Script (`sync.js`)

The `sync.js` script is the core engine. It fetches the published CSVs and processes them:

- It reads `settings.json` to extract `ignored_columns` to avoid parsing internal notes as attributes.
- It parses standard fields natively.
- It merges the Arabic and English sheets row by row based on `id`.
- It executes case-insensitive Regex `cleanKey.toLowerCase().match(/_image-?$/) || ...` to identify image columns in both languages, ensuring that images are tied to their respective attributes (e.g., `optionImages["Plain white"] = "url"`).
- Outputs the structured data to `src/data/catalog.json`.

## 4. Frontend Integration (Astro + React)

- Data is imported directly from `catalog.json` into Astro pages.
- Astro's `getStaticPaths` generates dynamic routes for each product in both `/ar/catalog/[id]` and `/en/catalog/[id]`.
- React components (like `ProductDetailsPage.tsx`) receive the JSON object and use the `lang` prop to decide whether to render the Arabic base attributes or the `_en` attributes.

## 5. The "Magic Button" (Deployment Automation)

Instead of manually deploying, the client uses a Google Apps Script button inside their Google Sheet.

**Apps Script Code:**
```javascript
function triggerCloudflareDeploy() {
  var ui = SpreadsheetApp.getUi();
  var webhookUrl = "CLOUDFLARE_DEPLOY_HOOK_URL";
  
  var response = ui.alert('تأكيد التحديث', 'تحديث الموقع؟', ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) {
    UrlFetchApp.fetch(webhookUrl, { 'method' : 'post', 'muteHttpExceptions': true });
    ui.alert("تم بنجاح! 🎉", "سينعكس التغيير خلال دقيقتين.", ui.ButtonSet.OK);
  }
}
```
**Cloudflare Configuration:**
1. A Deploy Hook is generated in Cloudflare Pages -> Settings -> Builds & deployments.
2. In `package.json`, the build command is: `"build": "npm run sync && astro check && astro build"`.
3. When the hook is hit, Cloudflare fetches the latest CSV data via `sync.js` and bakes it into the new static build.

## Implementation Steps for a New Project

1. Copy `scripts/sync.js` to the new project.
2. Update the `CATALOG_CSV_URL` and `CATALOG_EN_CSV_URL` constants with the new Google Sheets published CSV links.
3. Ensure `package.json` runs `npm run sync` as part of the `build` script.
4. Setup Astro `getStaticPaths` to consume `src/data/catalog.json`.
5. Create the Deploy Hook in Cloudflare and add the Magic Button Apps Script to the client's Google Sheet.
