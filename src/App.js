import { AuthProvider } from "./contexts/AuthContext";
import { UiProvider } from "./contexts/UiContext";
import { UserConfigProvider } from "./contexts/UserConfigContext";
import { AppRouter } from "./router/AppRouter";

function LearningActivityDesigner() {
    
    return (
        <UiProvider>
            <AuthProvider>
                <UserConfigProvider>
                    <AppRouter />
                </UserConfigProvider>
            </AuthProvider>
        </UiProvider>
    );
}

export default LearningActivityDesigner;