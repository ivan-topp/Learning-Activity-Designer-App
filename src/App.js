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
                <AuthProvider>
                    <DesignProvider>
                        <SocketProvider>
                            <AppRouter />
                        </SocketProvider>
                    </DesignProvider>
                </AuthProvider>
            </UiProvider>
        </QueryClientProvider>
    );
}

export default LearningActivityDesigner;