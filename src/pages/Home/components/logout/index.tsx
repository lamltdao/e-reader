import { Button, Typography } from "@mui/material";
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
            <Button onClick={logout} type="button" variant="outlined">
                <Typography>Logout</Typography>
            </Button>
        </div>
    );
}

export default LogoutButton;