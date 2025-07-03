import { API_CONFIG } from '../constants';
import { getCachedData, setCachedData } from '../utils/cache';

class StockAPI {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.apiKey = API_CONFIG.API_KEY;
  }

  async makeRequest(params) {
    try {
      const url = `${this.baseURL}?${new URLSearchParams({
        ...params,
        apikey: this.apiKey,
      })}`;

      console.log('Making API request to:', url.replace(this.apiKey, 'API_KEY_HIDDEN'));
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }
      
      if (data['Information']) {
        throw new Error(`API Information: ${data['Information']}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  getMockTopGainersLosers() {
    return {
      metadata: "Top gainers/losers for the US market",
      last_updated: new Date().toISOString(),
      top_gainers: [
        {
          ticker: "AAPL",
          price: "150.25",
          change_amount: "5.75",
          change_percentage: "3.98%",
          volume: "75000000"
        },
        {
          ticker: "GOOGL",
          price: "2750.80",
          change_amount: "125.30",
          change_percentage: "4.77%",
          volume: "25000000"
        },
        {
          ticker: "MSFT",
          price: "320.45",
          change_amount: "12.85",
          change_percentage: "4.18%",
          volume: "45000000"
        },
        {
          ticker: "TSLA",
          price: "850.20",
          change_amount: "35.60",
          change_percentage: "4.37%",
          volume: "55000000"
        },
        {
          ticker: "AMZN",
          price: "3200.75",
          change_amount: "145.25",
          change_percentage: "4.75%",
          volume: "18000000"
        },
        {
          ticker: "NVDA",
          price: "220.85",
          change_amount: "8.95",
          change_percentage: "4.23%",
          volume: "62000000"
        }
      ],
      top_losers: [
        {
          ticker: "META",
          price: "180.45",
          change_amount: "-8.25",
          change_percentage: "-4.38%",
          volume: "42000000"
        },
        {
          ticker: "NFLX",
          price: "385.20",
          change_amount: "-16.80",
          change_percentage: "-4.18%",
          volume: "28000000"
        },
        {
          ticker: "DIS",
          price: "95.75",
          change_amount: "-4.15",
          change_percentage: "-4.15%",
          volume: "35000000"
        },
        {
          ticker: "UBER",
          price: "45.20",
          change_amount: "-1.95",
          change_percentage: "-4.13%",
          volume: "48000000"
        },
        {
          ticker: "SNAP",
          price: "12.85",
          change_amount: "-0.58",
          change_percentage: "-4.32%",
          volume: "68000000"
        },
        {
          ticker: "TWTR",
          price: "38.45",
          change_amount: "-1.75",
          change_percentage: "-4.36%",
          volume: "52000000"
        }
      ]
    };
  }

  getMockCompanyOverview(symbol) {
    return {
      Symbol: symbol,
      AssetType: "Common Stock",
      Name: `${symbol} Inc.`,
      Description: `${symbol} is a leading technology company that designs, develops, and sells consumer electronics, computer software, and online services.`,
      Exchange: "NASDAQ",
      Currency: "USD",
      Country: "USA",
      Sector: "Technology",
      Industry: "Consumer Electronics",
      MarketCapitalization: "2500000000000",
      PERatio: "28.5",
      PEGRatio: "1.2",
      BookValue: "4.5",
      DividendPerShare: "0.88",
      DividendYield: "0.58",
      EPS: "5.25",
      RevenuePerShareTTM: "22.5",
      ProfitMargin: "0.23",
      OperatingMarginTTM: "0.28",
      ReturnOnAssetsTTM: "0.12",
      ReturnOnEquityTTM: "0.85",
      RevenueTTM: "365000000000",
      GrossProfitTTM: "170000000000",
      DilutedEPSTTM: "5.25",
      QuarterlyEarningsGrowthYOY: "0.15",
      QuarterlyRevenueGrowthYOY: "0.12",
      AnalystTargetPrice: "160.0",
      TrailingPE: "28.5",
      ForwardPE: "25.2",
      PriceToSalesRatioTTM: "7.2",
      PriceToBookRatio: "33.5",
      EVToRevenue: "7.8",
      EVToEBITDA: "21.5",
      Beta: "1.2",
      "52WeekHigh": "175.5",
      "52WeekLow": "125.2",
      "50DayMovingAverage": "148.5",
      "200DayMovingAverage": "142.8",
      SharesOutstanding: "16000000000",
      SharesFloat: "15800000000",
      SharesShort: "120000000",
      SharesShortPriorMonth: "110000000",
      ShortRatio: "1.8",
      ShortPercentOutstanding: "0.0075",
      ShortPercentFloat: "0.0076",
      PercentInsiders: "0.15",
      PercentInstitutions: "58.5",
      ForwardAnnualDividendRate: "0.92",
      ForwardAnnualDividendYield: "0.0061",
      PayoutRatio: "0.175",
      DividendDate: "2024-02-15",
      ExDividendDate: "2024-02-08",
      LastSplitFactor: "4:1",
      LastSplitDate: "2020-08-31"
    };
  }

  getMockTimeSeriesData(symbol) {
    const dates = [];
    const prices = [];
    const basePrice = 150;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
      
      const variation = (Math.random() - 0.5) * 10;
      const price = Math.max(basePrice + variation + (Math.sin(i / 5) * 5), 120);
      prices.push(price.toFixed(2));
    }

    const timeSeriesData = {};
    dates.forEach((date, index) => {
      timeSeriesData[date] = {
        "1. open": (parseFloat(prices[index]) - 1 + Math.random() * 2).toFixed(2),
        "2. high": (parseFloat(prices[index]) + Math.random() * 3).toFixed(2),
        "3. low": (parseFloat(prices[index]) - Math.random() * 3).toFixed(2),
        "4. close": prices[index],
        "5. volume": Math.floor(Math.random() * 100000000).toString()
      };
    });

    return {
      "Meta Data": {
        "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        "2. Symbol": symbol,
        "3. Last Refreshed": dates[dates.length - 1],
        "4. Output Size": "Compact",
        "5. Time Zone": "US/Eastern"
      },
      "Time Series (Daily)": timeSeriesData
    };
  }

  async getTopGainersLosers() {
    try {
      const cacheKey = 'topGainersLosers';
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.TOP_GAINERS_LOSERS,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching top gainers/losers:', error);
      return this.getMockTopGainersLosers();
    }
  }

  async getGlobalQuote(symbol) {
    try {
      const cacheKey = `globalQuote_${symbol}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.GLOBAL_QUOTE,
        symbol: symbol,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching global quote for ${symbol}:`, error);
      throw error;
    }
  }

  async getIntradayData(symbol, interval = '5min', outputsize = 'compact') {
    try {
      const cacheKey = `intraday_${symbol}_${interval}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.TIME_SERIES_INTRADAY,
        symbol: symbol,
        interval: interval,
        outputsize: outputsize,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching intraday data for ${symbol}:`, error);
      throw error;
    }
  }

  async getCompanyOverview(symbol) {
    try {
      const cacheKey = `companyOverview_${symbol}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.OVERVIEW,
        symbol: symbol,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching company overview for ${symbol}:`, error);
      return this.getMockCompanyOverview(symbol);
    }
  }

  async getNewsSentiment(tickers = null, topics = null, timeFrom = null, timeTo = null, sort = 'LATEST', limit = 50) {
    try {
      const cacheKey = `newsSentiment_${tickers || 'all'}_${limit}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const params = {
        function: API_CONFIG.FUNCTIONS.NEWS_SENTIMENT,
        sort: sort,
        limit: limit,
      };

      if (tickers) params.tickers = tickers;
      if (topics) params.topics = topics;
      if (timeFrom) params.time_from = timeFrom;
      if (timeTo) params.time_to = timeTo;

      const data = await this.makeRequest(params);

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching news sentiment:', error);
      return this.getMockNewsData(tickers, topics);
    }
  }

  getMockNewsData(tickers = null, topics = null) {
    const now = new Date();
    const formatAlphaVantageDate = (hoursAgo) => {
      const date = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      return `${year}${month}${day}T${hour}${minute}`;
    };

    const mockArticles = [
      {
        title: "Apple Reports Strong Q4 Earnings, iPhone Sales Surge",
        url: "https://example.com/apple-earnings",
        time_published: formatAlphaVantageDate(2),
        source: "Financial News Network",
        overall_sentiment_label: "Bullish",
        overall_sentiment_score: 0.75,
        summary: "Apple Inc. exceeded analyst expectations with strong iPhone sales and robust services revenue, driving optimism for the holiday quarter.",
        banner_image: "https://via.placeholder.com/600x300/007AFF/FFFFFF?text=AAPL+News",
        ticker_sentiment: [
          { ticker: "AAPL", relevance_score: "0.95", ticker_sentiment_score: "0.8", ticker_sentiment_label: "Bullish" }
        ],
        topics: ["earnings", "technology"]
      },
      {
        title: "Tesla Unveils New Charging Network Expansion Plans",
        url: "https://example.com/tesla-charging",
        time_published: formatAlphaVantageDate(4),
        source: "Tech Daily",
        overall_sentiment_label: "Bullish",
        overall_sentiment_score: 0.65,
        summary: "Tesla announces major expansion of Supercharger network, opening to all electric vehicles in move that could boost revenue.",
        banner_image: "https://via.placeholder.com/600x300/00C851/FFFFFF?text=TSLA+News",
        ticker_sentiment: [
          { ticker: "TSLA", relevance_score: "0.92", ticker_sentiment_score: "0.7", ticker_sentiment_label: "Bullish" }
        ],
        topics: ["technology", "energy_transportation"]
      },
      {
        title: "Federal Reserve Signals Potential Rate Cuts Ahead",
        url: "https://example.com/fed-rates",
        time_published: formatAlphaVantageDate(6),
        source: "Economic Times",
        overall_sentiment_label: "Bullish",
        overall_sentiment_score: 0.55,
        summary: "Fed officials hint at possible interest rate reductions in upcoming meetings, boosting market sentiment across sectors.",
        banner_image: "https://via.placeholder.com/600x300/5856D6/FFFFFF?text=Fed+News",
        ticker_sentiment: [
          { ticker: "SPY", relevance_score: "0.85", ticker_sentiment_score: "0.6", ticker_sentiment_label: "Bullish" },
          { ticker: "QQQ", relevance_score: "0.80", ticker_sentiment_score: "0.65", ticker_sentiment_label: "Bullish" }
        ],
        topics: ["financial_markets", "economy_monetary"]
      },
      {
        title: "Microsoft Azure Cloud Revenue Beats Expectations",
        url: "https://example.com/microsoft-azure",
        time_published: formatAlphaVantageDate(8),
        source: "Cloud Computing News",
        overall_sentiment_label: "Bullish",
        overall_sentiment_score: 0.72,
        summary: "Microsoft's cloud division continues strong growth trajectory, with Azure services showing significant market share gains.",
        banner_image: "https://via.placeholder.com/600x300/0078D4/FFFFFF?text=MSFT+News",
        ticker_sentiment: [
          { ticker: "MSFT", relevance_score: "0.98", ticker_sentiment_score: "0.75", ticker_sentiment_label: "Bullish" }
        ],
        topics: ["technology", "earnings"]
      },
      {
        title: "Cryptocurrency Market Faces Regulatory Uncertainty",
        url: "https://example.com/crypto-regulation",
        time_published: formatAlphaVantageDate(12),
        source: "Crypto Watch",
        overall_sentiment_label: "Bearish",
        overall_sentiment_score: -0.45,
        summary: "New regulatory proposals from government agencies create uncertainty in cryptocurrency markets, affecting related stocks.",
        banner_image: "https://via.placeholder.com/600x300/FF3B30/FFFFFF?text=Crypto+News",
        ticker_sentiment: [
          { ticker: "COIN", relevance_score: "0.90", ticker_sentiment_score: "-0.5", ticker_sentiment_label: "Bearish" }
        ],
        topics: ["financial_markets", "blockchain"]
      },
      {
        title: "AI Chip Demand Drives Semiconductor Sector Growth",
        url: "https://example.com/ai-chips",
        time_published: formatAlphaVantageDate(16),
        source: "Semiconductor Weekly",
        overall_sentiment_label: "Bullish",
        overall_sentiment_score: 0.82,
        summary: "Rising demand for AI processing chips continues to benefit major semiconductor companies as machine learning adoption accelerates.",
        banner_image: "https://via.placeholder.com/600x300/76B900/FFFFFF?text=AI+Chips",
        ticker_sentiment: [
          { ticker: "NVDA", relevance_score: "0.95", ticker_sentiment_score: "0.85", ticker_sentiment_label: "Bullish" },
          { ticker: "AMD", relevance_score: "0.88", ticker_sentiment_score: "0.70", ticker_sentiment_label: "Bullish" }
        ],
        topics: ["technology", "manufacturing"]
      },
      {
        title: "Bank Stocks Rally on Interest Rate Outlook",
        url: "https://example.com/bank-rally",
        time_published: formatAlphaVantageDate(20),
        source: "Banking Weekly",
        overall_sentiment_label: "Bullish",
        overall_sentiment_score: 0.68,
        summary: "Major bank stocks surge as investors anticipate favorable interest rate environment and strong lending growth ahead.",
        banner_image: "https://via.placeholder.com/600x300/34C759/FFFFFF?text=Bank+News",
        ticker_sentiment: [
          { ticker: "JPM", relevance_score: "0.90", ticker_sentiment_score: "0.72", ticker_sentiment_label: "Bullish" },
          { ticker: "BAC", relevance_score: "0.85", ticker_sentiment_score: "0.68", ticker_sentiment_label: "Bullish" }
        ],
        topics: ["financial_markets", "finance"]
      },
      {
        title: "Major IPO Filing Expected This Week",
        url: "https://example.com/ipo-filing",
        time_published: formatAlphaVantageDate(24),
        source: "IPO News",
        overall_sentiment_label: "Neutral",
        overall_sentiment_score: 0.15,
        summary: "Several companies are preparing for public offerings in what could be a busy week for initial public offerings.",
        banner_image: "https://via.placeholder.com/600x300/FF9500/FFFFFF?text=IPO+News",
        ticker_sentiment: [],
        topics: ["ipo", "financial_markets"]
      }
    ];

    let filteredArticles = [...mockArticles];

    // Filter by tickers
    if (tickers) {
      const tickerList = tickers.split(',').map(t => t.trim().toUpperCase());
      filteredArticles = filteredArticles.filter(article =>
        article.ticker_sentiment.some(ts => 
          tickerList.includes(ts.ticker.toUpperCase())
        )
      );
    }

    // Filter by topics
    if (topics && topics !== 'all') {
      filteredArticles = filteredArticles.filter(article =>
        article.topics && article.topics.includes(topics)
      );
    }

    return {
      items: filteredArticles.length.toString(),
      sentiment_score_definition: "x <= -0.35: Bearish; -0.35 < x <= 0.35: Neutral; 0.35 < x: Bullish",
      relevance_score_definition: "0 < x <= 1, with a higher score indicating higher relevance.",
      feed: filteredArticles
    };
  }

  async getMarketStatus() {
    try {
      const cacheKey = 'marketStatus';
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.MARKET_STATUS,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching market status:', error);
      throw error;
    }
  }

  async getEarnings(symbol) {
    try {
      const cacheKey = `earnings_${symbol}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.EARNINGS,
        symbol: symbol,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching earnings for ${symbol}:`, error);
      throw error;
    }
  }

  async getIncomeStatement(symbol) {
    try {
      const cacheKey = `incomeStatement_${symbol}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.INCOME_STATEMENT,
        symbol: symbol,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching income statement for ${symbol}:`, error);
      throw error;
    }
  }

  async getBalanceSheet(symbol) {
    try {
      const cacheKey = `balanceSheet_${symbol}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.BALANCE_SHEET,
        symbol: symbol,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching balance sheet for ${symbol}:`, error);
      throw error;
    }
  }

  async getCashFlow(symbol) {
    try {
      const cacheKey = `cashFlow_${symbol}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.CASH_FLOW,
        symbol: symbol,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching cash flow for ${symbol}:`, error);
      throw error;
    }
  }

  async getSMA(symbol, interval = 'daily', timePeriod = 20, seriesType = 'close') {
    try {
      const cacheKey = `sma_${symbol}_${interval}_${timePeriod}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.SMA,
        symbol: symbol,
        interval: interval,
        time_period: timePeriod,
        series_type: seriesType,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching SMA for ${symbol}:`, error);
      throw error;
    }
  }

  async getEMA(symbol, interval = 'daily', timePeriod = 20, seriesType = 'close') {
    try {
      const cacheKey = `ema_${symbol}_${interval}_${timePeriod}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.EMA,
        symbol: symbol,
        interval: interval,
        time_period: timePeriod,
        series_type: seriesType,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching EMA for ${symbol}:`, error);
      throw error;
    }
  }

  async getRSI(symbol, interval = 'daily', timePeriod = 14, seriesType = 'close') {
    try {
      const cacheKey = `rsi_${symbol}_${interval}_${timePeriod}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.RSI,
        symbol: symbol,
        interval: interval,
        time_period: timePeriod,
        series_type: seriesType,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching RSI for ${symbol}:`, error);
      throw error;
    }
  }

  async getMACD(symbol, interval = 'daily', seriesType = 'close', fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    try {
      const cacheKey = `macd_${symbol}_${interval}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.MACD,
        symbol: symbol,
        interval: interval,
        series_type: seriesType,
        fastperiod: fastPeriod,
        slowperiod: slowPeriod,
        signalperiod: signalPeriod,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching MACD for ${symbol}:`, error);
      throw error;
    }
  }

  async getTimeSeriesDaily(symbol, outputsize = 'compact') {
    try {
      const cacheKey = `timeSeries_${symbol}_${outputsize}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.TIME_SERIES_DAILY,
        symbol: symbol,
        outputsize: outputsize,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching time series for ${symbol}:`, error);
      return this.getMockTimeSeriesData(symbol);
    }
  }

  async searchSymbol(keywords) {
    try {
      const cacheKey = `search_${keywords}`;
      const cachedData = await getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const data = await this.makeRequest({
        function: API_CONFIG.FUNCTIONS.SYMBOL_SEARCH,
        keywords: keywords,
      });

      await setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error searching symbol:', error);
      return {
        bestMatches: [
          {
            "1. symbol": keywords.toUpperCase(),
            "2. name": `${keywords} Inc`,
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-04",
            "8. currency": "USD",
            "9. matchScore": "0.8000"
          }
        ]
      };
    }
  }
}

export default new StockAPI(); 