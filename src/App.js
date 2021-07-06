import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "contexts/AuthContext";
import { SocketProvider } from "contexts/SocketContext";
import { UiProvider } from "contexts/ui/UiContext";
import { AppRouter } from "router/AppRouter";
import { DesignProvider } from "contexts/design/DesignContext";
import { SharedDocProvider } from "contexts/SharedDocContext";
import { SnackbarProvider } from 'notistack';
import { Grow } from '@material-ui/core';
import { UserConfigProvider } from 'contexts/UserConfigContext';


const queryClient = new QueryClient()

function LearningActivityDesigner() {

    return (
        <QueryClientProvider client={queryClient}>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} TransitionComponent={Grow}>
                <UiProvider>
                    <AuthProvider>
                        <UserConfigProvider>
                            <DesignProvider>
                                <SocketProvider>
                                    <SharedDocProvider>
                                        <AppRouter />
                                    </SharedDocProvider>
                                </SocketProvider>
                            </DesignProvider>
                        </UserConfigProvider>
                    </AuthProvider>
                </UiProvider>
            </SnackbarProvider>
        </QueryClientProvider>
    );
}

export default LearningActivityDesigner;