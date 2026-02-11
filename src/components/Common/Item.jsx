import React, { useState } from 'react';
import { MdEditDocument } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import {
  fetchUpdateCompleted,
  fetchGetItem,
  fetchDeleteItem,
} from '../../redux/slices/apiSlice';
import { openModal } from '../../redux/slices/modalSlice';
import { toast } from 'react-toastify';

const Item = ({ task }) => {
  const { _id, title, description, date, iscompleted, isimportant, userid } =
    task;

  console.log(task);
  const dispatch = useDispatch();
  const [isCompleted, setIsCompleted] = useState(iscompleted);

  // 할일 설명 자르기 함수
  const cutOverText = (text, length, lastDots) => {
    if (length === '' || length === null || length === undefined) {
      length = 20;
    }

    if (lastDots === '' || lastDots === null || lastDots === undefined) {
      lastDots = '...';
    }

    if (text.length > length) {
      text = text.substr(0, length) + lastDots;
    }

    return text;
  };

  // 할일 완료 상태 변경 함수
  const changeCompleted = async () => {
    // setIsCompleted(!isCompleted)을 호출하면 상태 업데이트가 비동기적으로 이루어지기 때문에, isCompleted의 값이 즉시 변경되지 않는다.
    // 따라서 updateCompletedData 객체를 생성할 때 isCompleted의 이전 값이 사용된다. 이로 인해 true/false가 한 단계씩 밀리게 된다.

    // 상태를 미리 업데이트 하여 반영된 값을 사용
    const newIsCompleted = !isCompleted;
    setIsCompleted(newIsCompleted);

    const updateCompletedKeys = {
      itemId: _id,
      isCompleted: newIsCompleted,
    };

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateCompletedKeys),
    };

    try {
      await dispatch(fetchUpdateCompleted(options)).unwrap();

      newIsCompleted
        ? toast.success('할일을 완료 했습니다.')
        : toast.success('할일이 진행 중입니다.');
      await dispatch(fetchGetItem(userid)).unwrap();
    } catch (error) {
      toast.error('상태 업데이트에 실패했습니다.');
    }
  };

  // 할일 삭제 함수
  const handleDeleteItem = async () => {
    const confirm = window.confirm('할일을 삭제하시겠습니까?');

    if (!confirm) return;

    if (!_id) {
      toast.error('잘못된 사용자 접근입니다.');
      return;
    }
    try {
      await dispatch(fetchDeleteItem(_id)).unwrap();
      toast.success('할일을 삭제했습니다.');
      await dispatch(fetchGetItem(userid)).unwrap();
    } catch (error) {
      toast.error('할일 삭제에 실패했습니다. 콘솔을 확인해 주세요.');
      console.log('Delete Failed:', error);
    }
  };

  // 할일 상세 보기 모달 열기 함수
  const handleDetailOpenModal = () => {
    dispatch(openModal({ modalType: 'detail', task: task }));
  };

  // 할일 수정 모달 열기 함수
  const handleEditOpenModal = () => {
    dispatch(openModal({ modalType: 'update', task: task }));
  };

  return (
    <div className="item w-1/3 h-[25vh] p-[0.25rem]">
      <div className="w-full h-full border border-gray-500 rounded-md flex py-3 px-4 flex-col justify-between bg-gray-950">
        <div className="upper">
          <h2 className="text-xl font-normal mb-3 relative pb-2 flex justify-between border-b">
            {/* 할일 제목 */}
            <span>{title}</span>
            {/* 자세히 버튼 */}
            <span
              className="text-sm py-1 px-3 border border-gray-500 rounded-sm hover:bg-gray-700 cursor-pointer"
              onClick={handleDetailOpenModal}
            >
              자세히
            </span>
          </h2>
          {/* 할일 내용 */}
          <p>{cutOverText(description)}</p>
        </div>
        <div className="lower">
          <p className="text-sm mb-1">{date}</p>
          <div className="item-footer flex justify-between">
            <div className="flex gap-2">
              {/* completed button */}
              {iscompleted ? (
                <button
                  className="block py-1 px-4 bg-green-400 text-sm text-white rounded-md"
                  onClick={changeCompleted}
                >
                  Completed
                </button>
              ) : (
                <button
                  className="block py-1 px-4 bg-cyan-500 text-sm text-white rounded-md"
                  onClick={changeCompleted}
                >
                  inCompleted
                </button>
              )}
              {/* important button */}
              {isimportant && (
                <button className="block py-1 px-4 bg-red-500 text-sm text-white rounded-md">
                  Important
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {/* edit button */}
              <button onClick={handleEditOpenModal}>
                <MdEditDocument className="w-5 h-5" />
              </button>
              {/* delete button */}
              <button onClick={handleDeleteItem}>
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
