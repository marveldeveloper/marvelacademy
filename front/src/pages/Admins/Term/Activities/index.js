import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { cloneDeep } from "lodash";
import { Button, Modal, Table } from "../../../../components";
import { activityTypes } from "../../../../constants";
import { axios } from "../../../../boot";
import { Context } from "..";
import AddNewActivity from "./AddNewActivity";
export default function Activities() {
  const navigate = useNavigate();
  const { id, sectionIndex } = useParams();
  const { title, sections, setTerm } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const deleteActivity = () => {
    const url = "/admins/terms/activity";
    const body = {
      termId: id,
      activityIndex: `${deleteId}`,
      sectionIndex,
    };
    axios.delete(url, { data: body }).then(() => {
      const newSections = cloneDeep(sections);
      newSections[sectionIndex].splice(deleteId, 1);
      setTerm((p) => ({ ...p, sections: newSections }));
      setDeleteId(null);
    });
  };
  return (
    <div className="Activities">
      {sections[sectionIndex] !== undefined ? (
        <React.Fragment>
          <Table>
            <thead>
              <tr>
                <th colSpan="4">{`ترم ${title} >> جلسه ${
                  +sectionIndex + 1
                } >> فعالیت‌ها`}</th>
              </tr>
              <tr>
                <th>فعالیت</th>
                <th>موضوع</th>
                <th>نوع فعالیت</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sections[sectionIndex].map((activity, activityIndex) => (
                <tr key={activityIndex}>
                  <td>{activityIndex + 1}</td>
                  <td>{activity.title}</td>
                  <td>{activityTypes.findById(activity.type).name}</td>
                  <td>
                    <div className="d-flex flex-center gap-1">
                      <Button
                        outline
                        variant="danger"
                        onClick={() => setDeleteId(activityIndex)}
                      >
                        حذف
                      </Button>
                      <Button
                        onClick={() => navigate(`${activityIndex}`)}
                        outline
                      >
                        جزئیات
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="text-center">
                  <Button onClick={() => setShowModal(true)}>
                    افزودن فعالیت جدید
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
          <AddNewActivity show={showModal} onHide={setShowModal} />
          <Modal
            title="هشدار"
            type="warning"
            show={deleteId !== null}
            onHide={() => setDeleteId(null)}
          >
            <p>آیا از حذف فعالیت اطمینان دارید؟</p>
            <div className="buttons">
              <Button variant="danger" onClick={() => setDeleteId(null)}>
                خیر
              </Button>
              <Button variant="success" onClick={deleteActivity}>
                بله
              </Button>
            </div>
          </Modal>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p className="text-center mb-3">جلسه مورد نظر یافت نشد!</p>
          <Button
            className="mx-auto d-block"
            onClick={() => navigate(`/admins/terms/${id}`, { replace: true })}
          >
            بازگشت
          </Button>
        </React.Fragment>
      )}
    </div>
  );
}
