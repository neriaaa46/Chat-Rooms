import {Modal} from 'react-bootstrap'

function ModalMessage(props){

    return <>
      <Modal className="modal-message" size="sm" show={props.smShow} aria-labelledby="example-modal-sizes-title-sm">
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-sm">
            הודעה:
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
            {props.messageModal}
        </Modal.Body>
      </Modal>
    </>
}

export default ModalMessage