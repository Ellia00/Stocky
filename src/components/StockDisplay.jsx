import { useState } from "react";
import "./StockDisplay.css";

const StockDisplay = ({money, onPurchase}) => {
  const [unlockedStocks, setUnlockedStocks] = useState([
    { id: 1, name: "Basic Stock", isUnlocked: true, price: 100, owned: 0 },
    { id: 2, name: "Premium Stock", isUnlocked: false, price: 500, owned: 0 },
    { id: 3, name: "Elite Stock", isUnlocked: false, price: 1000, owned: 0 },
    {
      id: 4,
      name: "Legendary Stock",
      isUnlocked: false,
      price: 5000,
      owned: 0,
    },
  ]);

  const buyStock = (stockId) => {
    const stock = unlockedStocks.find((s) => s.id === stockId);
    if (stock && onPurchase(stock.price)) {
      setUnlockedStocks(
        unlockedStocks.map((s) => {
          if (s.id === stockId) {
            return { ...s, owned: s.owned + 1 };
          }
          return s;
        })
      );
    }
  };

  return (
    <div className="stock-display">
      <h2>Available Stocks</h2>
      <div className="stocks-grid">
        {unlockedStocks.map((stock) => (
          <div
            key={stock.id}
            className={`stock-item ${stock.isUnlocked ? "unlocked" : "locked"}`}
          >
            <h3>{stock.name}</h3>
            <p>{stock.isUnlocked ? "Unlocked" : "Locked"}</p>
            <p>Price: ${stock.price}</p>
            <p>Owned: {stock.owned}</p>
            {stock.isUnlocked && (
              <button onClick={() => buyStock(stock.id)} className="buy-button">
                Buy Stock
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDisplay;
