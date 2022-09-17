
type Props = {
    submitState: { status: string, message: string },

}

export default function ResponseMessage({ submitState: { status, message } }: Props) {
    return (
        <>
            {
                status === 'success' &&
                <div className='bg-green-100 px-3 py-4'>
                    {message}
                </div>
            }
            {
                status === 'error' &&
                <div className='bg-red-100 px-3 py-4'>
                    {message}
                </div>
            }
        </>

    )
}