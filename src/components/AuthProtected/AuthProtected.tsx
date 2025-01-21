import { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { isUserAuthSelector } from "../../store/user/user";
import { Navigate } from "react-router-dom";

interface Props extends PropsWithChildren {}

function AuthProtected(props: Props) {
  const isAuth = useSelector(isUserAuthSelector);
  if (isAuth) {
    return <>{props.children}</>;
  }
  return <Navigate to="/login" replace />;
}

export default AuthProtected;
