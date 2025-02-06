import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockGraph = ({ priceHistory = [], minPrice, maxPrice }) => {
  const data = {
    labels: priceHistory.map((_, index) => index),
    datasets: [{
      label: 'Stock Price',
      data: priceHistory,
      borderColor: 'rgb(75, 192, 192)',      // Change line color
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Add area fill
      tension: 0.3,                          // Make line smoother
      pointRadius: 0,                        // Adjust point size
      borderWidth: 2                         // Adjust line thickness
    }]
  };

  const options = {
    scales: {
      y: {
        min: minPrice - 1,
        max: maxPrice + 1,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'  // Lighter grid lines
        }
      },
      x: {
        grid: {
          display: false                      // Hide vertical grid
        }
      }
    },
    plugins: {
      legend: {
        display: false                        // Hide legend
      },
      tooltip: {
        enabled: true,                        // Show tooltips on hover
        mode: 'index',
        intersect: false
      }
    },
    responsive: true,
    maintainAspectRatio: false,              // Custom height/width
    animation: {
      duration: 750                           // Smoother updates
    }
  };

  return (
    <div style={{ height: '150px' }}>
      <Line data={data} options={options} />
    </div>
  );
};
export default StockGraph;