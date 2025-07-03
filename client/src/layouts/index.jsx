import {styled} from "@mui/material/styles";
import {Outlet} from "react-router-dom";

const Root = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
}));

const Main = styled("div")(() => ({
    flex: 1,
    display: "flex",
    flexDirection: "column"
}));

function Layout() {
    return (
        <Root>
            <Main>
                <Outlet />
            </Main>
        </Root>
    );
}

export default Layout;