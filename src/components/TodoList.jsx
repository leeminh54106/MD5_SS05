import { Button, Checkbox, Input, List } from 'antd';
import './todoList.scss';
import { useState } from 'react';

export default function TodoList() {
  //#region State dùng Thêm sửa xóa công việc
  const [listJob, setListJob] = useState(() => {
    const jobLocal = JSON.parse(localStorage.getItem('jobs')) || [];
    return jobLocal;
  });

  const [jobName, setJobName] = useState('');
  const [isError, setIsError] = useState('');
  const [editListJob, setEditListJob] = useState(null);
  //#endregion

  /**
   * Validate dữ liệu đầu vào
   * @param {*} value dữ liệu cần kiểm tra
   * @returns true Khi không có lỗi, False khi có lỗi
   * isDuplicate: Kiểm tra sữ tồn tại của tên công việc
   * Auth:NTSon (18/09/2024)
   */
  const validateData = (value, currentId = null) => {
    let isValid = true;
    if (!value) {
      setIsError('Tên công việc không được để trống.');
      isValid = false;
    } else {
      setIsError('');

      const isDuplicate = listJob.some(
        (job) => job.name.trim().toLowerCase() === value.trim().toLowerCase() && job.id !== currentId,
      );

      const isCurrentName = listJob.some(
        (job) => job.id === currentId && job.name.trim().toLowerCase() === value.trim().toLowerCase(),
      );

      if (isDuplicate && !isCurrentName) {
        setIsError('Tên công việc đã tồn tại.');
        isValid = false;
      }
    }
    return isValid;
  };

  /**
   * Lấy giá trị từ ô input
   * @param {*} e Thông tin từ sự kiện
   * Auth: NTSon (18/09/2024)
   */
  const handleChange = (e) => {
    const { value } = e.target;
    setJobName(value);
    if (value !== jobName) {
      validateData(value, editListJob);
    }
  };

  /**
   * Thêm mới công việc
   * isValid: Validate dữ liệu đầu vào
   * jobInfo: Tạo đối tượng job
   * Thêm đối tượng vào mảng
   * Clean giá trị trong Input
   */
  const handleAddJob = () => {
    const isValid = validateData(jobName);

    if (isValid) {
      const jobInfo = {
        id: Math.ceil(Math.random() * 1000),
        name: jobName.trim(),
        status: false,
      };

      const updateListJob = [...listJob, jobInfo];

      saveData('jobs', updateListJob);
      setJobName('');
      setIsError(false);
    }
  };

  /**
   * Thay đổi trạng thái status
   * @param {*} id Tìm Id cần thay đổi trạng thái
   * findIndexJob : Tìm kiếm vị trí của công việc cần thay đổi
   * Kiểm tra xem có tồn tại id không, Nếu có thì thay đổi trạng thái và ngược lại
   * Auth: NTSon (18/09/2024)
   */
  const handleChangeStatus = (id) => {
    const findIndexJob = listJob.findIndex((item) => item.id === id);
    if (findIndexJob !== -1) {
      listJob[findIndexJob].status = !listJob[findIndexJob].status;
    }
    const newListJob = [...listJob];
    saveData('jobs', newListJob);
  };

  /**
   * Xử lý chỉnh sửa công việc từ danh sách
   * @param {*} id Id của công việc cần chỉnh sửa
   * Auth: NTSon (18/09/2024)
   */
  const handleEditListJob = (id) => {
    const jobEditIndex = listJob.find((item) => item.id === id);

    if (jobEditIndex) {
      setJobName(jobEditIndex.name);
      setEditListJob(id);
    }
  };

  /**
   * Cập nhật công việc
   * isValid: Validate dữ liệu đầu vào
   * Cập nhật lại tên công việc
   * set ô input về rỗng
   * Reset id sửa
   */
  const handleEditJob = () => {
    const isValid = validateData(jobName, editListJob);
    if (isValid && editListJob !== null) {
      const updateJobs = listJob.map((item) => {
        if (item.id === editListJob) {
          return {
            ...item,
            name: jobName,
          };
        }
        return item;
      });
      saveData('jobs', updateJobs);
      setJobName('');
      setEditListJob(null);
    }
  };
  /**
   * Hàm xóa 1 công việc
   * @param {*} id Id cần xóa
   * @param {*} name Tên công việc cần xóa
   * Kiểm tra danh sách công việc nếu công việc rỗng ,
   * reset trang thái sửa, reset ô nhập liệu
   * Nếu công việc bị xóa là công việc đang sửa, reset ô nhập liệu
   * Auth: NTSon (18/09/2024)
   */
  const handleDeleteJob = (id, name) => {
    const isConfirm = confirm(`Bạn có muốn xóa tên công việc ${name} không ?`);

    if (isConfirm) {
      const filterJob = listJob.filter((item) => item.id !== id);

      if (filterJob.length === 0) {
        setEditListJob(null);
        setJobName('');
        setIsError('');
      } else if (editListJob === id) {
        setEditListJob(null);
        setJobName('');
        setIsError('');
      }

      saveData('jobs', filterJob);
    }
  };

  /**
   * Lưu dữ liệu vào localStorage và cập nhật danh sách công việc
   * @param {*} key - Khóa để lưu trữ dữ liệu trong localStorage
   * @param {*} array - Mảng dữ liệu cần lưu trữ
   * Auth: NTSon (18/09/2024)
   */
  function saveData(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
    setListJob(array);
  }

  // Lọc ra các công việc đã hoàn thành bằng trạng thái
  const completedJob = listJob.filter((job) => job.status).length;

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="border w-50% rounded-md px-5 py-6 shadow-sm">
          <h3 className="text-center font-semibold text-[30px] caret-slate-900 heading">Danh sách công việc</h3>
          <div className="flex items-center gap-2 mb-8 relative">
            <Input
              placeholder="Mời bạn nhập tên công việc"
              className="h-10 w-[500px]"
              name="jobName"
              value={jobName}
              onChange={handleChange}
            />

            {editListJob ? (
              <Button className="h-10 px-8 btn-warning" onClick={handleEditJob}>
                Sửa
              </Button>
            ) : (
              <Button className="h-10 px-8 btn-primary" onClick={handleAddJob}>
                Thêm
              </Button>
            )}

            {isError && <p className="error-description">{isError}</p>}
          </div>

          {/*Hiển thị danh sách công việc */}
          <ul className="jobList">
            {listJob.map((item) => (
              <li key={item.id} className="flex items-center justify-between border p-2 rounded shadow-sm ">
                <div className="flex items-center gap-2">
                  <Checkbox id={item.id} checked={item.status} onChange={() => handleChangeStatus(item.id)} />
                  <label htmlFor={item.id} className="cursor-pointer">
                    {item.status ? (
                      <s className="text-[16px] leading-loose">{item.name}</s>
                    ) : (
                      <span className="text-[16px] leading-loose">{item.name}</span>
                    )}
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <Button className="h-10 px-5 btn-warning" onClick={() => handleEditListJob(item.id)}>
                    Sửa
                  </Button>
                  <Button className="h-10 px-5 btn-danger" onClick={() => handleDeleteJob(item.id, item.name)}>
                    Xóa
                  </Button>
                </div>
              </li>
            ))}
            {/* Công việc đã hoàn thành xong */}
            <div className="border text-center p-2 mt-3 rounded shadow-sm">
              <span className="complete">Số lượng công việc đã hoàn thành: </span>
              <b className="complete-job">
                {completedJob} / {listJob.length}
              </b>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
}
