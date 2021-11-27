import {Container} from "react-bootstrap"


function HomePage(){

    return <>
        <Container>
            <h1 className="header text-center">Chat Application</h1>
            <div className="d-flex justify-content-center">
                <div className="welcome-msg">
                    <p>Welcome, to get started you need to log in,
                    if you have not yet registered you must
                    register for the site.</p>
                </div>
            </div>
        </Container>
    </>
}

export default HomePage