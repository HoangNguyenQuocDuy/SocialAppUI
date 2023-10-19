import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobalStyle from './components/GlobalStyle/GlobalStyle.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistor, store } from './store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalStyle>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </GlobalStyle>
    </QueryClientProvider>
  // </React.StrictMode>,
)
