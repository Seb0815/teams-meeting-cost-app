import { useEffect, useState } from 'react';
import { app } from '@microsoft/teams-js';
import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
} from '@fluentui/react-components';
import { CostMeter } from './components/CostMeter';

type TeamsTheme = 'default' | 'dark' | 'contrast';

function getFluentTheme(theme: TeamsTheme) {
  switch (theme) {
    case 'dark': return teamsDarkTheme;
    case 'contrast': return teamsHighContrastTheme;
    default: return teamsLightTheme;
  }
}

function App() {
  const [theme, setTheme] = useState<TeamsTheme>('default');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    app.initialize().then(() => {
      app.getContext().then((ctx) => {
        setTheme((ctx.app.theme ?? 'default') as TeamsTheme);
        setInitialized(true);
      });
      app.registerOnThemeChangeHandler((t) => setTheme(t as TeamsTheme));
    }).catch(() => {
      // Außerhalb von Teams (Browser-Entwicklung)
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    return (
      <FluentProvider theme={teamsLightTheme}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <span>Laden…</span>
        </div>
      </FluentProvider>
    );
  }

  return (
    <FluentProvider theme={getFluentTheme(theme)}>
      <CostMeter />
    </FluentProvider>
  );
}

export default App;
