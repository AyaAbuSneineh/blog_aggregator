import { getNextFeedToFetch, markFeedFetched } from "./feeds.js";
import { fetchFeed } from "../../rss/fetchFeed.js";

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();

  if (!feed) {
    throw new Error("No feeds found");
  }

  console.log(`Fetching feed: ${feed.name}`);

  const rssFeed = await fetchFeed(feed.url);

  await markFeedFetched(feed.id);

  for (const item of rssFeed.items) {
    console.log(item.title);
  }
}