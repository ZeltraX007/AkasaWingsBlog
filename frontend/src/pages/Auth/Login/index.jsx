//Imports
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//Contexts
import { Context } from "../../../context/UserContext";
//Components
import { FormContainer } from "../../../components/Form/FormContainer";
import { Input } from "../../../components/Form/Input";
import { Button } from "../../../components/Layout/Button";
import { Loader } from "../../../components/Layout/Loader";
import { FormHeader } from "../../../components/Form/FormHeader";

export const Login = () => {
    //initial states
    const [user, setUser] = useState({});
    //contexts
    const { login, loading, authenticated } = useContext(Context);
    //hooks
    const navigate = useNavigate();

    //function to handle submit
    const handleOnSubmit = (e) => {
        e.preventDefault();
        login(user);
    };

    //function to handle on change submit
    const handleOnChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    //useEffect to redirect user if authenticated
    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, []);

    return (
        !authenticated && (
            <>
                <FormContainer onSubmitFn={handleOnSubmit}>
                    <FormHeader
                        headingText="Login"
                        subHeadingText="Log in to access your account"
                    />
                    <Input
                        inputType="email"
                        placeholderText="Useremail"
                        labelText="Email:"
                        inputName="email"
                        onChangeFn={handleOnChange}
                    />
                    <Input
                        inputType="password"
                        placeholderText="Enter your password"
                        labelText="Password:"
                        inputName="password"
                        onChangeFn={handleOnChange}
                    />
                    <Button
                        type="submit"
                        text="Login"
                        maxWidth
                        variant="success"
                        uppercase
                    />
                </FormContainer>
                {loading && <Loader />}
            </>
        )
    );
};
