//Imports
import { useContext, useState } from "react";
//Styles
import * as styled from "./styles";
//Components
import { NavLink } from "../NavLink";
//Contexts
import { Context } from "../../../context/UserContext";

export const Navbar = () => {
    //initial state
    const [isOpen, setIsOpen] = useState(false);
    //context
    const { authenticated, logout } = useContext(Context);

    //function to open navbar
    const handleNavbarOpen = () => {
        setIsOpen(true);
    };

    //function to close navbar
    const handleNavbarClose = () => {
        setIsOpen(false);
    };

    //function to logout user on navlink click
    const handleLogout = () => {
        logout();
        handleNavbarClose();
    };

    return (
        <styled.Nav>
            <styled.Nav_brand to="/">
                Akasa<styled.bold_Effect>Wings</styled.bold_Effect>Blog
            </styled.Nav_brand>
            <styled.Menu open={isOpen ? 1 : 0}>
                <styled.CloseIcon
                    onClick={handleNavbarClose}
                    aria-label="Close Icon"
                />
                <styled.List_Item>
                    <NavLink
                        text={"Home"}
                        path={"/home"}
                        onclickFn={handleNavbarClose}
                    />
                </styled.List_Item>
                {authenticated ? (
                    <>
                        <styled.List_Item>
                            <NavLink
                                text={"Post Blog"}
                                path={"/post/create"}
                                onclickFn={handleNavbarClose}
                            />
                        </styled.List_Item>
                        <styled.List_Item>
                            <NavLink
                                text={"Dashboard"}
                                path={"/users/dashboard"}
                                onclickFn={handleNavbarClose}
                            />
                        </styled.List_Item>
                    </>
                ) : (
                    <>
                        <styled.List_Item>
                            <NavLink
                                text={"Login"}
                                path={"/login"}
                                onclickFn={handleNavbarClose}
                            />
                        </styled.List_Item>
                        <styled.List_Item>
                            <NavLink
                                text={"Register"}
                                path={"/register"}
                                onclickFn={handleNavbarClose}
                            />
                        </styled.List_Item>
                    </>
                )}

                {authenticated && (
                    <styled.List_Item>
                        <styled.LogoutText onClick={handleLogout}>
                            Logout
                        </styled.LogoutText>
                    </styled.List_Item>
                )}
            </styled.Menu>
            <styled.HamburgerIcon
                onClick={handleNavbarOpen}
                aria-label="Hamburger Icon"
            />
        </styled.Nav>
    );
};
