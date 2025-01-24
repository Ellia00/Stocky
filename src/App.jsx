import { useEffect, useState } from 'react';
import "./App.css";
import CounterButton from './components/CounterButton';
import StockDisplay from './components/StockDisplay';

function App() {

  const storedMoney = localStorage.getItem('money');
  const initialMoney = storedMoney ? parseInt(storedMoney) : 0;
  
  const [money, setMoney] = useState(initialMoney);

  useEffect(() => {
      localStorage.setItem('money', money);
  }, [money]);

  const increaseMoney = () => {
      setMoney(money + 1);
  };

  const spendMoney = (amount) => {
      if (money >= amount) {
          setMoney(money - amount);
          return true;
      }
      return false;
  };

  return (
      <div>
          <h1>Stock Manager</h1>
          <h2>Money: ${money}</h2>
          <CounterButton onClick={increaseMoney} />
          <StockDisplay money={money} onPurchase={spendMoney} />
      </div>
  );
}

export default App;