import { useState } from 'react';
import axios from 'axios';

const CallAPIComponent = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const fetchApiData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/trades/${apiKey}`);
      console.log(response.data);
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={apiKey}
        onChange={handleInputChange}
        placeholder="Enter your apiKey"
      />
      <button onClick={fetchApiData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </div>
  );
};

export default CallAPIComponent;
