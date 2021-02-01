import { AuthProvider } from "./contexts/AuthContext";
import { UiProvider } from "./contexts/UiContext";
import { AppRouter } from "./router/AppRouter";

function LearningActivityDesigner() {
    return (
        <UiProvider>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </UiProvider>
    );
}

export default LearningActivityDesigner;