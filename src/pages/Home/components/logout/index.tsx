import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../context/authentication";

const LogoutButton = () => {
    const navigate = useNavigate();
    const { doLogout } = useAuthentication();

    const logout = async () => {
        await doLogout();

        navigate("/login");
    };

    return (
        <div>
            <button onClick={logout} type="button">
                Logout
            </button>
        </div>
    );
}

export default LogoutButton;