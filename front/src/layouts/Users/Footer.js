import { Col, Container, Row } from "react-bootstrap";
import enamad from "../../assets/images/enamad.png";
import sabt from "../../assets/images/sabt.png";
import { socialNetworks } from "../../constants";

export default function Footer() {
  return (
    <div className="Footer bg-secondary text-white py-4">
      <Container>
        <Row className="justify-content-lg-between row-gap-3">
          <Col xs="12" md="6" lg="4">
            <div className="info">
              <h4 className="mb-3">آکادمی مارول ترید</h4>
              <p className="mb-0 fs-7 text-justify">
                مدرسه کریپتو مارول ترید در خدمت شماست شایان ذکر است تمامی آموزش
                های این پنل به صورت رایگان روی یوتوب قرار دارد و بخش هایی از
                آموزش های رایگان نیز روی همین سایت قرار گرفته و در بخش مدرسه به
                شکل یک دانشگاه کامل با شما کار خواهد شد تا تمامی فنون ترید را
                آموزش ببینید که این بخش ها شامل آزمون ها ، لایو ترید ها می باشد
                تا تمامی موارد را فرا بگیرید.
              </p>
            </div>
          </Col>
          <Col xs="12" md="6" lg="4">
            <div className="social-network d-flex align-items-center justify-content-between mb-4 w-100">
              {socialNetworks.map((item, index) => (
                <a className="transition" key={index} href={item.link}>
                  <i className={`h5 bi bi-${item.icon}`}></i>
                </a>
              ))}
            </div>
            <div className="marks opacity-0 d-flex align-items-start justify-content-between">
              <img className="w-50" src={sabt} alt="sabt" />
              <img className="w-50" src={enamad} alt="enamad" />
            </div>
          </Col>
          <hr className="col-12 my-2 bg-dark" />
          <Col xs="12">
            <p className="mb-0 text-center fs-7">
              &copy; کلیه حقوق وبسایت متعلق به مارول ترید می‌باشد.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
