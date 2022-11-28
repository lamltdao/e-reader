import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
} from './NavbarElements';
import Logout from '../logout'
import { Grid, Typography } from '@mui/material';

const Navbar = () => {
    return (
        <Grid>
            <Nav>
                <Bars />
                <NavMenu>
                    <NavLink to='/'>
                        <Typography variant='h5'>Your books</Typography>
                    </NavLink>
                    <NavLink to='/explore'>
                        <Typography variant='h5'>Explore</Typography>
                    </NavLink>
                </NavMenu>
                <NavBtn>
                    <Logout />
                </NavBtn>
            </Nav>
        </Grid>
    );
};

export default Navbar;