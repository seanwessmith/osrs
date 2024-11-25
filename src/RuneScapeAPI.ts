interface PriceData {
  high: number;
  highTime: number;
  low: number;
  lowTime: number;
}

interface LatestPricesResponse {
  [itemId: string]: PriceData;
}

class RuneScapeAPI {
  private baseUrl: string;
  private userAgent: string;

  constructor(userAgent: string) {
    this.baseUrl = "https://prices.runescape.wiki/api/v1/osrs/";
    this.userAgent = userAgent;
  }

  private async fetchAPI<T>(
    endpoint: string,
    params: { [key: string]: any } = {}
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key].toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": this.userAgent,
      },
    });

    if (!response.ok) {
      console.error(
        `Error fetching ${url.toString()}: ${response.status} ${
          response.statusText
        }`
      );
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  }

  /**
   * Get the latest prices for all items.
   */
  public async getLatestPrices(): Promise<LatestPricesResponse> {
    const endpoint = "latest";
    const data = await this.fetchAPI<{ data: LatestPricesResponse }>(endpoint);
    return data.data;
  }
}

export default RuneScapeAPI;
