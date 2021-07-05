import { createBrowserHistory } from "history";
import { Route, Router } from "react-router-dom";
import Routes from "src/Routes";
import { QueryParamProvider } from "use-query-params";

import AuthGuard from "./components/Guards/AuthGuard";

const App = () => {
  const history = createBrowserHistory();

  return (
    <AuthGuard>
      <Router history={history}>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Routes />
        </QueryParamProvider>
      </Router>
    </AuthGuard>
  );
};

export default App;
