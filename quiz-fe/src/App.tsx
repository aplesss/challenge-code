import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { WebsocketProvider } from './socketService';
import { store } from './redux/store';
import loadingGif from './assets/loading.gif';
import './App.css';

const JoinUs = React.lazy(() => import('./components/JoinUsPage'));
const Lobby = React.lazy(() => import('./components/LobbyPage'));
const Quiz = React.lazy(() => import('./components/QuizPage'));

const SpinLoading = () => {
  return (
    <div className="spinner-container">
      <img className="spin-img" src={loadingGif} alt="Loading..." />
    </div>
  );
};
const App: React.FC = () => {
  return (
    <Suspense fallback={<SpinLoading />}>
      <Provider store={store}>
        <WebsocketProvider>
          <Router>
            <Routes>
              <Route path="/" element={<JoinUs />} />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/quiz" element={<Quiz />} />
            </Routes>
          </Router>
        </WebsocketProvider>
      </Provider>
    </Suspense>
  );
};

export default App;
