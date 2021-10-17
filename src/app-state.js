import * as React from "react";

const AppStateContext = React.createContext();

function appReducer(state, action) {
  switch (action.type) {
    case "selectTest": {
      return { test: action.test };
    }
    case "deselectTest": {
      return { test: null };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AppStateProvider({ children }) {
  const [state, dispatch] = React.useReducer(appReducer, { test: null });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

function useAppContext() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a AppContext");
  }
  return context;
}

export { AppStateProvider, useAppState };
