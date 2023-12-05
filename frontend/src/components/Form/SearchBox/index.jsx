//Imports
import P from "prop-types";
//Styles
import * as Styled from "./styles";
//Components
import { Heading } from "../../Layout/Heading";
import { Button } from "../../Layout/Button";

export const SearchBox = ({ OnChangeFn, OnClickFn }) => {
    return (
        <Styled.Container>
            <Heading
                text="See our most recent posts"
                type="h3"
                size="large"
                bold="bold"
                center={true}
            />
            <Styled.SearchWrapper>
                <Styled.SearchInput
                    type="text"
                    placeholder="Search by tags..."
                    onChange={OnChangeFn}
                />
                <Button text="Search" onClickFn={OnClickFn} />
            </Styled.SearchWrapper>
        </Styled.Container>
    );
};

//PropTypes validation
SearchBox.propTypes = {
    OnChangeFn: P.func,
    OnClickFn: P.func,
};
