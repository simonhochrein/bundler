import * as React from "react";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, NavbarBrand, Input, Container, Row, Col } from "reactstrap";

class App extends React.Component {
    render() {
        return (
            <>
                <Navbar color="dark" dark expand="md" className="p-0 flex-md-nowrap">
                    <NavbarBrand className={"col-md-2"} href="#">Bundler</NavbarBrand>
                    <Input className={"w-100 form-control-dark"} />
                </Navbar>
                <Container fluid>
                    <Row>
                        <Col md={2}>
                            <Navbar className={"sidebar"} sticky={"sidebar"} light>
                                <NavbarBrand>Test</NavbarBrand>
                            </Navbar>
                        </Col>
                        <Col md={10}></Col>
                    </Row>
                </Container>
            </>
        );
    }
}

require("react-dom").render(<App />, document.querySelector("#root"));