/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useState } from 'react';
import GeminiAssistantModal from './components/GeminiAssistantModal';
import Home from './pages/Home';
import GetInvolved from './pages/GetInvolved';
import Investors from './pages/Investors';
import Privacy from './pages/Privacy';
import HowWeMakeIt from './pages/HowWeMakeIt';
import OurKiln from './pages/OurKiln';
// Results loads the database code, so it is only downloaded when that page is opened.
const Results = lazy(() => import('./pages/Results'));
import Header from './site/Header';
import Footer from './site/Footer';
import FloatingHelp from './site/FloatingHelp';
import { LangProvider } from './site/lang';
import { useRoute } from './site/router';

function Site() {
  const route = useRoute();
  const [askOpen, setAskOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-ash text-char">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-char focus:px-4 focus:py-2 focus:text-ash">
        Skip to content
      </a>
      <Header route={route} />
      <main id="main" className="flex-1">
        {route === 'home' && <Home />}
        {route === 'how' && <HowWeMakeIt />}
        {route === 'kiln' && <OurKiln />}
        {route === 'results' && (
          <Suspense fallback={<div className="py-24" />}>
            <Results />
          </Suspense>
        )}
        {route === 'investors' && <Investors />}
        {route === 'join' && <GetInvolved />}
        {route === 'privacy' && <Privacy />}
      </main>
      <Footer />
      <FloatingHelp onAsk={() => setAskOpen(true)} />
      <GeminiAssistantModal isOpen={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Site />
    </LangProvider>
  );
}
