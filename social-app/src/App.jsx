import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Fragment } from 'react'

import  { publicRouters } from './routers'
import DefaultLayout from '~/Layout/DefaultLayout'
import './assets/vuesax-icon-main/style.css'

function App() {

  return (
      <Router>
        <Routes>
          { publicRouters.map((route, idx) => {
            const Page = route.component
            let Layout = DefaultLayout

            if (route.layout) {
              Layout = route.layout
            } else if (route.layout === null) {
              Layout = Fragment
            }

            return (
              <Route
                key={idx}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            )
          }) }
        </Routes>
      </Router>
  )
}

export default App
