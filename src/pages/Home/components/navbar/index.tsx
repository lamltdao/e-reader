import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
} from './NavbarElements';
import Logout from '../logout'

const Navbar = () => {
    return (
        <Nav>
            <Bars />
            <NavMenu>
                <NavLink to='/'>
                    Your books
                </NavLink>
                <NavLink to='/explore'>
                    Explore
                </NavLink>
                <NavLink to='/profile'>
                    Profile
                </NavLink>
            </NavMenu>
            <NavBtn>
                <Logout />
            </NavBtn>
        </Nav>
    );
};

export default Navbar;