import api from "./services/api";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ResponseMessage from "./components/ResponseMessage";
import { submitState, todoType, userNameStateT } from "./types";
import LabelFormInput from "./components/LabelFormInput";
import { TodoList } from "./components/Todo";
import { useRef } from 'react';
import cn from "classnames";







function App() {


  const [username, setUserName] = useState<userNameStateT["username"]>(null);
  const [todos, setTodos] = useState<todoType>({ todos: null, status: 'notfired' });
  const [submitState, setSubmitState] = useState<submitState>({ status: '', message: '', errorField: '' });

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & { username: { value: string } }

    if (target.username.value.length < 3) return setSubmitState({ status: 'error', message: 'Kullanıcı Adınız En Az 3 Karakterden Oluşmalıdır', errorField: "username" })
    setUserName(target.username.value)
    localStorage.setItem('username', target.username.value)

  }

  const effectRan = useRef(false)
  useEffect(() => {
    if (localStorage.hasOwnProperty('username')) setUserName(localStorage.getItem('username'))
    if (!effectRan.current) api.getAll(setTodos)
    return () => {
      effectRan.current = true;
    }
  }, [])





  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden dark:bg-slate-900 transition-all duration-1000">
      <div className="edit-overlay fixed overflow-hidden w-screen h-screen opacity-30  bg-black z-10 hidden " />
      <div className="flex-none">
        <Navbar user={{ username, setUserName }} />
      </div>
      <main className={cn({ 'm-auto': !username }, "flex justify-center items-center px-8 ")}>
        {
          <div className={cn({ 'hidden': !username },'w-full')}>
            <TodoList
              todosState={{ todos, setTodos }}
              initialLength={5}
            />
          </div>

        }
        {
          !username && <form className="flex flex-col justify-center items-center gap-4 " onSubmit={onSubmitHandler} action="#">
            <div className="border flex flex-col gap-4 max-w-xs p-5 shadow-lg rounded-lg">
              <LabelFormInput
                labelText="Kullanıcı Adınız"
                fieldName="username"
                errorState={submitState.errorField} />
              <input
                type="submit"
                value="Giriş Yap"
                className="cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-800 dark:hover:border-white border border-white dark:border-slate-800 bg-emerald-500 text-white rounded-md hover:scale-105 transition-all duration-300 hover:bg-emerald-600 py-2 hover:underline" />
            </div>
            <ResponseMessage submitState={submitState} />
          </form>
        }
      </main>

    </div>
  );
}

export default App;
