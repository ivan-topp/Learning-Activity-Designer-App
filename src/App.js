import { AuthProvider } from "./contexts/AuthContext";
import { AppRouter } from "./router/AppRouter";

function LearningActivityDesigner() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}

export default LearningActivityDesigner;
