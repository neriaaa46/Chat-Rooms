import {Row, Spinner} from 'react-bootstrap'


function Loader(){
    return <>
        <h3 className=" text-center mt-5">Loading</h3>
        <Row className="justify-content-center">
            <Spinner animation="border" variant="dark" />
        </Row>
    </>
}

export default Loader