//Imports
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
//Contexts
import { Context } from "../../../context/UserContext";
import { PostContext } from "../../../context/PostContext";
//Components
import { PostForm } from "../../../components/Form/PostForm";
import { Loader } from "../../../components/Layout/Loader";

export const CreatePost = () => {
    //contexts
    const { authenticated } = useContext(Context);
    const { isLoading, createPost } = useContext(PostContext);
    //hooks
    const navigate = useNavigate();

    //useEffect to redirect user to home if not authenticated
    useEffect(() => {
        if (!authenticated) {
            navigate("/home");
        }
    }, [authenticated]);

    return (
        <>
            {authenticated ? (
                <PostForm
                    btnText="Create Post"
                    headingText="Create Post"
                    subHeadingText="Write and share your experience"
                    handleSubmit={createPost}
                />
            ) : null}
            {isLoading && <Loader />}
        </>
    );
};
