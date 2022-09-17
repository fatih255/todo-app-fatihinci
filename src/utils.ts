import { useState } from "react"

type onCountingType = {
    value?: number | string,
    store: (data: string | number | object | undefined) => void
}

type arrayCounterTypes = {
    array: string[] | number[]
    ms: number
    onCounting: ({ value, store }: onCountingType) => void
    onFinished: (storedData?: arrayCounterTypes["array"]) => void

}

export const UseArrayCounter = ({ array, ms, onCounting, onFinished }: arrayCounterTypes) => {
    const dataStore: any[] | undefined = [];
    var time = array.length,
        x = setInterval(function () {
            onCounting({
                value: array[--time],
                store: (data) => {
                    if (data) dataStore.push(data);
                }
            });
            if (time === 0) {
                onFinished(dataStore);
                clearInterval(x);
            }
        }, ms);
};


export function doBlur(editing: boolean, setEditing: React.Dispatch<React.SetStateAction<boolean>>) {
    const editOverlay = document.querySelector('.edit-overlay') as HTMLElement;
    const todoslist = document.querySelector('.todoslist') as HTMLElement;
    const createForm = document.querySelector('.create-form') as HTMLElement;
    const countTodos = document.querySelector('.count-todos') as HTMLElement;
    const todoListBottom = document.querySelector('.todolistbottom') as HTMLElement;

    if (editOverlay && todoslist && createForm && countTodos && todoListBottom) {
        if (editing) {
            countTodos.classList.remove('doblur')
            countTodos.classList.remove('active-edit')
            todoListBottom.classList.remove('doblur')
            todoListBottom.classList.remove('active-edit')
            createForm.classList.remove('doblur')
            createForm.classList.remove('active-edit')
            todoslist.classList.remove('active-edit')
            editOverlay.classList.remove('active')
        }
        if (!editing) {
            countTodos.classList.add('doblur')
            countTodos.classList.add('active-edit')
            todoListBottom.classList.add('doblur')
            todoListBottom.classList.add('active-edit')
            createForm.classList.add('doblur')
            createForm.classList.add('active-edit')
            todoslist.classList.add('active-edit')
            editOverlay.classList.add('active')
        }
        editOverlay.onclick = () => {
            setEditing(false);
            countTodos.classList.remove('doblur')
            countTodos.classList.remove('active-edit')
            todoListBottom.classList.remove('doblur')
            todoListBottom.classList.remove('active-edit')
            createForm.classList.remove('doblur')
            createForm.classList.remove('active-edit')
            editOverlay.classList.remove('active')
            todoslist.classList.remove('active-edit')
            editOverlay.style.display = 'none';
            //return null
        }
    }
}

export function forceCloseBlurs() {
    const editOverlay = document.querySelector('.edit-overlay') as HTMLElement;
    const todoslist = document.querySelector('.todoslist') as HTMLElement;
    const createForm = document.querySelector('.create-form') as HTMLElement;
    const countTodos = document.querySelector('.count-todos') as HTMLElement;
    const todoListBottom = document.querySelector('.todolistbottom') as HTMLElement;

    if (editOverlay && todoslist && createForm && countTodos && todoListBottom) {
        countTodos.classList.remove('doblur')
        countTodos.classList.remove('active-edit')
        todoListBottom.classList.remove('doblur')
        todoListBottom.classList.remove('active-edit')
        createForm.classList.remove('doblur')
        createForm.classList.remove('active-edit')
        editOverlay.classList.remove('active')
        todoslist.classList.remove('active-edit')
        editOverlay.style.display = 'none';
    }
}