import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis/axios';

const ZerodhaCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const connectBroker = async () => {
      try {
        const params = new URLSearchParams(
          window.location.search
        );

        const requestToken =
          params.get('request_token');

        if (!requestToken) {
          setError('Missing request token');
          return;
        }

        await api.get(
          `/broker/zerodha/callback?request_token=${requestToken}`
        );

        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        setError(
          'Failed to connect Zerodha account'
        );
      }
    };

    connectBroker();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      Connecting Zerodha...
    </div>
  );
};

export default ZerodhaCallback;