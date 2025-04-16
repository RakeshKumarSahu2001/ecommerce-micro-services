import { Navigate } from 'react-router-dom';


function Protected({ children }) {
    const user=sessionStorage.getItem("Id");

    return user ? <>{children}</> : <Navigate to="/auth/login" replace={true} />;
}

export default Protected;
