import { useState } from 'react';

import { getLoginUrl } from '../apis/broker';

const ConnectBroker = () => {
  const [loading, setLoading] =
    useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);

      const data =
        await getLoginUrl();

      window.location.href =
        data.loginUrl;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">
          Connect Zerodha
        </h1>

        <p className="mb-6 text-slate-400">
          Connect your Zerodha account
          to start tracking your
          portfolio.
        </p>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white"
        >
          {loading
            ? 'Redirecting...'
            : 'Connect Zerodha'}
        </button>
      </div>
    </div>
  );
};

export default ConnectBroker;