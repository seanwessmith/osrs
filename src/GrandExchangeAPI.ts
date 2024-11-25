// src/GrandExchangeAPI.ts
import axios, { type AxiosInstance } from 'axios';

interface ItemDetailResponse {
  item: ItemDetail;
}

interface ItemDetail {
  icon: string;
  icon_large: string;
  id: number;
  type: string;
  typeIcon: string;
  name: string;
  description: string;
  current: PriceInfo;
  today: PriceInfo;
  members: string; // "true" or "false"
  day30: TrendInfo;
  day90: TrendInfo;
  day180: TrendInfo;
}

interface PriceInfo {
  trend: string; // "positive", "negative", "neutral"
  price: string | number; // Can be a string like "17.0m" or a number
}

interface TrendInfo {
  trend: string;
  change: string;
}

class GrandExchangeAPI {
  private baseURL: string;
  private axiosInstance: AxiosInstance;

  constructor(game: 'rs3' | 'osrs') {
    this.baseURL =
      game === 'osrs'
        ? 'https://secure.runescape.com/m=itemdb_oldschool'
        : 'https://secure.runescape.com/m=itemdb_rs';

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
    });
  }

  /**
   * Get detailed information about an item.
   * @param itemID The item ID.
   */
  public async getItemDetail(itemID: number): Promise<ItemDetail> {
    const url = '/api/catalogue/detail.json';
    const response = await this.axiosInstance.get(url, {
      params: { item: itemID },
    });
    return response.data.item;
  }
}

export default GrandExchangeAPI;