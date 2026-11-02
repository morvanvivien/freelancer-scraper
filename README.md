# How to Scrape Freelancer.com: Worldwide Freelance Projects (Budget, Bids, Skills)

> **Run it now, no code: [freelancer-projects-scraper on the Apify Store](https://apify.com/bibian/freelancer-projects-scraper)** &nbsp;|&nbsp; $1.20 per 1,000 projects &nbsp;|&nbsp; no browser, no proxy

Freelancer.com is one of the world's largest freelance marketplaces, with projects posted by clients in every category and currency it supports. It has no simple public export for third parties. This guide shows how to get those projects as clean structured data: budget, bids, category and skills, with a paid Apify Actor, from the console or from code.

Searches this page answers: freelancer.com scraper, freelancer projects api, freelance marketplace scraper, freelancer.com bids data.

## What you get from the Freelancer.com scraper

- Every open project Freelancer.com's own public search returns, newest first, with title, category, skills, budget and bid count.
- Budget as `salaryMin`, `salaryMax`, `salaryCurrency` and `salaryPeriod` in the project's own currency (`salaryPeriod` is `"hour"` for an hourly project, `null` for a fixed-price one).
- Freelancer.com-specific signals: `projectType` (fixed or hourly), `bidCount` and `bidAverage`, so you can see how competitive a project already is.
- Optional full project brief as plain text, with stray e-mail addresses or phone numbers replaced with `[redacted]`.
- The same unified job-posting fields shared by every job and freelance-mission Actor from this author (`id`, `url`, `title`, `employmentType`, `remote`, `salaryMin`/`Max`/`Currency`/`Period`, `datePosted`, `skills`, `source`, `sourceId`, `scrapedAt`...), so Freelancer.com drops into a pipeline already built for one of the others.

Export the dataset as JSON, CSV or Excel, or read it through the Apify API. A real sample (five results, no personal data, long briefs truncated) is in [`sample-output.json`](sample-output.json).

## Output fields

| Field | What it is |
|---|---|
| `id`, `url`, `title` | `freelancer.com:<id>`, the public project page, and the full project title |
| `companyName`, `confidentialCompany` | Always `null` / `true`. Only the project a client posts is collected; the identity of the client and of the freelancers who bid on it is never requested, by design. |
| `remote`, `country`/`city`/`region` | `remote` is `"remote"` with location fields `null` for the large share of projects open to freelancers worldwide; location fields are filled only for the small share of projects a client restricted to one place. |
| `employmentType` | Always `"freelance"`. |
| `salaryMin`, `salaryMax`, `salaryCurrency`, `salaryPeriod` | The project's budget in its own currency: a lump sum for a fixed-price project, a rate per hour for an hourly one (`salaryPeriod: "hour"`). |
| `datePosted`, `validThrough` | When the project was posted and when bidding closes, as published by the site. |
| `industry` | Freelancer.com's own category label (for example `"Websites, IT & Software"`). |
| `skills` | Skills listed on the project, as the site's own tags. |
| `source`, `sourceId`, `scrapedAt` | `"freelancer.com"`, the project's numeric id, and when this run read it. |
| `projectType`, `bidCount`, `bidAverage` | Fixed or hourly, number of bids so far, and the average bid amount. |
| `description` | Full project brief as plain text (only when **Include full briefs** is on). Any e-mail address or phone number is replaced with `[redacted]` before saving. |

## Use cases

- **Never miss a lead.** Schedule a daily run with your keywords and send new projects to Slack, e-mail or your CRM.
- **Price your offer.** Real budgets and bid counts per skill, worldwide, fixed-price or hourly.
- **Spot trends.** Which skills and categories clients ask for the most, and at which price.
- **Feed your own job board.** A stable, unified JSON feed of freelance missions, in any currency.

## Input

| Field | What it does |
|---|---|
| `query` | Search projects by title and brief, for example `logo design` or `wordpress`. Empty means every open project. |
| `projectType` | Keep only `fixed` or `hourly` projects. Default: `any`. |
| `maxItems` | The run stops once this many projects are saved (default 50). |
| `onlyNew` | For scheduled runs: skip the projects an earlier run of this same search already delivered. |
| `includeDescriptions` | Adds the client's full project brief as plain text. Default: on. |

Example input:

```json
{
  "query": "wordpress",
  "projectType": "hourly",
  "maxItems": 50,
  "onlyNew": false,
  "includeDescriptions": false
}
```

## Four ways to use it

### 1. Apify console, no code

1. Open [the Actor page](https://apify.com/bibian/freelancer-projects-scraper) and click **Try for free** (a free Apify account is enough).
2. Fill in the input form (keywords, filters and the maximum number of results) and click **Start**.
3. When the run finishes, open the **Output** tab, check the table, then **Export** as CSV, Excel or JSON.
4. For a daily alert, open **Schedules**, create a daily schedule for the Actor and, optionally, add an integration that sends new results to Slack, e-mail or Google Sheets.

### 2. Apify API with JavaScript

```bash
npm install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
node examples/run.js
```

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const run = await client.actor('bibian/freelancer-projects-scraper').call({
    "query": "wordpress",
    "projectType": "hourly",
    "maxItems": 50,
    "onlyNew": false,
    "includeDescriptions": false
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const item of items) {
    console.log(`${item.title} | ${item.projectType} | ${item.salaryMin ?? '-'}-${item.salaryMax ?? '-'} ${item.salaryCurrency ?? ''} | bids: ${item.bidCount}`);
}
```

The complete file is [`examples/run.js`](examples/run.js) (ES module, Node 18 or later).

### 3. Apify API with Python

```bash
pip install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
python examples/run.py
```

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run = client.actor("bibian/freelancer-projects-scraper").call(run_input={
    "query": "wordpress",
    "projectType": "hourly",
    "maxItems": 50,
    "onlyNew": False,
    "includeDescriptions": False,
})

for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(f"{item['title']} | {item.get('projectType')} | {item.get('salaryMin')}-{item.get('salaryMax')} {item.get('salaryCurrency')} | bids: {item.get('bidCount')}")
```

The complete file is [`examples/run.py`](examples/run.py). Never put your token in the code: read it from the `APIFY_TOKEN` environment variable as above.

### 4. Schedule it and connect your tools

1. **Schedule it.** Save a task with your keywords and schedule it daily with Apify Schedules. Tick **Only new results** (`onlyNew: true`) and each run returns, and charges, only the projects earlier runs of the same search did not deliver.
2. **Push the results where you work.** Add an Apify integration or a webhook to the task: Google Sheets, Slack, Make, Zapier, n8n or your own endpoint, triggered at the end of every run.
3. **Let an AI agent use it.** Through the [Apify MCP server](https://docs.apify.com/platform/integrations/mcp), assistants such as Claude or ChatGPT can search the Store, read this page and run the Actor as a tool.

## Pricing

Pay per result: **$1.20 per 1,000 projects** (that is $0.0012 per project), plus a small start fee with the default memory setting. For example, 100 projects cost about $0.13. You only pay for the projects you receive. Prices are those shown on the [Store page](https://apify.com/bibian/freelancer-projects-scraper) when this guide was written; the Store page is the reference.

## Why this one

Freelancer.com has a crowded field of Apify Actors, some priced well under a dollar per 1,000 results. This one is not the cheapest. What it trades that for:

- **No login, no proxy, no cookies.** It reads the site's own public project-search endpoint directly, the same one the search page calls, so it keeps working when a login-based scraper breaks.
- **One call, no detail page.** Budget, skills, bids and dates are all in the list response, so a run stays fast and predictable even at a few thousand projects.
- **Leads, not job ads.** Each record is a project a client is actively hiring for, with `bidCount` and `bidAverage` already attached, not a static listing.

If raw price per result is the only criterion, a cheaper Actor on the Store may fit better. If reliability without login or proxy maintenance matters more, this is the trade-off this Actor makes.

## Limits and honest notes

- Projects come newest first, so a daily run is fast and cheap.
- Only the project itself is collected: title, brief, budget, category and skills. The identity of the client who posted it and of the freelancers who bid on it is never requested or collected, by design (this is visible in `sample-output.json`, where all five sample records have `companyName: null`).
- `country`/`city`/`region` are filled only for the small share of projects a client restricted to one place; the rest are open worldwide and carry `remote: "remote"` with `country: null`.
- A project's brief is checked for stray e-mail addresses or phone numbers a client may have pasted into their own text, and they are replaced with `[redacted]` before saving.
- This is an unofficial tool, not affiliated with Freelancer.com. Check the site terms and the data protection rules that apply to your use.

## FAQ

**Do I need an account, cookies or a proxy for Freelancer.com?**
No. The Actor reads the site's own public project-search endpoint, the same one its search page calls, without signing in.

**Does this collect freelancer profiles?**
No, never. Only the projects clients post are collected. Freelancer profiles (name, rating, portfolio) are personal data and are out of scope for this Actor on purpose.

**Which formats can I export?**
JSON, CSV, Excel, XML, HTML table or RSS, from the dataset page or through the API.

**Is it legal to scrape?**
The Actor collects publicly visible postings and respects the robots.txt rules of the site. How you use the data is your responsibility: check the site's terms and the laws that apply to you, for example the GDPR.

**Something does not work?**
Open an issue in the Issues tab of the Actor's Apify Store page, or on this repository. Every public Actor is test-run daily and the broken ones are repaired.

## Try it

**[Open freelancer-projects-scraper on the Apify Store](https://apify.com/bibian/freelancer-projects-scraper)**

The code in `examples/` is released under the MIT license (see [LICENSE](LICENSE)). The data belongs to its original publishers.
