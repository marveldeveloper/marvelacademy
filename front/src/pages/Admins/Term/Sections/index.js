import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { cloneDeep } from "lodash";
import { Table, Button, Modal } from "../../../../components";
import { axios } from "../../../../boot";
import { Context } from "..";
export default function Sections() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteId, setDeleteId] = useState(null);
  const { title, sections, setTerm } = useContext(Context);

  const deleteSection = () => {
    const url = "/admins/terms/section";
    const body = {
      termId: id,
      sectionIndex: `${deleteId}`,
    };
    axios.delete(url, { data: body }).then(() => {
      const newSections = cloneDeep(sections);
      newSections.splice(deleteId, 1);
      setTerm((p) => ({ ...p, sections: newSections }));
      setDeleteId(null);
    });
  };

  const addNewSection = () => {
    setTerm((p) => ({ ...p, sections: [...sections, []] }));
  };
  return (
    <div className="Sections">
      <Table>
        <thead>
          <tr>
            <th colSpan="3">{`جلسات ترم ${title}`}</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((activities, sectionIndex) => (
            <tr key={sectionIndex}>
              <td>{`جلسه ${sectionIndex + 1}`}</td>
              <td>{`${activities.length} فعالیت`}</td>
              <td className="d-flex flex-center gap-1">
                <Button
                  outline
                  variant="danger"
                  onClick={() => setDeleteId(sectionIndex)}
                >
                  حذف
                </Button>
                <Button outline onClick={() => navigate(`${sectionIndex}`)}>
                  جزئیات
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" className="text-center">
              <Button onClick={addNewSection}>افزودن جلسه جدید</Button>
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal
        title="حذف جلسه"
        type="warning"
        show={deleteId !== null}
        onHide={() => setDeleteId(null)}
      >
        <p>آیا از حذف جلسه مطمئن هستید؟</p>
        <div className="buttons">
          <Button variant="danger" onClick={() => setDeleteId(null)}>
            خیر
          </Button>
          <Button variant="success" onClick={deleteSection}>
            بله
          </Button>
        </div>
      </Modal>
    </div>
  );
}
