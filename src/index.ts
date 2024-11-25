import { Command } from "commander";
import RuneScapeAPI from "./RuneScapeAPI";
import itemCraftingLevels from "./data/items-crafting.json";
import { bc } from "./colors";

interface VolumeData {
  itemId: number;
  itemName: string;
  highPrice: number;
  lowPrice: number;
  highTime: number;
  lowTime: number;
}

interface PriceData {
  high: number;
  low: number;
  highTime: number;
  lowTime: number;
}

const program = new Command();

program
  .version("1.0.0")
  .description("RuneScape Item Price Fetcher")
  .requiredOption("-l, --level <number>", "Current crafting level", parseInt)
  .parse(process.argv);

const options = program.opts();

if (isNaN(options.level) || options.level < 1) {
  console.error(bc.red("Error: Crafting level must be a positive integer."));
  process.exit(1);
}

const currentCraftingLevel: number = options.level;

function colorCodedPrice(price: number, highestPrice: number): string {
  const ratio = price / highestPrice;
  if (ratio > 0.8) {
    return bc.red(`$${price.toLocaleString()}`);
  } else if (ratio > 0.5) {
    return bc.yellow(`$${price.toLocaleString()}`);
  } else {
    return bc.green(`$${price.toLocaleString()}`);
  }
}

(async () => {
  try {
    console.log(`Fetching data for crafting level: ${currentCraftingLevel}`);

    // Initialize RuneScape API with a user agent
    const userAgent = "my-rs-app - myemail@example.com";
    const rsAPI = new RuneScapeAPI(userAgent);

    // Filter items based on the current crafting level
    const usableItems = itemCraftingLevels.filter(
      (item: { id: number; name: string; craftingLevel: number }) =>
        item.craftingLevel <= currentCraftingLevel
    );

    console.log(`Total usable items: ${usableItems.length}`);

    // Fetch the latest prices
    const latestPrices: Record<number, PriceData> =
      await rsAPI.getLatestPrices();

    // Combine data for items that have price data
    const volumeDataList: VolumeData[] = usableItems
      .map((item: { id: number; name: string; craftingLevel: number }) => {
        const priceData = latestPrices[item.id];
        if (priceData) {
          return {
            itemId: item.id,
            itemName: item.name,
            highPrice: priceData.high,
            lowPrice: priceData.low,
            highTime: priceData.highTime,
            lowTime: priceData.lowTime,
          };
        }
        return null;
      })
      .filter((data): data is VolumeData => data !== null);

    console.log(`Usable Items with Price Data: ${volumeDataList.length}`);

    if (volumeDataList.length === 0) {
      console.log(bc.yellow("No items found with available price data."));
      return;
    }

    // Sort by highest price descending
    const sortedVolumeDataList = volumeDataList.sort(
      (a, b) => (b.highPrice || 0) - (a.highPrice || 0)
    );

    const highestPrice = sortedVolumeDataList[0].highPrice || 0;
    const longestName = sortedVolumeDataList.map(
      (item) => item.itemName
    ).length;

    console.log(bc.cyan("\nItem Prices:"));
    sortedVolumeDataList.forEach((item) => {
      const highPriceStr = item.highPrice
        ? colorCodedPrice(item.highPrice, highestPrice)
        : "N/A";
      const lowPriceStr = item.lowPrice
        ? colorCodedPrice(item.lowPrice, highestPrice)
        : "N/A";

      console.log(
        `Name: ${`${item.itemName}:`.padEnd(
          longestName,
          " "
        )} High Price: ${highPriceStr}, Low Price: ${lowPriceStr}`
      );
    });
  } catch (error) {
    console.error(bc.red("An error occurred while fetching data."));
    if (error instanceof Error) {
      console.error(bc.red(error.message));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
})();
