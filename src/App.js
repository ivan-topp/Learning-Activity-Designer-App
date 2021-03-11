import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider } from "contexts/AuthContext";
import { SocketProvider } from "contexts/SocketContext";
import { UiProvider } from "contexts/ui/UiContext";
import { AppRouter } from "router/AppRouter";
import { DesignProvider } from "contexts/design/DesignContext";

const queryClient = new QueryClient()

function LearningActivityDesigner() {

    return (
        <QueryClientProvider client={queryClient}>
            <UiProvider>
                <DesignProvider>
                    <SocketProvider>
                        <AuthProvider>
                            <AppRouter />
                        </AuthProvider>
                    </SocketProvider>
                </DesignProvider>
            </UiProvider>
        </QueryClientProvider>
    );
}

export default LearningActivityDesigner;