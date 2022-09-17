
export type userNameStateT = {
    username: string | null,
    setUserName: React.Dispatch<React.SetStateAction<string | null>>
}
export type submitState = {
    status: string,
    message: string,
    errorField: string
}

export type todoType = {
    status?: 'loading' | 'success' | 'success-iscomplete' | 'success-editing' | 'success-deleting' | 'error' | 'notfired' | 'deleting' | 'updating' | 'updating-iscompleted' | 'updating-editing' | 'creating'
    success?: 'success' | 'success-editing' | 'success-iscomplete' | 'success-deleting'
    updatingId?: string | string[];
    todos: {
        content: string,
        isCompleted: boolean,
        id: string
    }[] | null
};


export type todoTypeOne = {
    content?: string,
    isCompleted?: boolean,
    id?: string
}
