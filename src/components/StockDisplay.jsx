import { useState, useEffect } from 'react';
import './StockDisplay.css';

const StockDisplay = ({ money, onPurchase }) => {
  const [unlockedStocks, setUnlockedStocks] = useState(() => {
      const savedStocks = localStorage.getItem('stocks');
      if (savedStocks) {
          return JSON.parse(savedStocks);
      }
      return [
          { id: 1, name: 'Basic Stock', isUnlocked: true, price: 10, owned: 0 },
          { id: 2, name: 'Premium Stock', isUnlocked: false, price: 500, owned: 0 },
          { id: 3, name: 'Elite Stock', isUnlocked: false, price: 1000, owned: 0 },
          { id: 4, name: 'Legendary Stock', isUnlocked: false, price: 5000, owned: 0 }
      ];
  });

  useEffect(() => {
      localStorage.setItem('stocks', JSON.stringify(unlockedStocks));
  }, [unlockedStocks]);

const buyStock = (stockId) => {    const stock = unlockedStocks.find(s => s.id === stockId);
    if (stock && stock.isUnlocked && money >= stock.price) {
      onPurchase(stock.price);
      setUnlockedStocks(unlockedStocks.map(s => {
        if (s.id === stockId) {
          return { ...s, owned: s.owned + 1 };
        }
        return s;
      }));
    }
  };

  const sellStock = (stockId) => {
    const stock = unlockedStocks.find(s => s.id === stockId);
    if (stock && stock.owned > 0) {
      onPurchase(-stock.price); // Negative price means adding money back
      setUnlockedStocks(unlockedStocks.map(s => {
        if (s.id === stockId) {
          return { ...s, owned: s.owned - 1 };
        }
        return s;
      }));
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
            <p>{stock.isUnlocked ? '' : 'Locked'}</p>
            <p>Price: ${stock.price}</p>
            <p>Owned: {stock.owned}</p>
            {stock.isUnlocked && (  
              <div className="button-group">
                <button
                  onClick={() => buyStock(stock.id)}
                  className="buy-button"
                  disabled={money < stock.price}
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDisplay;