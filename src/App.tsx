import { RouterProvider } from 'react-router-dom';
import { router } from './ui/routes';

export default function App() {
  return <RouterProvider router={router} />;
}
