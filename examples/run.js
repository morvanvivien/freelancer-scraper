// Minimal example: run the freelancer-projects-scraper Actor and print the results.
// Usage: APIFY_TOKEN=... node run.js   (Node 18 or later, npm install apify-client)
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) {
    console.error('Set the APIFY_TOKEN environment variable first.');
    process.exit(1);
}

const client = new ApifyClient({ token });

const input = {
    "query": "wordpress",
    "projectType": "hourly",
    "maxItems": 50,
    "onlyNew": false,
    "includeDescriptions": false
};

const run = await client.actor('bibian/freelancer-projects-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`${items.length} results`);
for (const item of items) {
    console.log(`${item.title} | ${item.projectType} | ${item.salaryMin ?? '-'}-${item.salaryMax ?? '-'} ${item.salaryCurrency ?? ''} | bids: ${item.bidCount}`);
}
