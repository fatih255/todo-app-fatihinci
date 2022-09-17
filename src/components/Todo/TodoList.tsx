import { FormEvent, useRef, useState, useEffect } from 'react'
import { BsCheck2Circle, BsPlusCircleFill, BsTrash } from 'react-icons/bs'
import api from '../../services/api'
import { todoType } from '../../types'
import TodoItem from './TodoItem'
import cn from 'classnames'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MdClose } from 'react-icons/md'
import SelectCloud from 'select-cloud'
import { clean } from "select-cloud/lib/SelectCloudWorker";


type Props = {
    todosState: { todos: todoType, setTodos: React.Dispatch<React.SetStateAction<todoType>> }
    initialLength?: number,
}

export default function TodoList({ todosState: { todos: { todos, status, updatingId }, setTodos }, initialLength = 5 }: Props) {

    const [selectable, setSelectable] = useState(true);
    const [currentLength, setCurrentLength] = useState(initialLength);
    const [selectedCloud, setSelectedCloud] = useState<string[]>([]);
    const [showAll, setShowAll] = useState(false);

    let lengthCounter = useRef(1);
    const loadMoreHandler = () => {
        if (todos?.length) {

            lengthCounter.current++;
            if (initialLength * lengthCounter.current > todos.length) setCurrentLength(todos.length);
            setCurrentLength(initialLength * lengthCounter.current);

            resizeObserver.observe(document.body)
        }
    }
    const addTodoHandler = (e: FormEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & { content: { value: string } }
        api.create({ content: target.content.value }, { todos }, setTodos)

    }





    const deleteCloudSelectionHandler = async () => {
        await api.deleteOne(selectedCloud, { todos }, setTodos, "deleting", "success-deleting")
        setSelectedCloud([])
    };
    const multipleUpdateIsCompletedHandler = async () => {

        await api.update(selectedCloud, { isCompleted: true }, { todos: todos, updatingId: selectedCloud }, setTodos, "updating-iscompleted", 'success-iscomplete')
        clean()
        setSelectedCloud([])
    }
    //api.deleteOne(noteID, { todos, updatingId: noteID }, setTodos)

    // create an Observer instance
    const resizeObserver = new ResizeObserver(entries => {
        const todolistbottom = document.querySelector('.todolistbottom') as HTMLElement;
        const todoslist = document.querySelector('.todoslist') as HTMLElement;
        if (entries[0].target.clientHeight > window.innerHeight) {
            todolistbottom.classList.add("fixed");
            todolistbottom.classList.add("bottom-0");
            todolistbottom.classList.add("left-0");
            todoslist.classList.add("mb-14")
        }
        window.scrollTo({
            top: entries[0].target.clientHeight,
            behavior: 'smooth'
        });
        resizeObserver.disconnect();
    }
    )




    return (
        <div className="flex flex-col w-full py-10">
            <form onSubmit={addTodoHandler} className="create-form flex flex-row gap-3 justify-center items-center">
                <textarea
                    placeholder="Eklemek istediğiniz notu yazınız...."
                    className={cn({ 'pointer-events-none opacity-30': status === 'creating' }, 'dark:bg-slate-300 dark:placeholder-slate-700 dark:focus:border-[1px] w-full border p-1 focus:outline-gray-200 rounded-md px-2 py-3 text-lg transition-all duration-1000')}
                    rows={1}
                    name="content" />
                <button className={cn({ 'pointer-events-none opacity-60 dark:opacity-75': status === 'creating' })} type="submit">
                    {status === 'creating' && <AiOutlineLoading3Quarters className="p-2 bg-emerald-500 dark:bg-white dark:fill-black rounded-full fill-white animate-spin" size={35} />}
                    {status !== 'creating' && <BsPlusCircleFill size={35} className="text-emerald-500  dark:text-white hover:scale-125 cursor-pointer transition-all duration-300" />}
                </button>
            </form>
            <div className=" flex flex-col gap-4">
                <div className="count-todos">
                    {todos && <span className="dark:text-white transition-all duration-1000">{`${todos?.length} adet Notunuz Var`}</span>}
                </div>
                <SelectCloud
                    selectable={selectable}
                    options={{
                        itemsClass: "note",
                        containerClass: "selection-area",
                        crossEffect({ style, classList }) {
                            classList.add("!bg-blue-100")
                            classList.add("dark:!bg-gray-700")
                            classList.add("dark:!text-white")
                            classList.add("!bg-opacity-30")
                            classList.add("!border-blue-400")
                            classList.add("dark:!border-white")

                        },
                        onComplete({ getAttributes }) {
                            setSelectedCloud(getAttributes("data-id"))
                        }
                    }}>
                    <ul className="doblur todoslist flex flex-col gap-4  selection-area ">
                        {
                            todos && todos.length && todos.slice(0, currentLength).map(({ id, content, isCompleted }) =>
                                <TodoItem
                                    key={id}
                                    id={id}
                                    content={content}
                                    isCompleted={isCompleted}
                                    status={status}
                                    updatingId={updatingId}
                                    setSelectableState={setSelectable}
                                    deleteHandler={() => api.deleteOne(id, { todos, updatingId: id }, setTodos, "deleting", "success-deleting")}
                                    updateHandler={(update) => api.update(id, update, { todos, updatingId: id }, setTodos, "updating-editing", 'success-editing')}
                                    changeIsCompleteHandler={() => api.update(id, { isCompleted: !isCompleted }, { todos: todos, updatingId: id }, setTodos, "updating-iscompleted", 'success-iscomplete')}
                                />
                            )
                        }
                    </ul>
                </SelectCloud>
                <div className="todolistbottom bg-white dark:bg-slate-800 dark:border-t-slate-600 w-full rounded-md border-t py-5 text-center transition-all duration-1000">

                    {
                        selectedCloud.length > 0 && <>
                            <button
                                className="mr-4 rounded-md bg-gray-500 dark:bg-slate-900 dark:hover:bg-slate-700 text-white py-2 px-4 hover:bg-gray-600 transition-all duration-1000"
                                onClick={() => { clean(); setSelectedCloud([]) }} >
                                <MdClose className="inline mr-2" size={20} />
                                Seçimi İptal Et
                            </button>
                            <button
                                className="mr-4 rounded-md bg-red-500 dark:bg-slate-900 dark:hover:bg-slate-700 text-white py-2 px-4 hover:bg-red-600 transition-all duration-1000"
                                onClick={deleteCloudSelectionHandler} >
                                <BsTrash className="inline mr-2" size={20} />
                                Seçilen Notları Sil
                            </button>
                            <button
                                className="mx-4 rounded-md bg-blue-500 dark:bg-slate-900 dark:hover:bg-slate-700 text-white py-2 px-4 hover:bg-blue-600 transition-all duration-1000"
                                onClick={multipleUpdateIsCompletedHandler} >
                                <BsCheck2Circle className="inline mr-2" size={20} />
                                Seçilen Notları Yapıldı Olarak İşaretle
                            </button>
                        </>
                    }

                    {todos && todos.length > initialLength ? showAll || currentLength > todos?.length ?
                        <button onClick={() => { setCurrentLength(initialLength); setShowAll(false); setSelectedCloud([]); clean(); lengthCounter.current = 1 }} className="rounded-md bg-emerald-500 text-white py-2 px-4 hover:bg-emerald-600 transition-all duration-1000 dark:hover:bg-slate-700 dark:bg-slate-900">Küçült</button>
                        : <button onClick={loadMoreHandler} className={cn({ "hidden": currentLength > todos?.length }, "rounded-md bg-emerald-500 dark:bg-slate-900 dark:hover:bg-slate-700 text-white py-2 px-4 hover:bg-emerald-600 transition-all duration-1000")}>Devamını Yükle</button> : <></>}

                    {!showAll && todos && todos.length > initialLength && <button onClick={() => { setCurrentLength(todos.length); setShowAll(true); setSelectedCloud([]); clean(); resizeObserver.observe(document.body) }} className={cn({ "hidden": currentLength > todos?.length }, "transition-all duration-1000 rounded-md ml-4 bg-emerald-500 dark:bg-slate-900 dark:hover:bg-slate-700 text-white py-2 px-4 hover:bg-emerald-600 ")}>Hepsini Yükle</button>}
                </div>
            </div>
            <div className={cn({ "hidden": status !== "loading" }, "w-full flex justify-center items-center my-auto h-[20rem] px-2 py-3")}>{
                <>
                    {
                        todos && !(todos.length > 0) && status === 'success' ? 'Kayıtlı Not Bulunamadı' :
                            status === "loading" ? <AiOutlineLoading3Quarters className="p-2  bg-emerald-500 dark:bg-black dark:hover:bg-slate-700 rounded-full fill-white animate-spin" size={35} /> : <></>
                    }
                </>

            }</div>

        </div >
    )
}