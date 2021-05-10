import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "contexts/AuthContext";
import { SocketProvider } from "contexts/SocketContext";
import { UiProvider } from "contexts/ui/UiContext";
import { AppRouter } from "router/AppRouter";
import { DesignProvider } from "contexts/design/DesignContext";
import { SharedDocProvider } from "contexts/SharedDocContext";

import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

const queryClient = new QueryClient()

function LearningActivityDesigner() {

    return (
        <QueryClientProvider client={queryClient}>
            <UiProvider>
                <AuthProvider>
                    <DesignProvider>
                        <SocketProvider>
                            <SharedDocProvider>
                                <AppRouter />
                            </SharedDocProvider>
                        </SocketProvider>
                    </DesignProvider>
                </AuthProvider>
            </UiProvider>
        </QueryClientProvider>
    );
}

export default LearningActivityDesigner;