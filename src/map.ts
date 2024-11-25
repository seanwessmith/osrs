import itemsComplete from "./data/items-complete.json";
import itemsCraftingLevels from "./data/items-crafting-levels.json";

interface ItemsComplete {
  [id: number]: { name: string };
}

const typedItemsComplete: ItemsComplete = itemsComplete as any;

const main = async () => {
  const itemMap: { id: number; name: string, craftingLevel: number }[] = [];
  itemsCraftingLevels.forEach((item) => {
    const id = Object.keys(typedItemsComplete).find((key) => {
      if (
        typedItemsComplete[key as any].name.toLowerCase() ===
        item.name.toLowerCase()
      ) {
        return key;
      }
    });
    if (!id) {
      throw new Error(`Item ${item.name} not found in items-complete.json`);
    }
    itemMap.push({ id: parseInt(id), craftingLevel: item.id, name: item.name });
  });
  await Bun.write("items-crafting.json", JSON.stringify(itemMap));
};

main();
