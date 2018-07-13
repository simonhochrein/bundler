import * as React from "react";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, NavbarBrand, Input, Container, Row, Col } from "reactstrap";

class App extends React.Component {
    render() {
        return (
            <>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="#">Bundler</NavbarBrand>
                </Navbar>
                <Container fluid>
                    <Row>
                        <Col md={2}>
                            <h1>Sidebar</h1>
                        </Col>
                        <Col md={10}></Col>
                    </Row>
                </Container>
            </>
        );
    }
}

require("react-dom").render(<App />, document.querySelector("#root"));