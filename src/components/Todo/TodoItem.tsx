import { FormEvent, useState, useEffect, useContext } from 'react'
import cn from 'classnames'
import { BsCheck, BsTrash } from 'react-icons/bs'
import { todoType, todoTypeOne } from '../../types'
import { AiOutlineClose, AiOutlineEdit, AiOutlineLoading3Quarters } from 'react-icons/ai'
import SubmitButton from 'components/SubmitButton'
import { doBlur, forceCloseBlurs } from 'utils'

type Props = {
    id: string,
    isCompleted: boolean,
    content: string,
    deleteHandler: () => {},
    updateHandler: ({ content, isCompleted }: todoTypeOne) => {},
    changeIsCompleteHandler: () => {},
    status: todoType["status"]
    updatingId: todoType["updatingId"]

}

export default function TodoItem({ id, isCompleted, content, status, updatingId, deleteHandler, updateHandler, changeIsCompleteHandler }: Props) {


    const [editing, setEditing] = useState(false);
    const activeEditing = () => {
        setEditing(!editing);
        doBlur(editing, setEditing);


    }

    const EditingSubmitHandler = (e: FormEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & { content: { value: string } }
        updateHandler({ content: target.content.value })
        forceCloseBlurs()

    }


    useEffect(() => {
        if (updatingId === id && (status === 'success-editing')) activeEditing()
    }, [updatingId, id, status])

    return (
        <li className={cn(
            {
                'translate-x-[140%] opacity-40 pointer-events-none cursor-wait bg-red-300': status === 'deleting' && updatingId && updatingId.includes(id),
                'shadow-sm z-20 editing': editing
            },
            'note select-none duration-1000 transition-all flex flex-row gap-2 items-center justify-between border border-gray-100 p-3 rounded-md bg-white dark:bg-slate-300 dark:border dark:border-slate-300')} key={id}>
            {
                !editing && <>
                    <div onClick={changeIsCompleteHandler} className={cn(
                        {
                            'opacity-30': !isCompleted,
                            'animate-bounce': updatingId === id && status === 'updating-iscompleted'
                        },
                        'iscompleted bg-emerald-600 transition-all duration-300 cursor-pointer hover:scale-125  rounded-full')} >
                        {updatingId && updatingId.includes(id) && status === 'updating-iscompleted' ? <AiOutlineLoading3Quarters className="p-1  fill-white animate-spin" size={30} /> :
                            <BsCheck className="text-white " size={30} />
                        }

                    </div>
                    <span>{content}</span>
                    <div className="action-box flex flex-row gap-2 dark:bg-slate-100 dark:bg-opacity-30 p-2 dark:rounded-md dark:hover:bg-black dark:hover:scale-110 group duration-300 transition-all">
                        <BsTrash onClick={() => deleteHandler()} size={20} className="text-red-600 dark:text-slate-600 dark:group-hover:text-white  dark:hover:text-slate-800 hover:opacity-70 cursor-pointer hover:scale-110" />
                        <div onClick={(e) => { e.stopPropagation(); activeEditing() }} >
                            <AiOutlineEdit size={20} className="text-blue-600 dark:text-slate-600 dark:group-hover:text-white dark:hover:text-slate-800  hover:opacity-70 cursor-pointer hover:scale-110" />
                        </div>
                    </div>
                </>
            }
            {
                editing && <form className={cn('editdiv  relative flex flex-row gap-4 justify-between w-full  ', {
                    'opacity-40 pointer-events-none cursor-wait': updatingId === id && status === 'updating-editing'
                })} onSubmit={EditingSubmitHandler}>
                    <textarea className="w-full rounded-md border  p-1 dark:bg-slate-100 text-center  text-lg dark:focus:outline-none focus:outline-gray-200" name="content" defaultValue={content} />
                    <div className="flex flex-row  items-center gap-4">
                        <SubmitButton  icon={<BsCheck size={28} />} />
                        <button onClick={activeEditing} className="close-editing hover:underline hover:scale-125 transition-all duration-300"><AiOutlineClose size={20} /></button>
                    </div>
                    <div className="absolute w-full h-full flex justify-center items-center pointer-events-none ">
                        {updatingId === id && status === 'updating-editing' && <AiOutlineLoading3Quarters className="  fill-blue-500 dark:fill-black animate-spin" size={30} />}
                    </div>
                </form>
            }
        </li>
    )
}