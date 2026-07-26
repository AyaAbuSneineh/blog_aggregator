import { XMLParser } from "fast-xml-parser";
import { RSSFeed, RSSItem } from "./types.js";

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL ,{ headers: {"User-Agent": "gator" }});

    const xmlText = await response.text() 
    const parser = new XMLParser({processEntities: false});
    
    const parsed = parser.parse(xmlText);
    const channel = parsed.rss?.channel;
    if (!channel) {
        throw new Error("Channel not found");
    }

    if(typeof channel.title !== "string" || typeof channel.link !== "string" || typeof channel.description !== "string") {
        throw new Error("Invalid channel data");    
    }
    let items = [];

    if (channel.item) {
        items = Array.isArray(channel.item)
            ? channel.item
            : [channel.item];
    }
    const rssItems: RSSItem[] = [];

    for (const item of items) {
        if (typeof item.title !== "string" || typeof item.link !== "string" ||
            typeof item.description !== "string" || typeof item.pubDate !== "string") {
            continue;
        }

        rssItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
        });
    }

    return {
        title: channel.title,
        link: channel.link,
        description: channel.description,
        items: rssItems,
    };
    
}

