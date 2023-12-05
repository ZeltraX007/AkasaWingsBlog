//Imports
import React from "react";
import { useNavigate } from "react-router-dom";
//Styles
import * as Styled from "./styles";
//Components
import { Heading } from "../../components/Layout/Heading";
import { TextComponent } from "../../components/Layout/TextComponent";
import { Button } from "../../components/Layout/Button";

export const Page404 = () => {
    //hook
    const navigate = useNavigate();

    //function to redirect user to home
    const redirectToHome = () => {
        navigate("/");
    };

    return (
        <Styled.Container>
            <Heading text="404: Page not found" />
            <TextComponent>
            The requested page cannot be found
            </TextComponent>
            <Button
                uppercase
                text="Return To home"
                onClickFn={redirectToHome}
            />
        </Styled.Container>
    );
};
