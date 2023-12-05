//Imports
import React from "react";
//Styles
import * as styled from "./styles";

export const Footer = () => {
    const currentDate = new Date();

    return (
        <styled.FooterWrapper>
            <styled.FooterHeading>
                It's Your Sky
            </styled.FooterHeading>
            <styled.CopyrightText>
                AkasaAir © {currentDate.getFullYear()}
            </styled.CopyrightText>
        </styled.FooterWrapper>
    );
};
