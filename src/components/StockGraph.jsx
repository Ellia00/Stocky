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

const StockGraph = ({ priceHistory = [], minPrice, maxPrice, averagePrice }) => {
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
    }, {
      label: "Avg Buy Price",
      data: Array(priceHistory.length).fill(averagePrice),
      borderColor: 'rgba(0, 255, 0, 0.5)',
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false
    }
    ]
  };

  const options = {
    scales: {
      y: {
        min: minPrice,
        max: maxPrice,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'  // Lighter grid lines
        }
      },
      x: {
        display: false,                        // Hide x-axis labels
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