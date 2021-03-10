import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { UiProvider } from "./contexts/ui/UiContext";
import { AppRouter } from "./router/AppRouter";

const queryClient = new QueryClient()

function LearningActivityDesigner() {

    return (
        <QueryClientProvider client={queryClient}>
            <UiProvider>
                <SocketProvider>
                    <AuthProvider>
                        <AppRouter />
                    </AuthProvider>
                </SocketProvider>
            </UiProvider>
        </QueryClientProvider>
    );
}

export default LearningActivityDesigner;