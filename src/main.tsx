import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ChartPage from './page/ChartPage.tsx'
import HomePage from './page/HomePage.tsx'
import App from './app/App.tsx'
import Task2Page from './page/Task2Page.tsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>  
    },
    {
        path: "/task1",
        element: <ChartPage/>  
    },
    {
        path: "/task2",
        element: <Task2Page/>  
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App>
        <RouterProvider router={router} />
    </App> 
)
