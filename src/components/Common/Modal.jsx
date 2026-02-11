import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/slices/modalSlice';
import {
  fetchPostItem,
  fetchGetItem,
  fetchPutTask,
} from '../../redux/slices/apiSlice';
import { toast } from 'react-toastify';

const Modal = () => {
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const { modalType, task } = useSelector((state) => state.modal);
  // console.log(modalType, task);

  const state = useSelector((state) => state.auth.authData);
  const user = state?.sub;

  const showModalContents = (modalType, str1, str2, str3) => {
    switch (modalType) {
      case 'update':
        return str1;
      case 'detail':
        return str2;
      default:
        return str3;
    }
  };

  const modalTitle = showModalContents(
    modalType,
    '할일 수정하기',
    '할일 상세보기',
    '할일 추가하기'
  );
  const modalBtn = showModalContents(
    modalType,
    '할일 수정하기',
    '',
    '할일 추가하기'
  );

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    isCompleted: false,
    isImportant: false,
    userId: user,
  });

  useEffect(() => {
    if (modalType === 'detail' || modalType === 'update') {
      setFormData({
        title: task.title,
        description: task.description,
        date: task.date,
        isCompleted: task.iscompleted,
        isImportant: task.isimportant,
        _Id: task._id,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        isCompleted: false,
        isImportant: false,
        userId: user,
      });
    }
  }, [modalType, task, user]);

  // 입력창 폼 변경 함수
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log(name, value, type, checked);
    setFormData((prev) => ({
      ...prev,
      // input의 타입이 checked일 경우 checked 값, 아니면 일반 value 값
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 할일 추가 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 기능 차단

    // 입력 데이터 검증
    if (!user) {
      toast.error('잘못된 사용자입니다.');
      return;
    }
    if (!formData.title) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!formData.description) {
      toast.error('내용을 입력해주세요.');
      return;
    }
    if (!formData.date) {
      toast.error('날짜를 입력해주세요.');
      return;
    }
    // console.log(formData);
    try {
      if (modalType === 'create') {
        await dispatch(fetchPostItem(formData)).unwrap();
        toast.success('할 일이 추가되었습니다.');
      } else if (modalType === 'update') {
        await dispatch(fetchPutTask(formData)).unwrap();
        toast.success('할일을 수정했습니다.');
      }
    } catch (error) {
      console.log('Error Post or Put Item Data: ', error);
      toast.error('할일 추가 또는 수정에 실패했습니다. 콘솔을 확인해 주세요.');
    }
    handleCloseModal();

    await dispatch(fetchGetItem(user)).unwrap();
  };

  // 입력창 폼
  return (
    <div className="modal fixed bg-black bg-opacity-50 w-full h-full left-0 top-0 z-50 flex justify-center items-center">
      <div className="form-wrapper bg-gray-700 rounded-md w-1/2 flex flex-col items-center relative p-4">
        <h2 className="text-2xl py-2 border-b border-gray-300 w-fit font-semibold">
          {modalTitle}
        </h2>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="input-control">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="제목을 입력해주세요..."
              value={formData.title}
              onChange={handleChange}
              {...(modalType === 'detail' && { disabled: true })}
            />
          </div>
          <div className="input-control">
            <label htmlFor="description">내용</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              placeholder="내용을 입력해주세요..."
              onChange={handleChange}
              {...(modalType === 'detail' && { disabled: true })}
            />
          </div>
          <div className="input-control">
            <label htmlFor="date">입력 날짜</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              {...(modalType === 'detail' && { disabled: true })}
            />
          </div>
          <div className="input-control toggler">
            <label htmlFor="isCompleted">완료 여부</label>
            <input
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              onChange={handleChange}
              checked={formData.isCompleted}
              {...(modalType === 'detail' && { disabled: true })}
            />
          </div>
          <div className="input-control toggler">
            <label htmlFor="isImportant">중요성 여부</label>
            <input
              type="checkbox"
              id="isImportant"
              name="isImportant"
              onChange={handleChange}
              checked={formData.isImportant}
              {...(modalType === 'detail' && { disabled: true })}
            />
          </div>
          <div className="submit-btn flex justify-end">
            <button
              type="button"
              className={`flex justify-end bg-black py-3 px-6 rounded-md hover:bg-slate-900 ${
                modalType === 'detail' ? 'hidden' : ''
              }`}
              onClick={handleSubmit}
            >
              {modalBtn}
            </button>
          </div>
        </form>
        {/* 닫기 버튼 */}
        <IoMdClose
          className="absolute right-10 top-10 cursor-pointer"
          onClick={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Modal;
