import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  return props.accessState ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;