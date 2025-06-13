import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookDashboard } from "./pages/BookDashboard";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <BookDashboard/>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
