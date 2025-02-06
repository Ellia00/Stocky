import { useState, useEffect } from "react";
import "./StockDisplay.css";
import StockGraph from "./StockGraph";



const StockDisplay = ({ money, onPurchase }) => {
  const [countdown, setCountdown] = useState(10);
  const [unlockedStocks, setUnlockedStocks] = useState(() => {
    const savedStocks = localStorage.getItem("stocks");
    if (savedStocks) {
      return JSON.parse(savedStocks);
    }
    return [
      {
        id: 1,
        name: "Basic Stock",
        isUnlocked: true,
        price: 5,
        priceHistory: [5],
        basePrice: 5,
        owned: 0,
        minPrice: 2,
        maxPrice: 10,
        maxOwned: 50,
        totalSpent: 0,
      },
      {
        id: 2,
        name: "Premium Stock",
        isUnlocked: false,
        price: 500,
        basePrice: 500,
        owned: 0,
        minPrice: 300,
        maxPrice: 700,
        maxOwned: 25,
        totalSpent: 0,
      },
      {
        id: 3,
        name: "Elite Stock",
        isUnlocked: false,
        price: 1000,
        basePrice: 1000,
        owned: 0,
        minPrice: 800,
        maxPrice: 1200,
        maxOwned: 10,
        totalSpent: 0,
      },
      {
        id: 4,
        name: "Legendary Stock",
        isUnlocked: false,
        price: 5000,
        basePrice: 5000,
        owned: 0,
        minPrice: 4000,
        maxPrice: 6000,
        maxOwned: 5,
        totalSpent: 0,
      },
    ];
  });
  const [priceChanges, setPriceChanges] = useState({});

  useEffect(() => {
    const updatePrices = () => {
      setUnlockedStocks((stocks) =>
        stocks.map((stock) => {
          const oldPrice = stock.price;
          const priceRange = stock.maxPrice - stock.minPrice;
          const volatility = Math.random();

          let change = volatility > 0.7
            ? (Math.random() - 0.5) * (priceRange * 0.8)
            : (Math.random() - 0.5) * (priceRange * 0.15);

          if (Math.random() < 0.05) {
            change *= 5; // Extrem förändring
          }

          // console.log(stock.id, change);
          // Runda av till närmaste heltal
          change = Math.round(change);
          
          console.log(stock.id, change);
          // Om förändringen blir 0, låt det vara kvar 50% av gångerna
          if (change === 0 && Math.random() < 0.5) {
            change = Math.random() > 0.5 ? 1 : -1;
          }


          const newPrice = Math.round(stock.price + change);
          const finalPrice = Math.min(Math.max(newPrice, stock.minPrice), stock.maxPrice);

          setPriceChanges((prev) => ({
            ...prev,
            [stock.id]: finalPrice > oldPrice ? "green" : finalPrice < oldPrice ? "red" : "",
          }));

          return {
            ...stock,
            price: finalPrice,
            priceHistory: [...(stock.priceHistory || []), finalPrice].slice(-20) //keep last 10 prices
          };
        })
      );
      setCountdown(10);
    };

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const priceInterval = setInterval(updatePrices, 10000);
    updatePrices(); // Initial price update

    return () => {
      clearInterval(priceInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(unlockedStocks));
  }, [unlockedStocks]);


  const buyStock = (stockId) => {
    const stock = unlockedStocks.find((s) => s.id === stockId);
    if (
      stock &&
      stock.isUnlocked &&
      money >= stock.price &&
      stock.owned < stock.maxOwned
    ) {
      onPurchase(stock.price);
      setUnlockedStocks(
        unlockedStocks.map((s) => {
          if (s.id === stockId) {
            const newTotalSpent = s.totalSpent + stock.price;
            return {
              ...s,
              owned: s.owned + 1,
              totalSpent: newTotalSpent,
            };
          }
          return s;
        })
      );
    }
  };

  const getMaxBuyInfo = (stock) => {
    if (!stock.isUnlocked) return null;
    const maxAffordable = Math.floor(money / stock.price);
    const spaceLeft = stock.maxOwned - stock.owned;
    const buyAmount = Math.min(maxAffordable, spaceLeft);
    const totalCost = (stock.price * buyAmount).toFixed(2);

    return ` $${totalCost}`;
  };
  const buyMaxStock = (stockId) => {
    const stock = unlockedStocks.find((s) => s.id === stockId);
    if (stock && stock.isUnlocked) {
      const maxAffordable = Math.floor(money / stock.price);
      const spaceLeft = stock.maxOwned - stock.owned;
      const buyAmount = Math.min(maxAffordable, spaceLeft);

      if (buyAmount > 0) {
        const totalCost = stock.price * buyAmount;
        onPurchase(totalCost);
        setUnlockedStocks(
          unlockedStocks.map((s) => {
            if (s.id === stockId) {
              return {
                ...s,
                owned: s.owned + buyAmount,
                totalSpent: s.totalSpent + totalCost,
              };
            }
            return s;
          })
        );
      }
    }
  };
  const sellStock = (stockId) => {
    const stock = unlockedStocks.find((s) => s.id === stockId);
    if (stock && stock.owned > 0) {
      onPurchase(-stock.price);
      setUnlockedStocks(
        unlockedStocks.map((s) => {
          if (s.id === stockId) {
            const newOwned = s.owned - 1;
            const averagePrice = s.totalSpent / s.owned;
            return {
              ...s,
              owned: newOwned,
              totalSpent: averagePrice * newOwned,
            };
          }
          return s;
        })
      );
    }
  };

  const sellAllStock = (stockId) => {
    const stock = unlockedStocks.find((s) => s.id === stockId);
    if (stock && stock.owned > 0) {
      onPurchase(-stock.price * stock.owned);
      setUnlockedStocks(
        unlockedStocks.map((s) => {
          if (s.id === stockId) {
            return {
              ...s,
              owned: 0,
              totalSpent: 0,
            };
          }
          return s;
        })
      );
    }
  };

  const getAveragePrice = (stock) => {
    if (stock.owned === 0) return 0;
    return (stock.totalSpent / stock.owned).toFixed(2);
  };

  const getPotentialProfit = (stock) => {
    if (stock.owned === 0) return null;
    const potentialProfit = (
      stock.price * stock.owned -
      stock.totalSpent
    ).toFixed(2);
    const profitDisplay =
      potentialProfit >= 0
        ? `+$${potentialProfit}`
        : `-$${Math.abs(potentialProfit)}`;
    const profitColor = potentialProfit >= 0 ? "green" : "red";
    return <span style={{ color: profitColor }}>{profitDisplay}</span>;
  };

  return (
    <div className="stock-display">
      <h2>Available Stocks</h2>
      <p>Next price update in: {countdown}s</p>
      <div className="stocks-grid">
        {unlockedStocks.map((stock) => (
          <div
            key={stock.id}
            className={`stock-item ${stock.isUnlocked ? "unlocked" : "locked"}`}
          >
            <h3>{stock.name}</h3>
            <StockGraph priceHistory={stock.priceHistory} minPrice={stock.minPrice} maxPrice={stock.maxPrice} />

            <p>{stock.isUnlocked ? "" : "Locked"}</p>
            <p
              style={{
                color: priceChanges[stock.id],
                transition: "color 0.3s ease",
              }}
            >
              Price: ${stock.price}
            </p>
            <p>
              Owned: {stock.owned}/{stock.maxOwned}
            </p>
            <p>Average Buy Price: ${getAveragePrice(stock)}</p>
            {stock.isUnlocked && (
              <div className="button-group">
                <button
                  onClick={() => buyMaxStock(stock.id)}
                  className="buy-button"
                  disabled={
                    money < stock.price || stock.owned >= stock.maxOwned
                  }
                >
                  Buy Max{getMaxBuyInfo(stock)}
                </button>
                <button
                  onClick={() => buyStock(stock.id)}
                  className="buy-button"
                  disabled={
                    money < stock.price || stock.owned >= stock.maxOwned
                  }
                >
                  Buy
                </button>
                <button
                  onClick={() => sellStock(stock.id)}
                  className="sell-button"
                  disabled={stock.owned === 0}
                >
                  Sell
                </button>
                <button
                  onClick={() => sellAllStock(stock.id)}
                  className="sell-button"
                  disabled={stock.owned === 0}
                >
                  Sell All
                </button>
                {stock.owned > 0 && getPotentialProfit(stock)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDisplay;
