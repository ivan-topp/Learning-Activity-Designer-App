import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider } from "./contexts/AuthContext";
import { UiProvider } from "./contexts/UiContext";
import { AppRouter } from "./router/AppRouter";

const queryClient = new QueryClient()

function LearningActivityDesigner() {
    
    return (
        <QueryClientProvider client={queryClient}>
            <UiProvider>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </UiProvider>
        </QueryClientProvider>
    );
}

export default LearningActivityDesigner;