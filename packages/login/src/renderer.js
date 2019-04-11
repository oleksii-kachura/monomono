import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Root } from '@oneaccount/react-foundations';
import { StaticRouter } from 'react-router';
import { Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { DefaultThemeProvider } from '@beans/theme';
import Spinner from '../src/universal/components/common/spinner';

const globalStyles = {
  fonts: {
    fileFormats: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
    filePath: '/account/login/fonts',
    styleNames: ['bold', 'regular', 'regularItalic'],
  },
  normalize: true,
};

export const renderServer = (inititalData, history, routes, context, sheet, url) => {
  const { payload, ...appConfig } = inititalData;

  return ReactDOMServer.renderToString(
    sheet.collectStyles(
      <Root
        initialData={payload || {}}
        appConfig={appConfig}
        loadingFallback={<Spinner />}
        errorFallback={<div>Error Please refresh the page</div>}
      >
        <DefaultThemeProvider globalStyles={globalStyles}>
          <StaticRouter location={url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </DefaultThemeProvider>
      </Root>
    ),
  );
}

export const renderClient = (inititalData, routes, history) => {
  const { payload, ...appConfig } = inititalData;

  ReactDOM.hydrate(
    <Root
      initialData={payload || {}}
      appConfig={appConfig}
      loadingFallback={<Spinner />}
      errorFallback={<div>Error Please refresh the page</div>}
    >
      <DefaultThemeProvider globalStyles={globalStyles}>
        <Router history={history}>{renderRoutes(routes)}</Router>
      </DefaultThemeProvider>
    </Root>,
    document.getElementById('main'),
  );
};
